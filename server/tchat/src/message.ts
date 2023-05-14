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