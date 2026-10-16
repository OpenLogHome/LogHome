const embedded = window.parent !== window;
const allowed = new Set(window.__LOGHOME_COVER_CONFIG__?.parentOrigins || []);
let parentOrigin, mounted = false, initialized = false;
function send(type, extra = {}) {
  if (embedded) window.parent.postMessage({namespace:'loghome-miniapp', version:1, type, ...extra}, parentOrigin && parentOrigin !== 'null' ? parentOrigin : '*');
}
function environment(message) {
  const top = Number(message.safeArea?.top), bottom = Number(message.safeArea?.bottom);
  if (Number.isFinite(top) && top >= 0 && top <= 200) document.documentElement.style.setProperty('--safe-top', top + 'px');
  if (Number.isFinite(bottom) && bottom >= 0 && bottom <= 200) document.documentElement.style.setProperty('--safe-bottom', bottom + 'px');
}
async function save() {
  document.activeElement?.blur();
  await Promise.resolve();
  await window.__loghomeCover?.save();
}
let pending = Promise.resolve();
window.addEventListener('message', event => {
  const message = event.data;
  if (!embedded || event.source !== window.parent || !allowed.has(event.origin) ||
    (parentOrigin !== undefined && parentOrigin !== event.origin) ||
    message?.namespace !== 'loghome-miniapp' || message.version !== 1) return;
  if (message.type === 'init') {
    parentOrigin = event.origin;
    initialized = true;
    environment(message);
    if (mounted) send('loaded');
    return;
  }
  if (!initialized) return;
  if (message.type === 'environment') environment(message);
  if (['close', 'back', 'pause'].includes(message.type)) {
    pending = pending.catch(() => {}).then(async () => {
      try {
        await save();
        if (message.type === 'back' && window.__loghomeCover) {
          await window.__loghomeCover.back();
          send('back-result', {requestId:message.requestId, handled:true});
        } else if (message.type !== 'pause') send('close-ready', {requestId:message.requestId});
      } catch { send('close-failed', {requestId:message.requestId, message:'封面保存失败，请留在编辑器重试。'}); }
    });
  }
});
// The container's browser link uses a ticket fragment. This local-only tool has no
// account API; discard the ticket before Vue's hash router interprets it as a route.
if (location.hash.startsWith('#ticket=')) history.replaceState(null, '', location.pathname + location.search + '#/');
document.documentElement.classList.toggle('loghome-embedded', embedded);
try {
  await import('./assets/index-DJH4ljDL.js');
  mounted = true;
  send('ready');
  if (initialized) send('loaded');
} catch {
  document.querySelector('#app').textContent = '封面编辑器加载失败，请重新加载。';
  send('error', {message:'封面编辑器加载失败，请重新加载。'});
}
