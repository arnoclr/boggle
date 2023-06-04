import { useParams } from "react-router-dom";
import { createRef, useState, useEffect } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";
import "./Profile.css";
import { ago } from "../utils/time";

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [profileData, setProfileData] = useState<{
    isPublicAccount: boolean,
    totalGames: number,
    totalScore: number,
    totalWordsFound: number,
    games: Array<{
      publicId: string,
      startedAt: string,
      totalWordsFound: string,
      totalScore: number,
      bestWord: string | null,
      bestWordScore: number
    }>
  } | null>(null);
  
  async function fetchProfileData(userName: string): Promise<void> {
    setIsLoading(true);
    try {
      const userStorage = localStorage.getItem("previousAccounts");
      const previousAccounts = userStorage ? JSON.parse(userStorage) : [];
      let userEmail = "";

      if (previousAccounts.length > 0) {
        userEmail = previousAccounts[0].email;
      }
      const connectedUserResponse = await callAction(
        "auth.getConnectedUser",
        toMap({ userEmail })
      );

      const connectedUser = connectedUserResponse.data;
      setIsOwner(connectedUser === userName);

      const response = await callAction(
        "profil.getUserStats",
        toMap({ userName })
      );

      const isPublicAccount = response.data.isPublic;
      const totalGames = response.data.totalGames;
      const totalScore = response.data.totalScore;
      const totalWordsFound = response.data.totalWordsFound;
      const games = response.data.games;

      setProfileData({ isPublicAccount: isPublicAccount, totalGames: totalGames, totalScore: totalScore, totalWordsFound: totalWordsFound, games: games });
    } catch (e) {
      const { message, status } = e as ErrorWithStatus;
      if (status === "user_not_found") {
        console.log("user not found");
      }

      if (status === "user_email_not_found") {
        console.log("user email not found");
      }

      console.log("error", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileData(username);
  }, [username]);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>@{username}</p>
      {isLoading && <p>Loading...</p>}
      {profileData && (
        <>
          {profileData.isPublicAccount || isOwner ? (
            <div>
              <p className="total-games">Nombre de parties jouées: {profileData.totalGames}</p>
              <p className="total-score">Nombre de points: {profileData.totalScore}</p>
              <p className="total-words">Nombre de mots trouvés: {profileData.totalWordsFound}</p>
              <h2>Liste des parties jouées :</h2>
              <ul>
                {profileData.games.map((game) => (
                  <li key={game.publicId}>
                    <p>Partie commencée {ago(new Date(game.startedAt))}</p>
                    <p>Nombre de mots trouvés: {game.totalWordsFound}</p>
                    <p>Score total: {game.totalScore}</p>
                    <p>
                      Meilleur mot trouvé:{" "}
                      {game.bestWord ? (
                        game.bestWord
                      ) : (
                        <span className="no-best-word">Aucun</span>
                      )}
                    </p>
                    <a href={`/g/${game.publicId}`}>Voir la partie</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Ce compte est privé.</p>
          )}
        </>
      )}
    </div>
  );  
}
