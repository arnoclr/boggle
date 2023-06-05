import { useParams } from "react-router-dom";
import WithRealtime from "../components/WithRealtime";
import "./Game.css";

export interface GameProps {
  loggedIn: boolean;
}

export default function Game({ loggedIn }: GameProps) {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="Game">
      {gameId && loggedIn ? (
        <WithRealtime gameId={gameId}></WithRealtime>
      ) : (
        <p>Chargement ...</p>
      )}
    </div>
  );
}
