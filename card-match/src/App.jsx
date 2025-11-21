import { useRef, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import GameBoard from "./components/GameBoard";
import { GameBoardContext } from "./store/GameBoardContext";
import getInitialGameBoard from "./data/GameBoardInitiator";

function App() {
  const [startTimer, updateTimer] = useState(false);
  const [gameBoard, updateGameBoard] = useState(getInitialGameBoard());

  const cardQueue = useRef([]);
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

    const currQueue = cardQueue.current;
    const matchIndex = currQueue.findIndex((card) => card.id === cardObj.id);
    if (matchIndex != -1) {
      //current queue has a match.
      if (currQueue.length === 1) {
        //current queue has only one element, which is a match, so empty the queue.
        currQueue.length = 0;
        return;
      } else {
        // current queue has a match, find card that doesn't match.
        const indexToRemove = (matchIndex + 1) % 2;
        const cardToClose = currQueue[indexToRemove];
        currQueue.splice(indexToRemove, 1);

        //close the card
        updateGameBoard((prevState) => {
          const newState = [...prevState.map((row) => [...row])];
          newState[cardToClose.row][cardToClose.col] = {
            ...cardToClose,
            open: false,
          };
          return newState;
        });
      }
      //if match is, queue should be emptied to continue the game.
      currQueue.length = 0;
    } else {
      //current queue does not have a match.
      if (currQueue.length >= 2) {
        //queue is full.
        // remove old card from queue.
        const cardToClose = currQueue[0];
        currQueue.splice(0, 1);

        //close the old card.
        updateGameBoard((prevState) => {
          const newState = [...prevState.map((row) => [...row])];
          newState[cardToClose.row][cardToClose.col] = {
            ...cardToClose,
            open: false,
          };
          return newState;
        });
      }
      currQueue.push(cardObj);
    }
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
