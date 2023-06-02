import { useEffect, useRef, useState } from "react";
import { PlayerColors, PlayerName, PlayerScore } from "./WithRealtime";
import { launchAnimation } from "../utils/animations";
import "./Score.css";

export interface ScoreProps {
  colors: PlayerColors;
  connectedUsers: PlayerName[];
  ws: WebSocket;
}

interface DisplayedScore {
  name: PlayerName;
  score: number;
  isConnected: boolean;
}

export default function Score({ ws, colors, connectedUsers }: ScoreProps) {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [bigScore, setBigScore] = useState<number>(0);
  const [bigScoreColor, setBigScoreColor] = useState<string>("");
  const bigScoreSpan = useRef<HTMLSpanElement>(null);

  function scoreList(): DisplayedScore[] {
    const allUsers = new Set(connectedUsers);
    scores.forEach(({ name }) => allUsers.add(name));

    return Array.from(allUsers).map((name) => {
      const score = scores.find((score) => score.name === name)?.score || 0;
      return {
        name,
        score,
        isConnected: connectedUsers.includes(name),
      };
    });
  }

  function scoresCSS() {
    // return display grid with fractionnal columns based on score of each player
    const gridTemplateColumns = scoreList().reduce(
      (acc, { name, score }) => `${acc} ${score + 1}fr`,
      ""
    );

    return {
      gridTemplateColumns,
      display: "grid",
      listStyle: "none",
      padding: 0,
      margin: 0,
      transition: "grid-template-columns 400ms ease-in-out 350ms",
    };
  }

  function scoreCSS(name: PlayerName) {
    return {
      backgroundColor: colors.get(name),
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.5rem",
      color: "white",
    };
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === "wordFound") {
        setScores(payload.scores);
        setBigScore(payload.wordScore);
        setBigScoreColor(colors.get(payload.displayName) || "transparent");
        launchAnimation(bigScoreSpan.current, "drop", 1500);
      }
    });
  }, [ws]);

  return (
    <>
      <span
        ref={bigScoreSpan}
        className="bigScore"
        style={{ color: bigScoreColor }}
      >
        +{bigScore}
      </span>
      <ul style={scoresCSS()}>
        {scoreList().map(({ name, score, isConnected }) => (
          <li key={name} style={scoreCSS(name)}>
            <span style={{ whiteSpace: "nowrap" }}>{name}</span>
            <span>{score}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
