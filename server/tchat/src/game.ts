import { connection } from "./sql";

export function getAllTokensOfAPartyFromUserToken(userToken: string): string[] {
  // TODO: retourner tous les tokens des joueurs connectés à la partie. Pour cela, on connait un des token des joueurs de la partie et on renvoie tous les autres dont le token fourni.
  return [userToken];
}

export async function thisUserExists(token: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM players WHERE websocketToken = ?",
      [token],
      (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0);
      }
    );
  });
}

export async function getUserName(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM players WHERE websocketToken = ?",
      [token],
      (error, results) => {
        if (error) reject(error);
        resolve(results[0].name);
      }
    );
  });
}

const getUserId = (token: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM players WHERE websocketToken = ?",
      [token],
      (error, results) => {
        if (error) reject(error);
        resolve(results[0].idPlayer);
      }
    );
  });
};

const getInternalGameId = (gameId: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM games WHERE publicId = ? ORDER BY idGame DESC LIMIT 1",
      [gameId],
      (error, results) => {
        console.log(results);
        if (error) reject(error);
        if (results === undefined || results.length === 0) {
          reject("Game not found");
          return;
        }
        resolve(results[0].idGame);
      }
    );
  });
};

export const joinGame = async (
  token: string,
  publicGameId: string
): Promise<boolean> => {
  try {
    const userId = await getUserId(token);
    const gameId = await getInternalGameId(publicGameId);

    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO gamesplayers (idPlayer, idGame) VALUES (?, ?)",
        [userId, gameId],
        (error, results) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  } catch (e) {
    return false;
  }
};
