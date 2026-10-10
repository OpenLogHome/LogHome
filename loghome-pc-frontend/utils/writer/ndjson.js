export async function consumeWriterStream(
  response,
  onEvent,
  { signal, idleTimeoutMs = 60000 } = {}
) {
  const decoder = new TextDecoder(),
    reader = response.body && response.body.getReader();
  const consume = (text) => {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let event;
      try {
        event = JSON.parse(line.replace(/^data:\s*/, ""));
      } catch (_) {
        continue;
      }
      onEvent(event);
    }
  };
  if (!reader) {
    consume(await response.text());
    return;
  }
  let buffer = "",
    timer,
    expired = false;
  const arm = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      expired = true;
      reader.cancel().catch(() => {});
    }, idleTimeoutMs);
  };
  const abort = () => reader.cancel().catch(() => {});
  if (signal) signal.addEventListener("abort", abort);
  try {
    arm();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      arm();
      buffer += decoder.decode(value, { stream: true });
      const last = buffer.lastIndexOf("\n");
      if (last >= 0) {
        consume(buffer.slice(0, last));
        buffer = buffer.slice(last + 1);
      }
    }
    buffer += decoder.decode();
    consume(buffer);
    if (expired) throw new Error("连接长时间没有响应，请重试");
    if (signal && signal.aborted)
      throw new DOMException("已停止", "AbortError");
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", abort);
    await reader.cancel().catch(() => {});
  }
}
