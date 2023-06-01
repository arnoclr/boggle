import { connection } from "./sql";
import { ChatMessage } from "./types";
import { getUserId, getGameIdFromToken, getUserName } from "./game";

export async function saveMessage(message: ChatMessage, token: string): Promise<boolean> {
    try {

        const content = message.payload.message;
        const playerId = await getUserId(token);
        const gameId = await getGameIdFromToken(token);

        await connection.query(
            "INSERT INTO chat (message, idPlayer, idGame, sendAt) VALUES (?, ?, ?, ?)",
            [content, playerId, gameId, new Date()]
        );
        return true;
    } catch (e) {
        console.error("Error saving message:", e);
        return false;
    }
}

export async function deleteOldMessages(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await connection.query(
        "DELETE FROM chat WHERE sendAt < ?",
        [oneWeekAgo]
    );
}

export async function getMessages(token: string): Promise<ChatMessage[]> {
    return new Promise((resolve, reject) => {
        getGameIdFromToken(token)
            .then((gameId: number) => {
                connection.query(
                    "SELECT * FROM chat WHERE idGame = ? ORDER BY sendAt ASC",
                    [gameId],
                    async (error, results) => {
                        if (error) reject(error);

                        if (!results || !Array.isArray(results) || results.length === 0) {
                            resolve([]);
                            return;
                        }

                        let username = await getUserName(token);

                        resolve(
                            results.map((message : any) => ({
                                type: "chat",
                                token,
                                payload: {
                                    message: message.message,
                                    displayName: username,
                                },
                            }))
                        );
                    }
                );
            })
            .catch((e) => {
                reject(e);
            }
        );
    });
}