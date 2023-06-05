import { PlayerScore } from "./WithRealtime";
import "./GameResults.css";

export interface GameResultsProps {
  scores: PlayerScore[];
}

export default function GameResults({ scores }: GameResultsProps) {
  const bestScore = scores.reduce(
    (acc, score) => Math.max(acc, score.score),
    0
  );

  function toPercentage(score: number): string {
    return Math.round((score / bestScore) * 100) + "%";
  }

  return (
    <div className="GameResults">
      <p>Résultats</p>
      <div className="graph">
        {scores.map((score) => (
          <div className="point" key={score.name}>
            <div
              className="bar"
              style={{
                height: toPercentage(score.score),
                opacity: bestScore == score.score ? 1 : 0.7,
              }}
            >
              <span className="score">{score.score}</span>
            </div>
            <span className="name">{score.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
