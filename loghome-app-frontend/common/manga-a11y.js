// Uni-app renders <button> as <uni-button> on H5. Give it native-button
// keyboard behavior without changing its click handling on other platforms.
function syncButton(el, binding = {}) {
  if (!el || el.tagName === 'BUTTON') return;
  const disabled = binding.value === undefined ? el.hasAttribute('disabled') : Boolean(binding.value);
  if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
  el.setAttribute('tabindex', disabled ? '-1' : '0');
  el.setAttribute('aria-disabled', disabled ? 'true' : 'false');
}

export default {
  inserted(el, binding) {
    if (!el || el.tagName === 'BUTTON') return;
    syncButton(el, binding);
    const onKeyDown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (el.getAttribute('aria-disabled') === 'true') return;
      event.preventDefault();
      el.click();
    };
    el.__mangaKeyDown = onKeyDown;
    el.addEventListener('keydown', onKeyDown);
  },
  componentUpdated: syncButton,
  unbind(el) {
    if (el && el.__mangaKeyDown) el.removeEventListener('keydown', el.__mangaKeyDown);
  },
};
