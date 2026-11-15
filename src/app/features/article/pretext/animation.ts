interface AnimationEnvironment {
  hidden(): boolean;
  request(callback: FrameRequestCallback): number;
  cancel(id: number): void;
  observe(element: Element, callback: (visible: boolean) => void): () => void;
  onVisibility(callback: () => void): () => void;
}

const browser: AnimationEnvironment = {
  hidden: () => document.hidden,
  request: callback => requestAnimationFrame(callback),
  cancel: id => cancelAnimationFrame(id),
  observe: (element, callback) => {
    const observer = new IntersectionObserver(([entry]) => callback(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  },
  onVisibility: callback => {
    document.addEventListener("visibilitychange", callback);
    return () => document.removeEventListener("visibilitychange", callback);
  },
};

/** Own exactly one frame loop, only while its element and document are visible. */
export function visibleAnimation(
  element: Element,
  frame: (dt: number, now: number) => void,
  fps = 24,
  environment: AnimationEnvironment = browser,
): () => void {
  let visible = false;
  let disposed = false;
  let raf = 0;
  let last: number | undefined;
  const interval = 1000 / fps;

  const tick = (now: number) => {
    raf = 0;
    if (disposed || !visible || environment.hidden()) return;
    if (last === undefined) last = now;
    const elapsed = now - last;
    if (elapsed + 0.1 >= interval) {
      last = now;
      frame(Math.min(elapsed / 1000, 0.05), now);
    }
    raf = environment.request(tick);
  };

  const reconcile = () => {
    if (disposed || !visible || environment.hidden()) {
      if (raf) environment.cancel(raf);
      raf = 0;
      last = undefined;
    } else if (!raf) {
      last = undefined;
      raf = environment.request(tick);
    }
  };

  const unobserve = environment.observe(element, value => { visible = value; reconcile(); });
  const unlisten = environment.onVisibility(reconcile);
  return () => {
    disposed = true;
    reconcile();
    unobserve();
    unlisten();
  };
}

/** Bound both physics coordinates and bitmap pixels independently of screen size. */
export function coverSize(width: number, height: number, deviceScale: number) {
  const scale = Math.min(1, 640 / width, 360 / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const dpr = Math.min(1.5, Math.max(1, deviceScale));
  return { width: w, height: h, dpr, pixelWidth: Math.round(w * dpr), pixelHeight: Math.round(h * dpr) };
}
