import { useParams } from "react-router-dom";
import WithRealtime from "../components/WithRealtime";
import "./Game.css";

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="Game">
      {gameId ? (
        <WithRealtime gameId={gameId}></WithRealtime>
      ) : (
        <p>Chargement ...</p>
      )}
    </div>
  );
}
