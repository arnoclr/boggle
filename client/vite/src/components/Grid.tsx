import { apiUrl } from "../vars";

const GRID_SIZE = 4;

export interface GridProps {
  gameId: string;
}

export function Grid({ gameId }: GridProps) {
  function getCellImage(row: number, col: number) {
    const cell = row * GRID_SIZE + col;
    return apiUrl + `?action=game.getCellImage&gameId=${gameId}&cell=${cell}`;
  }

  return (
    <div>
      {[...Array(GRID_SIZE)].map((_, i) => (
        <div className="row" key={i}>
          {[...Array(GRID_SIZE)].map((_, j) => (
            <img src={getCellImage(i, j)} alt="" key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}
