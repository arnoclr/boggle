import { Player, PlayerName, Score } from "./types";
import { connection, query } from "./sql";
import { wordScore } from "./words";

export const DEFAULT_GAME_DURATION = 90;
export const DEFAULT_TIMEOUT_SECONDS = 3;

export async function getAllUserOfAParty(userToken: string): Promise<Player[]> {
  return new Promise((resolve, reject) => {
    connection.query(
      "WITH mostRecentGame AS (SELECT * FROM gamesplayers NATURAL JOIN players WHERE websocketToken = ? ORDER BY idGame DESC LIMIT 1) SELECT DISTINCT * FROM gamesplayers NATURAL JOIN players WHERE idGame = (SELECT idGame FROM mostRecentGame)",
      [userToken],
      (error, results) => {
        if (error) reject(error);
        resolve(results);
      }
    );
  });
}

export async function getAllTokensOfAPartyFromUserToken(
  userToken: string
): Promise<string[]> {
  return await getAllUserOfAParty(userToken).then((results) =>
    results.map((result) => result.websocketToken)
  );
}

export async function thisUserExists(token: string): Promise<boolean> {
  try {
    const results = await query(
      "SELECT * FROM players WHERE websocketToken = ?",
      [token]
    );
    return results && results.length > 0;
  } catch (e) {
    return false;
  }
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
        "INSERT INTO gamesplayers (idPlayer, idGame, joinedAt) VALUES (?, ?, NOW())",
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

export const getGameIdFromToken = async (token: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM gamesplayers NATURAL JOIN players WHERE websocketToken = ? ORDER BY idGame DESC LIMIT 1",
      [token],
      (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0 && results[0].idGame);
      }
    );
  });
};

export const getGridString = async (token: string): Promise<string> => {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM games WHERE idGame = ?",
      [gameId],
      (error, results) => {
        if (error) reject(error);
        resolve(results[0].grid);
      }
    );
  });
};

export async function addWordToGame(
  token: string,
  word: string
): Promise<boolean> {
  const gameId = await getGameIdFromToken(token);
  const playerId = await getUserId(token);
  const score = await wordScore(word);
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO wordsfound (idGame, idPlayer, word, score, foundAt) VALUES (?, ?, ?, ?, NOW())",
      [gameId, playerId, word, score],
      (error, results) => {
        if (error) reject(error);
        resolve(true);
      }
    );
  });
}

export async function wordIsAlreadySubmitted(
  token: string,
  word: string
): Promise<boolean> {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM wordsfound WHERE idGame = ? AND word = ?",
      [gameId, word],
      (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0);
      }
    );
  });
}

export async function gameIsActive(token: string): Promise<boolean> {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM games WHERE idGame = ? AND startedAt IS NOT NULL AND endedAt > NOW()",
      [gameId],
      (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0);
      }
    );
  });
}

export async function startGame(
  token: string,
  durationSeconds: number
): Promise<void> {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE games SET startedAt = NOW(), endedAt = ? WHERE idGame = ?",
      [new Date(Date.now() + durationSeconds * 1000), gameId],
      (error, results) => {
        if (error) reject(error);
        resolve();
      }
    );
  });
}

export async function gameOwnerToken(token: string): Promise<string> {
  const gameId = await getGameIdFromToken(token);
  const playerId = await getUserId(token);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM gamesplayers gp 
      JOIN players p ON gp.idPlayer = p.idPlayer 
      WHERE idGame = ? 
      ORDER BY gp.joinedAt ASC 
      LIMIT 1`,
      [gameId, playerId],
      (error, results) => {
        if (error) reject(error);
        console.log(results);
        resolve(results.length > 0 && results[0].websocketToken);
      }
    );
  });
}

export async function isGameOwner(token: string): Promise<boolean> {
  return (await gameOwnerToken(token)) === token;
}

export async function gameEndAt(token: string): Promise<Date> {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM games WHERE idGame = ?",
      [gameId],
      (error, results) => {
        if (error) reject(error);
        resolve(new Date(results[0].endedAt));
      }
    );
  });
}

export async function previousWordSubmittedTooRecently(
  token: string
): Promise<boolean> {
  const gameId = await getGameIdFromToken(token);
  const playerId = await getUserId(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM wordsfound WHERE idGame = ? AND idPlayer = ? AND foundAt > DATE_SUB(NOW(), INTERVAL ? SECOND)",
      [gameId, playerId, DEFAULT_TIMEOUT_SECONDS],
      (error, results) => {
        if (error) reject(error);
        resolve(results.length > 0);
      }
    );
  });
}

export async function getScores(token: string): Promise<Score[]> {
  const gameId = await getGameIdFromToken(token);
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT name, SUM(score) as score FROM wordsfound NATURAL JOIN players WHERE idGame = ? GROUP BY idPlayer",
      [gameId],
      (error, results) => {
        if (error) reject(error);
        const scores: Score[] = [];
        results.forEach((result: { name: string; score: number }) => {
          scores.push({ name: result.name, score: result.score });
        });
        resolve(scores);
      }
    );
  });
}
