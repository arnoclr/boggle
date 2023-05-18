import { connection } from "./sql";
import { WebSocketMessage } from "./types";

export async function saveMessage(message: WebSocketMessage<any>): Promise<boolean> {
    try {
        const { gameId, playerId, content } = message.payload;
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

export async function getMessages(gameId: number): Promise<WebSocketMessage<any>[]> {
    try {
        const [rows] = await connection.query(
            "SELECT * FROM chat WHERE idGame = ? ORDER BY sendAt ASC",
            [gameId]
        );
        const messages = rows as any;
        return messages.map((message: any) => ({
            type: "chat",
            token: "",
            payload: {
                gameId: message.idGame,
                playerId: message.idPlayer,
                content: message.message,
                displayName: "",
            }
        }));
    } catch (e) {
        console.error("Error getting messages:", e);
        return [];
    }
}