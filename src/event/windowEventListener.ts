export default function windowEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void {
  window.addEventListener(type, listener, options);
  return () => window.removeEventListener(type, listener);
}
