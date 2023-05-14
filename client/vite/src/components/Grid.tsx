import { useEffect } from "react";
import { apiUrl } from "../vars";
import "./Grid.css";
import { PlayerColors } from "./WithRealtime";

const GRID_SIZE = 4;

export interface GridProps {
  gameId: string;
  ws: WebSocket;
  colors: PlayerColors;
}

export function Grid({ gameId, ws, colors }: GridProps) {
  function cellNumber(row: number, col: number) {
    return row * GRID_SIZE + col;
  }

  function cellId(cell: number) {
    return `cell-${cell}`;
  }

  function getCellImage(row: number, col: number) {
    const cell = cellNumber(row, col);
    return apiUrl + `?action=game.getCellImage&gameId=${gameId}&cell=${cell}`;
  }

  function clearCellsStyle() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("selected");
    });
  }

  function drawWord(path: number[], playerName: string) {
    console.log(colors);
    clearCellsStyle();
    path.forEach((cell) => {
      const cellElement = document.getElementById(cellId(cell));
      if (cellElement) {
        cellElement.classList.add("selected");
        cellElement.style.setProperty("--color", colors.get(playerName)!);
      }
    });
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wordFound") {
        const { path, displayName } = data.payload;
        drawWord(path, displayName);
      }
    });
  }, [ws, colors]);

  return (
    <div>
      {[...Array(GRID_SIZE)].map((_, i) => (
        <div className="row" key={i}>
          {[...Array(GRID_SIZE)].map((_, j) => (
            <div key={j} className="cell" id={cellId(cellNumber(i, j))}>
              <img src={getCellImage(i, j)} alt="" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
