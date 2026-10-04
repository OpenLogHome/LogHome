// 新协议逐段保存已完成结果；断流时只将未完成的段落标为失败。
export async function readWriterCorrectionStream(response, {
  paragraphs,
  onEvent,
  buildFallbackResult,
  idleTimeoutMs = 60000,
}) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  const partialResults = new Map();
  let buffer = "";
  let finalResult = null;
  let batched = false;
  let interrupted = null;
  let idleTimer;
  let idleExpired = false;
  const cancel = () => {
    try { Promise.resolve(reader.cancel()).catch(() => {}); } catch (error) {}
  };
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      idleExpired = true;
      cancel();
    }, idleTimeoutMs);
  };
  const consume = line => {
    let event;
    try { event = JSON.parse(line.trim().replace(/^data:\s*/i, "")); } catch (error) { return; }
    if (!event || typeof event !== "object") return;
    if (event.type === "meta" && event.batched) batched = true;
    if (event.type === "paragraph_result" && event.result) {
      const result = event.result;
      const paragraph = paragraphs.find(item => item.paragraph_index === result.paragraph_index);
      if (paragraph && paragraph.text === result.original_text && paragraph.paragraph_hash === result.paragraph_hash) {
        partialResults.set(result.paragraph_index, result);
      }
    }
    const result = onEvent(event);
    const terminal = !event.type || ["done", "complete", "completed", "result"].includes(event.type);
    if (terminal && result) finalResult = result;
    if (event.type === "error") throw new Error(event.message || "智能纠错请求失败");
  };

  resetIdleTimer();
  try {
    while (!finalResult) {
      const { done, value } = await reader.read();
      if (done) break;
      resetIdleTimer();
      buffer += decoder.decode(value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (line.trim()) consume(line);
        if (finalResult) break;
      }
    }
    if (!finalResult) {
      buffer += decoder.decode();
      if (buffer.trim()) consume(buffer);
      if (idleExpired) throw new Error("纠错连接长时间没有响应，请重试未完成的内容");
    }
  } catch (error) {
    interrupted = error;
  } finally {
    clearTimeout(idleTimer);
    cancel();
  }

  if (finalResult) return finalResult;
  // 老服务的单批协议仍可兼容；新服务的多批 JSON 不能拼接为一个结果。
  if (!interrupted && !batched && buildFallbackResult) {
    const fallback = buildFallbackResult();
    if (fallback) return fallback;
  }
  if (!partialResults.size) {
    throw interrupted || new Error("模型未返回完整纠错结果，请重试");
  }
  const message = interrupted?.message || "纠错连接中断，请重试未完成的内容";
  const paragraphResults = paragraphs.map(paragraph => partialResults.get(paragraph.paragraph_index) || {
    paragraph_index: paragraph.paragraph_index,
    paragraph_id: paragraph.paragraph_id,
    paragraph_hash: paragraph.paragraph_hash,
    original_text: paragraph.text,
    corrected_text: paragraph.text,
    has_issue: false,
    fragments: [],
    error: message,
  });
  const corrections = paragraphResults.filter(item => item.has_issue && !item.error);
  const errors = paragraphResults.filter(item => item.error).map(item => ({
    paragraph_index: item.paragraph_index,
    paragraph_id: item.paragraph_id,
    paragraph_hash: item.paragraph_hash,
    message: item.error,
  }));
  return {
    summary: {
      paragraph_count: paragraphs.length,
      batch_count: 0,
      corrected_paragraph_count: corrections.length,
      issue_count: corrections.reduce((total, item) => total + item.fragments.length, 0),
      error_count: errors.length,
    },
    paragraph_results: paragraphResults,
    corrections,
    errors,
  };
}
