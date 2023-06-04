import { useParams } from "react-router-dom";
import { createRef, useState, useEffect } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<{
    isPublicAccount: boolean,
    totalGames: number,
    totalScore: number,
    totalWordsFound: number
  } | null>(null);
  
  async function fetchProfileData(userName: string): Promise<void> {
    setIsLoading(true);
    try {
      const response = await callAction(
        "profil.getUserStats",
        toMap({ userName })
      );
      const isPublicAccout = response.data.isPublic;
      const totalGames = response.data.totalGames;
      const totalScore = response.data.totalScore;
      const totalWordsFound = response.data.totalWordsFound;

      setProfileData({ isPublicAccount: isPublicAccout, totalGames: totalGames, totalScore: totalScore, totalWordsFound: totalWordsFound });
    } catch (e) {
      const { message, status } = e as ErrorWithStatus;
      if (status === "user_not_found") {
        console.log("user not found");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileData(username);
  }, [username]);

  return (
    <div>
      <h1>Profile</h1>
      <p>@{username}</p>
      {isLoading && <p>Loading...</p>}
      {profileData.isPublicAccount ? (
        <div>
          <p>Nombre de parties joués: {profileData.totalGames}</p>
          <p>Nombre de points: {profileData.totalScore}</p>
          <p>Nombre de mots trouvés: {profileData.totalWordsFound}</p>
        </div>
      ) : (
        <p>Ce compte est privé.</p>
        )
      }
    </div>
  );
}
