// Writing APIs must propagate failures: an empty success response would risk data loss.
export function writerIdentity(storage = window.localStorage) {
  try {
    const token = JSON.parse(storage.getItem("token") || "null");
    return {
      token: (token && token.tk) || "",
      id: Number((token && token.id) || 0),
    };
  } catch (_) {
    return { token: "", id: 0 };
  }
}
export function writerEndpoints(storage = window.localStorage) {
  return {
    api: process.env.baseUrl,
    ai:
      storage.getItem("loghomeCollaborationHttpUrl") || process.env.writerAiUrl,
    ws: storage.getItem("loghomeCollaborationWsUrl") || process.env.writerWsUrl,
  };
}
export async function writerRequest(
  path,
  { method = "GET", body, signal, base, raw = false, keepalive = false } = {}
) {
  const identity = writerIdentity();
  if (!identity.token) throw new Error("请先登录");
  const headers = { Authorization: `Bearer ${identity.token}` };
  if (body !== undefined && !(body instanceof Blob))
    headers["Content-Type"] = "application/json";
  const response = await fetch(`${base || writerEndpoints().api}${path}`, {
    method,
    headers,
    signal,
    keepalive,
    body:
      body === undefined
        ? undefined
        : body instanceof Blob
        ? body
        : JSON.stringify(body),
  });
  if (raw && response.ok) return response;
  const source = await response.text();
  let data;
  try {
    data = JSON.parse(source);
  } catch (_) {
    if (response.ok && source.trim() === "no data") return null;
    throw new Error("服务返回了无效数据，请重试");
  }
  if (!response.ok) {
    const error = new Error(
      data.msg || data.message || `请求失败 (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}
export const writerGet = async (name, params = {}) => {
  const result = await writerRequest(
    `/essays/${name}?${new URLSearchParams(params)}`
  );
  return name === "get_article" && Array.isArray(result)
    ? result[0] || null
    : result;
};
export const writerPost = (name, body) =>
  writerRequest(`/essays/${name}`, { method: "POST", body });
export async function collaborationRequest(articleId, action, body) {
  const result = await writerRequest(
    `/collaboration/articles/${articleId}/${action}`,
    {
      base: writerEndpoints().ai,
      method: body === undefined ? "GET" : "POST",
      body,
    }
  );
  return result && result.data;
}
export function downloadWriterFile(name, content, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type })),
    anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
