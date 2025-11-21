import { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import GameBoard from "./components/GameBoard";
import { GameBoardContext } from "./store/GameBoardContext";
import getInitialGameBoard from "./data/GameBoardInitiator";

function App() {
  const [startTimer, updateTimer] = useState(false);
  const [gameBoard, updateGameBoard] = useState(getInitialGameBoard());
  function handleUpdateTimer() {
    updateTimer((prevState) => !prevState);
  }

  function handleGameBoardUpdate(cardObj, row, col) {
    updateGameBoard((prevState) => {
      const newState = [...prevState.map((row) => [...row])];
      newState[row][col] = {
        ...cardObj,
        open: true,
      };
      return newState;
    });
  }
  const contextValue = {
    gameBoard: gameBoard,
    handleUpdateGameBoard: handleGameBoardUpdate,
  };
  return (
    <GameBoardContext.Provider value={contextValue}>
      <main className="game-container">
        <Timer timerStarted={startTimer} onTimeExpire={handleUpdateTimer} />
        <GameBoard />
      </main>
    </GameBoardContext.Provider>
  );
}

export default App;
