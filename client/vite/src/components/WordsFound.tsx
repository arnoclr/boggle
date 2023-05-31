import { useEffect, useState } from "react";
import Word from "./Word";

export interface WordsFoundProps {
  ws: WebSocket;
}

export function WordsFound({ ws }: WordsFoundProps) {
  const [wordsFound, setWordsFound] = useState<string[]>([]);

  function lastFoundWordsFirst() {
    return [...wordsFound].reverse();
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wordFound") {
        const { word, displayName } = data.payload;
        setWordsFound((wordsFound) => [...wordsFound, word]);
      }
    });
  }, [ws]);

  return (
    <>
      <div className="wordsFound">
        {lastFoundWordsFirst().map((word) => (
          <Word word={word} key={word}></Word>
        ))}
      </div>
    </>
  );
}
