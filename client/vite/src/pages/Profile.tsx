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
        toMap({ userName: userName })
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

  const handlePrivacyToggle = async () => {
    const newPrivacyStatus = !profileData?.isPublicAccount ? 0 : 1;
    try {
      await callAction(
        "users.updateInformations",
        toMap({ name: username, isPrivateAccount: newPrivacyStatus })
      );
      setProfileData({ ...profileData, isPublicAccount: !profileData?.isPublicAccount });
    }
    catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    fetchProfileData(username);
  }, [username]);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-section">
        <p className="profile-username">@{username}</p>
        {isLoading && <p>Loading...</p>}
        {profileData && (
          <>
            {isOwner && (
              <div className="privacy-section">
                <div className="privacy-toggle">
                  <input
                    type="checkbox"
                    id="privacy-toggle"
                    checked={!profileData?.isPublicAccount}
                    onChange={handlePrivacyToggle}
                  />
                </div>
                <label htmlFor="privacy-toggle" className="privacy-toggle-label">
                  <span className="privacy-toggle-text">{profileData?.isPublicAccount ? 'Public' : 'Privé'}</span>
                  <span className="privacy-toggle-slider"></span>
                </label>
              </div>
            )}
            {isOwner && !profileData.isPublicAccount && (
                <p className="profile-warning">Votre profil est privé, seuls vous et les administrateurs pouvez le voir.</p>
            )}
            {profileData.isPublicAccount || isOwner ? (
              <div>
                <div className="profile-stats">
                  <p className="profile-stat">Nombre de parties jouées: {profileData.totalGames}</p>
                  <p className="profile-stat">Nombre de points: {profileData.totalScore}</p>
                  <p className="profile-stat">Nombre de mots trouvés: {profileData.totalWordsFound}</p>
                </div>
                <h2>Liste des parties jouées :</h2>
                <div className="profile-history">
                  {profileData.games.map((game) => (
                    <div className="profile-game-card" key={game.publicId}>
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
                      <a href={`/g/${game.publicId}/results`}>Voir la partie</a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="profile-warning">
                <svg
                  className="profile-warning-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.485 2 2 6.485 2 12c0 5.515 4.485 10 10 10s10-4.485 10-10c0-5.515-4.485-10-10-10zm1 15h-2v-2h2v2zm0-4h-2v-6h2v6z" />
                </svg>
                <p className="profile-warning-text">
                  Vous ne pouvez pas accéder aux statistiques de ce joueur car ce compte est privé.
                </p>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
