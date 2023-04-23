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
        console.log(error, results);
        if (error) reject(error);
        resolve(results.length > 0);
      }
    );
  });
}
