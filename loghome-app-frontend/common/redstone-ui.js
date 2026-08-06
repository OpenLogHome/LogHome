export function getRedstoneErrorCode(error) {
	return String(
		(error && error.code)
		|| (error && error.response && error.response.data && error.response.data.code)
		|| '',
	);
}

export function isInsufficientRedstoneError(error) {
	return getRedstoneErrorCode(error) === 'INSUFFICIENT_REDSTONE'
		|| /红石不足|红石余额不足/.test(String(error && error.message || ''));
}

export function navigateToRedstoneExchange() {
	uni.navigateTo({ url: '/pages/redstone/index' });
}

export function navigateToMembership() {
	uni.navigateTo({ url: '/pages/membership/index' });
}

export function showInsufficientRedstoneOptions(error) {
	if (!isInsufficientRedstoneError(error)) return false;
	uni.showModal({
		title: '红石不足',
		content: String(error && error.message || '当前红石余额不足，可以兑换红石或开通通行证获得更多红石。'),
		confirmText: '兑换红石',
		cancelText: '开通通行证',
		success(result) {
			if (result.confirm) navigateToRedstoneExchange();
			else if (result.cancel) navigateToMembership();
		},
	});
	return true;
}
