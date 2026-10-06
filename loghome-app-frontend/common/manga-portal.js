// 滑动轨道的 transform 会成为 fixed 后代的包含块，遮罩会随页面一起滚走；
// 挂到 body 上才能让 fixed 重新以视口为基准。
export default {
  inserted(el) {
    if (el && el.parentNode !== document.body) document.body.appendChild(el);
  },
};
