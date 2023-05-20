import { useEffect, useState } from "react";
import { PlayerColors, PlayerName, PlayerScore } from "./WithRealtime";

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
      transition: "grid-template-columns 0.3s ease-in-out",
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
      }
    });
  }, [ws]);

  return (
    <ul style={scoresCSS()}>
      {scoreList().map(({ name, score, isConnected }) => (
        <li key={name} style={scoreCSS(name)}>
          <span>{name}</span>
          <span>{score}</span>
        </li>
      ))}
    </ul>
  );
}
