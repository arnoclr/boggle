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
