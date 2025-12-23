export function useFlyToCart() {
  const fly = (startEl: HTMLElement, endEl: HTMLElement) => {
    if (!import.meta.client) return;

    const start = startEl.getBoundingClientRect();
    const end = endEl.getBoundingClientRect();

    const clone = startEl.cloneNode(true) as HTMLElement;

    clone.style.cssText = `
      position: fixed;
      left: ${start.left}px;
      top: ${start.top}px;
      width: ${start.width}px;
      height: ${start.height}px;
      z-index: 9999;
      pointer-events: none;
      transition: transform .7s cubic-bezier(.55,0,.1,1), opacity .7s;
    `;

    document.body.appendChild(clone);

    clone.getBoundingClientRect(); // 强制回流

    const x = end.left + end.width / 2 - (start.left + start.width / 2);
    const y = end.top + end.height / 2 - (start.top + start.height / 2);

    clone.style.transform = `translate(${x}px, ${y}px) scale(.1)`;
    clone.style.opacity = "0.2";

    clone.addEventListener("transitionend", () => clone.remove(), {
      once: true,
    });
  };

  return { fly };
}
