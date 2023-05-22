export function launchAnimation(
  elem: HTMLElement | null,
  animationName: string,
  durationMs: number,
  delayMs: number = 0,
  repeat: number = 1
): void {
  if (!elem) return;
  elem.style.animationName = "none";
  elem.clientHeight; // force reflow
  elem.style.animationName = animationName;
  elem.style.animationDuration = `${durationMs}ms`;
  elem.style.animationDelay = `${delayMs}ms`;
  elem.style.animationFillMode = "both";
  elem.style.animationIterationCount = `${repeat}`;
  elem.style.animationPlayState = "running";
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function showElement(...elements: Array<HTMLElement | null>): void {
  return applyStyle("visibility", "visible", ...elements);
}

export function hideElement(...elements: Array<HTMLElement | null>): void {
  return applyStyle("visibility", "hidden", ...elements);
}

export function applyStyle(
  property: string,
  value: string,
  ...elements: Array<HTMLElement | null>
): void {
  elements.forEach((elem) => {
    if (!elem) return;
    // @ts-ignore
    elem.style[property] = value;
  });
}

export function clearStyles(...elements: Array<HTMLElement | null>): void {
  elements.forEach((elem) => {
    if (!elem) return;
    elem.removeAttribute("style");
  });
}

export type Position = { x: number; y: number };

export function getAbsoluteBoundsOf(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}
