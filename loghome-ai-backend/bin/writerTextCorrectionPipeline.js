function buildCorrectionPlan(paragraphs, { segmentChars = 1400, batchChars = 2800, batchParagraphs = 12 } = {}) {
	const segments = [];
	paragraphs.forEach((paragraph, sourceIndex) => {
		let offset = 0;
		while (offset < paragraph.text.length) {
			let end = Math.min(offset + segmentChars, paragraph.text.length);
			// 尽量在句末拆分；长句使用少量重叠，避免漏掉边界处的错字。
			if (end < paragraph.text.length) {
				const candidate = paragraph.text.slice(offset, end);
				const boundaries = [...candidate.matchAll(/[。！？；\n]/g)];
				const boundary = boundaries.length ? boundaries[boundaries.length - 1].index + 1 : 0;
				if (boundary >= segmentChars / 2) end = offset + boundary;
				const lastCode = paragraph.text.charCodeAt(end - 1);
				if (lastCode >= 0xd800 && lastCode <= 0xdbff) end -= 1;
			}
			segments.push({
				...paragraph,
				paragraph_index: segments.length + 1,
				text: paragraph.text.slice(offset, end),
				source_index: sourceIndex,
				source_offset: offset,
			});
			if (end === paragraph.text.length) break;
			offset = end - Math.min(80, Math.floor((end - offset) / 4));
			const firstCode = paragraph.text.charCodeAt(offset);
			if (firstCode >= 0xdc00 && firstCode <= 0xdfff) offset -= 1;
		}
	});
	const batches = [];
	let batch = [];
	let chars = 0;
	segments.forEach(segment => {
		if (batch.length && (chars + segment.text.length > batchChars || batch.length >= batchParagraphs)) {
			batches.push(batch);
			batch = [];
			chars = 0;
		}
		batch.push(segment);
		chars += segment.text.length;
	});
	if (batch.length) batches.push(batch);
	return { segments, batches };
}

function mergeParagraphSegments(paragraph, segments) {
	const fragments = segments.flatMap(({ segment, result }) => (result.fragments || []).map(fragment => ({
		...fragment,
		begin_pos: fragment.begin_pos + segment.source_offset,
		end_pos: fragment.end_pos + segment.source_offset,
	}))).sort((left, right) => left.begin_pos - right.begin_pos || left.end_pos - right.end_pos);
	const accepted = [];
	for (const fragment of fragments) {
		const previous = accepted[accepted.length - 1];
		// 重叠切片会重复报告同一处问题；冲突片段不能重复替换原文。
		if (!previous || fragment.begin_pos >= previous.end_pos) accepted.push(fragment);
	}
	let cursor = 0;
	let corrected = '';
	accepted.forEach(fragment => {
		corrected += paragraph.text.slice(cursor, fragment.begin_pos) + fragment.corrected_fragment;
		cursor = fragment.end_pos;
	});
	corrected += paragraph.text.slice(cursor);
	const errors = segments.map(item => item.result.error).filter(Boolean);
	return {
		paragraph_index: paragraph.paragraph_index,
		paragraph_id: paragraph.paragraph_id,
		paragraph_hash: paragraph.paragraph_hash,
		original_text: paragraph.text,
		corrected_text: corrected,
		has_issue: accepted.length > 0,
		fragments: accepted,
		error: errors.length ? errors[0] : null,
	};
}

async function runCorrectionPlan(paragraphs, options) {
	const plan = buildCorrectionPlan(paragraphs, options);
	const { analyzeBatch, shouldStop = () => false, onParagraphResult = () => {}, onProgress = () => {} } = options;
	const pending = paragraphs.map(() => []);
	const expected = paragraphs.map(() => 0);
	plan.segments.forEach(segment => { expected[segment.source_index] += 1; });
	const results = new Array(paragraphs.length);
	let nextBatch = 0;
	let requestCount = 0;
	let analyzed = 0;
	let failed = 0;
	function record(segment, result) {
		const sourceIndex = segment.source_index;
		pending[sourceIndex].push({ segment, result });
		if (pending[sourceIndex].length !== expected[sourceIndex]) return;
		const merged = mergeParagraphSegments(paragraphs[sourceIndex], pending[sourceIndex]);
		results[sourceIndex] = merged;
		if (merged.error) failed += 1;
		else analyzed += 1;
		onParagraphResult(merged);
		onProgress({ analyzed, failed, total: paragraphs.length });
	}
	async function runBatch(batch, retryBudget, batchIndex) {
		if (shouldStop()) return;
		requestCount += 1;
		try {
			const batchResults = await analyzeBatch(batch, { batchIndex, batchCount: plan.batches.length });
			if (shouldStop()) return;
			if (!Array.isArray(batchResults) || batchResults.length !== batch.length) {
				throw new Error('模型未返回完整的段落结果');
			}
			batch.forEach((segment, index) => record(segment, batchResults[index]));
		} catch (error) {
			if (shouldStop()) return;
			// 鉴权或参数错误对后续批次同样有效，终止任务而非继续浪费请求。
			if (error.retryable === false) throw error;
			if (retryBudget > 0 && error.retryable !== false) {
				// 大批次失败后缩小范围，重试仅发生在失败内容上。
				const middle = Math.ceil(batch.length / 2);
				await runBatch(batch.slice(0, middle), retryBudget - 1, batchIndex);
				if (middle < batch.length) await runBatch(batch.slice(middle), retryBudget - 1, batchIndex);
				return;
			}
			batch.forEach(segment => record(segment, { fragments: [], error: error.message || '该段落检查失败，请重试' }));
		}
	}
	async function worker() {
		while (!shouldStop() && nextBatch < plan.batches.length) {
			const index = nextBatch++;
			await runBatch(plan.batches[index], options.retries ?? 1, index + 1);
		}
	}
	onProgress({ analyzed: 0, failed: 0, total: paragraphs.length });
	await Promise.all(Array.from({ length: Math.min(options.concurrency || 2, plan.batches.length) }, worker));
	const paragraphResults = results.filter(Boolean);
	const corrections = paragraphResults.filter(item => item.has_issue && !item.error);
	const errors = paragraphResults.filter(item => item.error).map(item => ({
		paragraph_index: item.paragraph_index,
		paragraph_id: item.paragraph_id,
		paragraph_hash: item.paragraph_hash,
		message: item.error,
	}));
	return {
		summary: {
			paragraph_count: paragraphs.length,
			batch_count: plan.batches.length,
			model_request_count: requestCount,
			corrected_paragraph_count: corrections.length,
			issue_count: corrections.reduce((count, item) => count + item.fragments.length, 0),
			error_count: errors.length,
		},
		paragraph_results: paragraphResults,
		corrections,
		errors,
	};
}

module.exports = { buildCorrectionPlan, mergeParagraphSegments, runCorrectionPlan };
