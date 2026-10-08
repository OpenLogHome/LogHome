import axios from 'axios';

// 漫画弹幕接口封装：弹幕绑定 novel_id + article_id + page_idx（0 基页码）
function readStoredSession() {
	let value = null;
	try {
		if (typeof window !== 'undefined') value = window.localStorage.getItem('token');
		if (typeof value === 'string') value = JSON.parse(value);
	} catch (error) {
		return {};
	}
	return value && typeof value === 'object' ? value : {};
}

function authHeaders() {
	const token = readStoredSession().tk;
	if (!token) throw new Error('请先登录后再操作');
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
}

export function currentDanmuUserId() {
	return readStoredSession().id;
}

export function getMangaDanmuErrorMessage(error, fallback = '弹幕发送失败，请稍后重试') {
	const data = error && error.response && error.response.data;
	if (data && (data.message || data.msg)) return data.message || data.msg;
	return error && error.message ? error.message : fallback;
}

function toDanmuViewModel(item) {
	return {
		danmuId: item.danmu_id,
		userId: item.user_id,
		pageIdx: Number(item.page_idx) || 0,
		content: item.content,
		time: item.danmu_time,
	};
}

// 拉取整话弹幕，前端按 pageIdx 分组，避免滚动时逐页请求
export async function fetchMangaDanmus(baseUrl, novelId, articleId) {
	const response = await axios.get(`${baseUrl}/community/manga_danmus`, {
		params: { id: novelId, articleId },
	});
	const rows = Array.isArray(response.data) ? response.data : [];
	return rows.map(toDanmuViewModel);
}

export async function sendMangaDanmu(baseUrl, { novelId, articleId, pageIdx, content }) {
	const response = await axios.post(
		`${baseUrl}/community/manga_danmu`,
		{
			novel_id: novelId,
			article_id: articleId,
			page_idx: pageIdx,
			content,
		},
		{ headers: authHeaders() },
	);
	return toDanmuViewModel(response.data);
}

export async function deleteMangaDanmu(baseUrl, danmuId) {
	const response = await axios.get(`${baseUrl}/community/delete_manga_danmu`, {
		params: { id: danmuId },
		headers: authHeaders(),
	});
	return response.data;
}
