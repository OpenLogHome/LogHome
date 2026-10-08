import axios from 'axios';

// 漫画作品与话数在数据模型上就是 novels / articles，评论直接复用社区的书评接口，
// 作品级评论 article_id 传 0、话评传对应的 article_id，paragraph_id 固定 -1（漫画没有划线段落）。
const ROOT_COMMENT = { article_id: 0, paragraph_id: -1 };

// 评论配图沿用书评的图片容器与服务密钥
const IMAGE_UPLOAD_URL = 'https://storage.codesocean.top/api/resource/upload?container=172018735018984';
const IMAGE_RESOURCE_URL = 'https://storage.codesocean.top/api/resource/get/';
const IMAGE_SERVICE_KEY = 'a24785bedb466b9733dd317771d4b69c08da07fd';

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

function optionalAuthHeaders() {
	const token = readStoredSession().tk;
	if (!token) return null;
	return { Authorization: `Bearer ${token}` };
}

export function currentCommentUserId() {
	return readStoredSession().id;
}

export function canModerateComment(comment) {
	const userId = currentCommentUserId();
	if (!userId) return false;
	return String(comment.userId) === String(userId) || String(comment.workAuthorId) === String(userId);
}

export function getMangaCommentErrorMessage(error, fallback = '评论暂时不可用') {
	const data = error && error.response && error.response.data;
	if (data && (data.message || data.msg)) return data.message || data.msg;
	return error && error.message ? error.message : fallback;
}

function parseMediaUrls(value) {
	if (Array.isArray(value)) return value;
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
}

function formatCommentTime(value) {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	// 后端以 UTC 序列化，展示时换算为东八区墙上时间，与书评保持一致
	const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
	const pad = (input) => String(input).padStart(2, '0');
	return `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}`;
}

function toReplyViewModel(reply, namesByCommentId, workAuthorId) {
	return {
		commentId: reply.essay_comment_id,
		userId: reply.user_id,
		userName: reply.name,
		targetUserName: namesByCommentId[reply.reply_to_id] || '',
		content: reply.content,
		images: parseMediaUrls(reply.media_urls),
		time: formatCommentTime(reply.comment_time),
		canModerate: canModerateComment({ userId: reply.user_id, workAuthorId }),
	};
}

function toCommentViewModel(item, praiseTypeMap) {
	const replies = Array.isArray(item.replies) ? item.replies : [];
	const namesByCommentId = { [item.essay_comment_id]: item.name };
	for (const reply of replies) namesByCommentId[reply.essay_comment_id] = reply.name;
	const praiseType = Object.prototype.hasOwnProperty.call(praiseTypeMap, item.essay_comment_id)
		? Number(praiseTypeMap[item.essay_comment_id])
		: 3;
	return {
		commentId: item.essay_comment_id,
		userId: item.user_id,
		novelId: item.novel_id,
		userName: item.name,
		avatarUrl: item.avatar_url,
		avatarFrame: item.avatar_frame || null,
		workAuthorId: item.author_id,
		content: item.content,
		images: parseMediaUrls(item.media_urls),
		time: formatCommentTime(item.comment_time),
		likeNum: Math.max(Number(item.likeNum) || 0, praiseType === 0 ? 1 : 0),
		praiseType,
		articleId: Number(item.article_id) || 0,
		articleTitle: item.article_title || '',
		excerpt: item.cento && item.cento.paragraph ? item.cento.paragraph : '',
		replies: replies.map((reply) => toReplyViewModel(reply, namesByCommentId, item.author_id)),
		canModerate: canModerateComment({
			userId: item.user_id,
			workAuthorId: item.author_id,
		}),
	};
}

async function fetchPraiseTypeMap(baseUrl, commentIds) {
	if (!commentIds.length) return {};
	const headers = optionalAuthHeaders();
	if (!headers) return {};
	try {
		const response = await axios.get(`${baseUrl}/community/get_comment_praise_statuses`, {
			params: { comment_ids: commentIds.join(',') },
			headers,
		});
		const praiseTypeMap = {};
		for (const item of response.data || []) praiseTypeMap[item.novel_comment_id] = item.type;
		return praiseTypeMap;
	} catch (error) {
		return {};
	}
}

