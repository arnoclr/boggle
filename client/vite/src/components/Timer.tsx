export interface TimerProps {
  remainingSeconds: number;
}

export default function Timer({ remainingSeconds }: TimerProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  function withLeadingsZeroes(value: number): string {
    return value.toString().padStart(2, "0");
  }

  return remainingSeconds > 0 ? (
    <div className="timer padding-left">
      <span className="minutes">{withLeadingsZeroes(minutes)}</span>
      <span className="separator blinking">:</span>
      <span className="seconds">{withLeadingsZeroes(seconds)}</span>
    </div>
  ) : (
    <>
      <p className="padding-left">Partie terminée</p>
    </>
  );
}
