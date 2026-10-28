// FlClash profile override: retain this script when refreshing the subscription.
const main = (config) => {
	const dns = config.dns || (config.dns = {});
	const names = ['sql.ricepastem.cafe', '+.sql.tencentcdb.com'];
	const directDns = ['https://223.5.5.5/dns-query#DIRECT', 'https://doh.pub/dns-query#DIRECT'];
	dns['nameserver-policy'] = { ...(dns['nameserver-policy'] || {}) };
	for (const name of names) dns['nameserver-policy'][name] = directDns;
	if (dns['fake-ip-filter-mode'] === 'rule') {
		dns['fake-ip-filter'] = [
			'DOMAIN,sql.ricepastem.cafe,real-ip',
			'DOMAIN-SUFFIX,sql.tencentcdb.com,real-ip',
			...(dns['fake-ip-filter'] || []),
		];
	} else if (dns['fake-ip-filter-mode'] !== 'whitelist') {
		dns['fake-ip-filter'] = [...new Set([...(dns['fake-ip-filter'] || []), ...names])];
	}
	const directRules = ['DOMAIN,sql.ricepastem.cafe,DIRECT', 'DOMAIN-SUFFIX,sql.tencentcdb.com,DIRECT'];
	config.rules = [...directRules, ...(config.rules || []).filter((rule) => !directRules.includes(rule))];
	return config;
};