export async function fetchMangaComments(baseUrl, options) {
	const { novelId, articleId, page = 1, pageSize = 10 } = options;
	const params = { id: novelId, page, pageSize };
	if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
	const response = await axios.get(`${baseUrl}/community/novel_commonts_all_fast`, { params });
	const rows = Array.isArray(response.data) ? response.data : [];
	const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, rows.map((item) => item.essay_comment_id));
	return rows.map((item) => toCommentViewModel(item, praiseTypeMap));
}

// 通知消息里带的是根评论 id，分页列表可能不含它，按 id 单独取回后再插入列表
export async function fetchMangaCommentById(baseUrl, commentId) {
	const response = await axios.get(`${baseUrl}/community/novel_comment_from_comment_id`, {
		params: { comment_id: commentId },
	});
	const item = (response.data || [])[0];
	if (!item) return null;
	const replies = await axios
		.get(`${baseUrl}/community/novel_commonts_reply_to`, { params: { id: commentId } })
		.then((replyResponse) => (Array.isArray(replyResponse.data) ? replyResponse.data : []))
		.catch(() => []);
	item.replies = replies;
	const praiseTypeMap = await fetchPraiseTypeMap(baseUrl, [item.essay_comment_id]);
	return toCommentViewModel(item, praiseTypeMap);
}

export async function fetchMangaCommentAmount(baseUrl, novelId, articleId) {
	const params = { id: novelId };
	if (articleId !== undefined && articleId !== null && articleId !== 0) params.articleId = articleId;
	const response = await axios.get(`${baseUrl}/community/novel_commonts_amount`, { params });
	const row = (response.data || [])[0] || {};
	return Number(row['COUNT(*)']) || 0;
}

// 目录角标用：一次取回各话评论数，返回 { [article_id]: amount }
export async function fetchMangaArticleCommentAmounts(baseUrl, novelId) {
	const response = await axios.get(`${baseUrl}/community/novel_articles_comment_amounts`, {
		params: { id: novelId },
	});
	const amounts = {};
	for (const row of response.data || []) amounts[row.article_id] = Number(row.amount) || 0;
	return amounts;
}

export async function publishMangaComment(baseUrl, options) {
	const { novelId, articleId, content, images = [] } = options;
	const response = await axios.post(
		`${baseUrl}/community/comment_on_novel`,
		{
			novel_id: novelId,
			content,
			media_urls: images,
			...(articleId ? { article_id: articleId } : ROOT_COMMENT),
		},
		{ headers: authHeaders() },
	);
	return toCommentViewModel({ ...response.data, replies: [], likeNum: 0 }, {});
}

export async function replyMangaComment(baseUrl, options) {
	const { novelId, articleId, rootCommentId, replyToCommentId, content, images = [] } = options;
	const response = await axios.post(
		`${baseUrl}/community/reply_to_novel_comment`,
		{
			novel_id: novelId,
			// essay_comment_id 是被回复的那一条，fatherId 是所属的根评论
			essay_comment_id: replyToCommentId,
			fatherId: rootCommentId,
			article_id: articleId || 0,
			content,
			media_urls: images,
		},
		{ headers: authHeaders() },
	);
	return response.data;
}

export async function praiseMangaComment(baseUrl, commentId, type) {
	const response = await axios.post(
		`${baseUrl}/community/praise_on_comment`,
		{ essay_comment_id: commentId, type },
		{ headers: authHeaders() },
	);
	return response.data;
}

export async function deleteMangaComment(baseUrl, commentId) {
	const response = await axios.get(`${baseUrl}/community/delete_comment`, {
		params: { id: commentId },
		headers: authHeaders(),
	});
	return response.data;
}

// 浏览器端配图上传：接收 File/Blob，走 FormData，返回可访问的资源 URL
export async function uploadMangaCommentImage(file) {
	const form = new FormData();
	form.append('file', file);
	const response = await fetch(IMAGE_UPLOAD_URL, {
		method: 'POST',
		headers: { ServiceKey: IMAGE_SERVICE_KEY },
		body: form,
	});
	const data = await response.json();
	return IMAGE_RESOURCE_URL + data.data.resource_id;
}
