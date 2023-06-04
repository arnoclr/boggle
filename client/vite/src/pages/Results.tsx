import { useEffect, useState } from "react";
import GameResults from "../components/GameResults";
import { useParams } from "react-router-dom";
import { callAction, toMap } from "../utils/req";
import Navbar from "../components/Navbar";
import { PlayerScore } from "../components/WithRealtime";

export default function Results() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const { gameId } = useParams();

  async function fetchScores(): Promise<void> {
    const results = await callAction(
      "game.getResults",
      toMap({ publicGameId: gameId })
    );
    setScores(results.data);
  }

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <>
      <div className="container padding-top">
        <Navbar></Navbar>
        <GameResults scores={scores}></GameResults>
      </div>
    </>
  );
}
