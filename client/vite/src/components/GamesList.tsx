import { useEffect, useState } from "react";
import { ago } from "../utils/time";
import { callAction } from "../utils/req";
import "./GamesList.css";

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

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <ul className="GamesList">
      {games.map((game) => (
        <li>
          <button
            className="secondary"
            onClick={() => whenCreated(game.publicId)}
          >
            <span>{game.publicId.toUpperCase()}</span>
            <small>
              {ago(new Date(game.createdAt))} - {game.playersInRoom} joueur(s)
            </small>
          </button>
        </li>
      ))}
    </ul>
  );
}
