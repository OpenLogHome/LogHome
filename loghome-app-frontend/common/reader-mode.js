export const PAGE_READER_MODE = 'page';
export const TEXT_READER_MODE = 'text';
export const DEFAULT_READER_MODE = PAGE_READER_MODE;

export function getReaderMode() {
	const mode = window.localStorage.getItem('readerProps');
	if (mode === PAGE_READER_MODE || mode === TEXT_READER_MODE) return mode;
	window.localStorage.setItem('readerProps', DEFAULT_READER_MODE);
	return DEFAULT_READER_MODE;
}

export function setReaderMode(mode) {
	const normalizedMode = mode === TEXT_READER_MODE ? TEXT_READER_MODE : PAGE_READER_MODE;
	window.localStorage.setItem('readerProps', normalizedMode);
	return normalizedMode;
}

export function buildReaderUrl(mode, options = {}) {
	const articleId = Number(options.articleId || 0);
	const baseUrl = mode === TEXT_READER_MODE
		? '/pages/readers/article_rich'
		: '/pages/readers/newReader/article';
	const params = [`id=${encodeURIComponent(articleId)}`];
	if (Number(options.novelId) > 0) {
		params.push(`novelId=${encodeURIComponent(Number(options.novelId))}`);
	}
	if (Number(options.paragraphId) > 0) {
		params.push(`paragraphId=${encodeURIComponent(Number(options.paragraphId))}`);
	}
	if (options.previewKey) {
		params.push(`previewKey=${encodeURIComponent(String(options.previewKey))}`);
	}
	return `${baseUrl}?${params.join('&')}`;
}
