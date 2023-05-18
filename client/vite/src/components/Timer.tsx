export interface TimerProps {
  remainingSeconds: number;
}

export default function Timer({ remainingSeconds }: TimerProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  function withLeadingsZeroes(value: number): string {
    return value.toString().padStart(2, "0");
  }

  return (
    <div className="timer">
      <span className="minutes">{withLeadingsZeroes(minutes)}</span>
      <span className="separator">:</span>
      <span className="seconds">{withLeadingsZeroes(seconds)}</span>
    </div>
  );
}
