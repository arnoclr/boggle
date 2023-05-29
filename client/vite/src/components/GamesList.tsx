import { useState } from "react";
import { ago } from "../utils/time";
import { callAction } from "../utils/req";

interface Game {
  publicId: string;
  playersInRoom: number;
  createdAt: string;
}

export interface GamesListProps {
  whenCreated: (gameId: string) => void;
}

export default function GamesList({ whenCreated }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);

  async function fetchGames() {
    const res = await callAction("game.getPublicGames", new Map());
    setGames(res.data);
  }

  fetchGames();

  return (
    <ul>
      {games.map((game) => (
        <li>
          <span>{game.playersInRoom} joueur(s) connecté(s)</span>
          <br />
          <small>créée {ago(new Date(game.createdAt))}</small>
          <br />
          <button
            className="secondary"
            onClick={() => whenCreated(game.publicId)}
          >
            Rejoindre {game.publicId.toUpperCase()}
          </button>
        </li>
      ))}
    </ul>
  );
}
