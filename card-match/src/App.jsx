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
    //queue is full, close the old card.
    if (currQueue.length == 2) {
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

    //check for winner
    let lastCard = null; //assume queue is empty
    if(currQueue.length > 0) {
      //get the latest card in the queue.
      lastCard = currQueue[currQueue.length - 1];
    }

    if(lastCard != null && lastCard.id === cardObj.id) {
      //winner found, empty the queue.
      currQueue.length = 0;
    } else {
      //winner not found, push current card to card queue.
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
