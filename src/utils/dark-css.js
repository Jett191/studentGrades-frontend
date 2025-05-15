// 切换暗黑主题
export function toDark(dark) {
  if (dark) {
    if (document.getElementById("dark-style")) {
      return;
    }
    const style = `
      html {
        background-color: rgb(255, 255, 255) !important;
        filter: invert(1) contrast(0.95) !important;
      }
      iframe {
        background-color: rgb(255, 255, 255) !important;
        filter: invert(1) contrast(0.95) !important;
      }
      img {
        filter: invert(1) contrast(0.95) !important;
      }`;
    const styleEl = document.createElement('style');
    styleEl.id = "dark-style";
    styleEl.textContent = style;
    document.head.append(styleEl);
  }else {
    const styleEl = document.getElementById("dark-style");
    if (styleEl) {
      styleEl.remove();
    }
  }
}
