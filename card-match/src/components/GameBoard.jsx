import { useContext } from "react";
import { GameBoardContext } from "../store/GameBoardContext.jsx";

export default function GameBoard() {
  const { gameBoard, handleUpdateGameBoard } = useContext(GameBoardContext);
  const imgPath = "/card-faces/";
  const defaultImg = "fox-card-back.png";

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((col, colIndex) => {
              return (
                <li key={colIndex}>
                  <button
                    className={`card ${col.open ? "flip" : ""} ${
                      col.isMatched ? "matched" : ""
                    }`}
                    onClick={() =>
                      handleUpdateGameBoard(col, rowIndex, colIndex)
                    }
                    disabled={col.open || col.isMatched}
                  >
                    <div className="card-inner">
                      <img
                        className="card-front"
                        src={`${imgPath}${col.id}.png`}
                      />
                      <img className="card-back" src={imgPath + defaultImg} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
