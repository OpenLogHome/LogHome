import axios from 'axios';

function readStoredToken() {
	let value = null;
	try {
		value = uni.getStorageSync('token');
		if (!value && typeof window !== 'undefined') value = window.localStorage.getItem('token');
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

function shouldRetryRedstoneRequest(error) {
	if (!error || !error.response) return true;
	const status = Number(error.response.status || 0);
	return status === 408 || status === 429 || status >= 500;
}

async function requestRedstoneWithRetry(request) {
	let lastError;
	for (let attempt = 0; attempt < 2; attempt += 1) {
		try {
			return await request();
		} catch (error) {
			lastError = error;
			if (!shouldRetryRedstoneRequest(error) || attempt === 1) throw error;
			await new Promise((resolve) => setTimeout(resolve, 220));
		}
	}
	throw lastError;
}

export function createRedstoneRequestId() {
	return `redstone-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getRedstoneErrorMessage(error, fallback = '红石服务暂时不可用') {
	return error && error.response && error.response.data && (error.response.data.message || error.response.data.msg)
		? error.response.data.message || error.response.data.msg
		: error && error.message ? error.message : fallback;
}

export async function getRedstoneAccount(baseUrl) {
	const response = await requestRedstoneWithRetry(() => axios.get(`${baseUrl}/redstone/account`, { headers: authHeaders() }));
	return response.data.data;
}

export async function getRedstoneTransactions(baseUrl, page = 1, pageSize = 10) {
	const response = await requestRedstoneWithRetry(() => axios.get(
		`${baseUrl}/redstone/transactions?page=${page}&pageSize=${pageSize}`,
		{ headers: authHeaders() },
	));
	return response.data.data;
}

export async function exchangeRedstone(baseUrl, redstoneAmount, clientRequestId) {
	const response = await axios.post(
		`${baseUrl}/redstone/exchange`,
		{ redstone_amount: redstoneAmount, client_request_id: clientRequestId },
		{ headers: authHeaders() },
	);
	return response.data.data;
}
