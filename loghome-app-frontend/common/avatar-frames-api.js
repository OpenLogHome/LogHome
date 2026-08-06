import axios from 'axios';

function readStoredToken() {
	let value = null;
	try {
		// 现有登录流程使用 localStorage 写入 token。优先读取同一来源，
		// 避免 uni storage 中的历史值覆盖当前登录态。
		if (typeof window !== 'undefined') value = window.localStorage.getItem('token');
		if (!value && typeof uni !== 'undefined') value = uni.getStorageSync('token');
		if (typeof value === 'string') {
			try {
				value = JSON.parse(value);
			} catch (error) {
				return value;
			}
		}
	} catch (error) {
		return '';
	}
	return value && typeof value === 'object' ? value.tk || '' : value || '';
}

function authHeaders() {
	const token = readStoredToken();
	if (!token) throw new Error('请先登录后再操作');
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
}

export function getAvatarFrameAuthHeaders() {
	return authHeaders();
}

export function getAvatarFrameErrorMessage(error, fallback = '头像挂件服务暂时不可用') {
	return error && error.response && error.response.data && (error.response.data.message || error.response.data.msg)
		? error.response.data.message || error.response.data.msg
		: error && error.message ? error.message : fallback;
}

export async function getAvatarFrames(baseUrl) {
	const response = await axios.get(`${baseUrl}/avatar-frames`, { headers: authHeaders() });
	return response.data.data;
}

export async function selectAvatarFrame(baseUrl, frameId) {
	const response = await axios.put(
		`${baseUrl}/avatar-frames/selection`,
		{ frame_id: frameId == null ? null : Number(frameId) },
		{ headers: authHeaders() },
	);
	return response.data.data;
}
