// Inspect a bounded suffix as content arrives; never alter the model's output.
const MIN_REPEATED_CHARS = 192;
const MIN_REPEATS = 4;
const MAX_PERIOD = 256;
const MAX_TAIL = 2048;
const CHECK_STEP = 32;
const MAX_CLAUSES = 12;
const MAX_CLAUSE_CHARS = 512;

function normalize(text) {
	return String(text || '').normalize('NFKC').toLowerCase().replace(/[\s\p{P}]/gu, '');
}

function createModelOutputLoopDetector({ sourceTexts = [], structured = false } = {}) {
	// JSON punctuation, case and whitespace can be the correction itself.
	// Preserve them in the formatting stage instead of conflating values.
	const normalizeOutput = structured ? text => String(text || '') : normalize;
	const sources = sourceTexts.map(normalizeOutput).filter(Boolean);
	let tail = '';
	let charsSinceCheck = 0;
	let clauseBuffer = '';
	const clauses = [];
	let detected = null;
	const isSourceExcerpt = text => text.length < MAX_TAIL && sources.some(source => source.includes(text));

	function checkPeriodicTail() {
		if (tail.length < MIN_REPEATED_CHARS) return null;
		const maxPeriod = Math.min(MAX_PERIOD, Math.floor(tail.length / MIN_REPEATS));
		for (let period = 1; period <= maxPeriod; period += 1) {
			const unit = tail.slice(-period);
			if (tail.slice(-2 * period, -period) !== unit) continue;
			const repeats = Math.max(MIN_REPEATS, Math.ceil(MIN_REPEATED_CHARS / period));
			if (repeats * period > tail.length || !tail.endsWith(unit.repeat(repeats))) continue;
			// Extend to the entire repeating suffix, so copying a genuine quote is
			// allowed but endlessly continuing that quote is still detected.
			let length = repeats * period;
			while (length < tail.length && tail[tail.length - length - 1] === tail[tail.length - length - 1 + period]) length += 1;
			if (!isSourceExcerpt(tail.slice(-length))) return { kind: 'periodic', repeated_chars: length };
		}
		return null;
	}

	function checkClause(raw) {
		const clause = normalizeOutput(raw);
		if (!clause) return null;
		if (clause.length > MAX_CLAUSE_CHARS) {
			clauses.length = 0;
			return null;
		}
		clauses.push(clause);
		if (clauses.length > MAX_CLAUSES) clauses.shift();
		const span = clauses.join('');
		if (clauses.length < 6 || span.length < MIN_REPEATED_CHARS) return null;
		const counts = new Map();
		clauses.forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
		// Several stock phrases can alternate in an irregular order. Distinct
		// paragraph numbers and new corrections count as progress, not a loop.
		if (counts.size > 3) return null;
		let repeatedChars = 0;
		for (const [value, count] of counts) {
			if (value.length >= 8 && count >= 3) repeatedChars += value.length * count;
		}
		if (repeatedChars >= span.length * 0.85 && !isSourceExcerpt(span)) {
			return { kind: 'repeated_clauses', repeated_chars: repeatedChars };
		}
		return null;
	}

	return {
		push(text) {
			if (detected) return detected;
			const raw = String(text || '');
			const normalized = normalizeOutput(raw);
			// Scan inside large deltas too: a proxy may buffer an entire loop in
			// one event. Keep the same bound for token-sized and buffered events.
			for (let offset = 0; offset < normalized.length;) {
				const length = Math.min(CHECK_STEP - charsSinceCheck, normalized.length - offset);
				tail = (tail + normalized.slice(offset, offset + length)).slice(-MAX_TAIL);
				offset += length;
				charsSinceCheck += length;
				if (charsSinceCheck === CHECK_STEP) {
					charsSinceCheck = 0;
					detected = checkPeriodicTail();
					if (detected) return detected;
				}
			}
			if (!structured) {
				const parts = (clauseBuffer + raw).split(/[。！？!?；;，,\n]+/u);
				clauseBuffer = parts.pop();
				for (const part of parts) {
					detected = checkClause(part);
					if (detected) return detected;
				}
				if (clauseBuffer.length > MAX_CLAUSE_CHARS) {
					clauseBuffer = clauseBuffer.slice(-MAX_CLAUSE_CHARS);
					clauses.length = 0;
				}
			}
			return null;
		},
	};
}

module.exports = { createModelOutputLoopDetector };
