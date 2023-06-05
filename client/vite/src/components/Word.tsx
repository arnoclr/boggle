import "./Word.css";

export interface WordProps {
  word: string;
}

export default function Word({ word }: WordProps) {
  return (
    <div className="Word">
      {word
        .toUpperCase()
        .split("")
        .map((letter, i) => {
          return (
            <span key={i} className="letter">
              {letter}
            </span>
          );
        })}
    </div>
  );
}
