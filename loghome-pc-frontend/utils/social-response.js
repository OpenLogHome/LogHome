export function responseList(value, label = "列表") {
  if (!Array.isArray(value)) throw new Error(`${label}数据异常，请刷新重试`);
  return value;
}
export function responsePage(value, label = "列表") {
  if (
    !value ||
    !Array.isArray(value.list) ||
    !Number.isFinite(Number(value.total)) ||
    Number(value.total) < 0
  )
    throw new Error(`${label}数据异常，请刷新重试`);
  return { ...value, total: Number(value.total) };
}
export function responseObject(value, label = "信息") {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label}数据异常，请刷新重试`);
  return value;
}
