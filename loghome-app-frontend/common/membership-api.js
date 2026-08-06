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

export function createMembershipRequestId(prefix = 'membership') {
	const random = Math.random().toString(36).slice(2, 12);
	return `${prefix}-${Date.now()}-${random}`;
}

export function getMembershipErrorMessage(error, fallback = '会员服务暂时不可用') {
	return error && error.response && error.response.data && (error.response.data.message || error.response.data.msg)
		? error.response.data.message || error.response.data.msg
		: error && error.message
			? error.message
			: fallback;
}

export async function getMembershipPlans(baseUrl) {
	const response = await axios.get(`${baseUrl}/membership/plans`);
	return response.data.data;
}

export async function getMembershipStatus(baseUrl) {
	const response = await axios.get(`${baseUrl}/membership/subscription`, { headers: authHeaders() });
	return response.data.data;
}

export async function subscribeMembership(baseUrl, payload) {
	const response = await axios.post(`${baseUrl}/membership/subscribe`, payload, { headers: authHeaders() });
	return response.data.data;
}

export async function giftMembership(baseUrl, payload) {
	const response = await axios.post(`${baseUrl}/membership/gift`, payload, { headers: authHeaders() });
	return response.data.data;
}

export async function getMembershipGiftFriends(baseUrl) {
	const response = await axios.get(`${baseUrl}/membership/gift-friends`, { headers: authHeaders() });
	return response.data.data.list;
}

export async function redeemMembership(baseUrl, code) {
	const response = await axios.post(
		`${baseUrl}/membership/redeem`,
		{ code },
		{ headers: authHeaders() },
	);
	return response.data.data;
}

export async function getMembershipRedeemHistory(baseUrl, page = 1, pageSize = 20) {
	const response = await axios.get(
		`${baseUrl}/membership/redeem-history?page=${page}&pageSize=${pageSize}`,
		{ headers: authHeaders() },
	);
	return response.data.data;
}

export async function updateMembershipAutoRenew(baseUrl, enabled) {
	const response = await axios.patch(
		`${baseUrl}/membership/auto-renew`,
		{ enabled: Boolean(enabled) },
		{ headers: authHeaders() },
	);
	return response.data.data;
}
