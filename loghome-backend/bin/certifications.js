// 运营配置的原木社区认证标识：userId -> [{ variant, title }]
// 档位示例：gold 冠军 / silver 亚军 / bronze 季军 / green 未入围参赛
const certifications = {
  12: [],
  22: [{ variant: 'gold', title: '2025干草块杯冠军选手' }],
  34: [{ variant: 'bronze', title: '2025干草块杯季军选手' }],
  37: [{ variant: 'green', title: '2025干草块杯参赛选手' }],
  49: [{ variant: 'silver', title: '2025干草块杯亚军选手' }],
  71: [{ variant: 'green', title: '2025干草块杯参赛选手' }],
  76: [{ variant: 'green', title: '2025干草块杯参赛选手' }]
};

function getCertifications(userId) {
  return certifications[Number(userId)] || [];
}

function getTopVariantMap() {
  const map = {};
  Object.keys(certifications).forEach(uid => {
    if (certifications[uid].length) map[uid] = certifications[uid][0].variant;
  });
  return map;
}

module.exports = { getCertifications, getTopVariantMap };