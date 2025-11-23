import { useRef, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import { GameBoardContext } from "./store/GameBoardContext";
import getInitialGameBoard from "./data/GameBoardInitiator";
import Overlay from "./components/Overlay";
import playerWinImg from "./assets/card-match-game-win.png";
import playerLostImg from "./assets/card-match-game-lost.png";
import GameBoard from "./components/GameBoard";
import { TimerContext } from "./store/TimerContext";
import getTimeStamps from "./data/Time";

const timeStamps = ["3.00", ...getTimeStamps()];
function App() {
  const [startTimer, updateStartTimer] = useState(false);
  const [gameBoard, updateGameBoard] = useState(getInitialGameBoard());
  const [showHowToPlay, updateShowHowToPlay] = useState(true);
  const [playerWon, updatePlyerWon] = useState(false);
  const [playerLost, updatePlayerLost] = useState(false);
  const [resetTimer, updateResetTimer] = useState(false);
  const [currIndex, updateIndex] = useState(0);
  const pairsFound = useRef(0);

  const cardQueue = useRef([]);

  function handleUpdateTimeStamp() {
    if (currIndex + 1 >= timeStamps.length) {
      updatePlayerLost(true);
      updateStartTimer(false);
      return;
    }
    updateIndex((oldIndex) => oldIndex + 1);
  }

  function handleResetTimer() {
    updateIndex(0);
    updateResetTimer(false);
  }

  function handleRestart() {
    updateGameBoard(getInitialGameBoard());
    updateStartTimer(false);
    updatePlyerWon(false);
    updatePlayerLost(false);
    updateResetTimer(true);
    pairsFound.current = 0;
  }

  function handleMatch(cardOne, cardTwo) {
    updateGameBoard((prevState) => {
      const newState = [...prevState.map((row) => [...row])];
      newState[cardOne.row][cardOne.col] = {
        ...cardOne,
        isMatched: true,
      };
      newState[cardTwo.row][cardTwo.col] = {
        ...cardTwo,
        isMatched: true,
      };
      return newState;
    });
    const currentPairs = pairsFound.current + 1;
    pairsFound.current = currentPairs;
    if (currentPairs === 12) {
      updateStartTimer(false);
      updatePlyerWon(true);
    }
  }

  function handleGameBoardUpdate(cardObj, row, col) {
    if (playerLost || playerWon) return;
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
      const matchedCard = currQueue[matchIndex];
      //current queue has a match.
      if (currQueue.length === 1) {
        //current queue has only one element, which is a match, so empty the queue.
        currQueue.length = 0;
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
      // delay so that card flip animation will get complete.
      setTimeout(() => {
        handleMatch(cardObj, matchedCard);
      }, 600);
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
    if (!startTimer) {
      updateResetTimer(false);
      updateStartTimer(true);
    }
  }

  const gameBoardCtx = {
    gameBoard: gameBoard,
    handleUpdateGameBoard: handleGameBoardUpdate,
  };

  const timerCtx = {
    currIndex: currIndex,
    updateCurrentIndex: handleUpdateTimeStamp,
    resetCurrentIndex: handleResetTimer,
  };

  return (
    <GameBoardContext.Provider value={gameBoardCtx}>
      <main className="game-container">
        <TimerContext.Provider value={timerCtx}>
          <Timer timerStarted={startTimer} resetIndex={resetTimer} />
        </TimerContext.Provider>
        {showHowToPlay && (
          <Overlay
            title={"How to Play"}
            buttonText={"PLAY"}
            playerWin={false}
            onClick={() => updateShowHowToPlay(false)}
          >
            <p className="how-to-play text">
              Flip two cards at a time to find matching pairs. If the cards
              match, they stay open, if not, they flip back. Remember the card
              positions and keep matching pairs until the entire grid is
              cleared. Try to finish the game before the timer runs out!
            </p>
          </Overlay>
        )}
        {playerWon && (
          <Overlay
            title={"Victory!!"}
            buttonText={"PLAY AGAIN"}
            playerWin={true}
            onClick={handleRestart}
          >
            <img src={playerWinImg} height={200} width={200} />
          </Overlay>
        )}
        {playerLost && (
          <Overlay
            title={"Time's Up!!"}
            buttonText={"RETRY"}
            playerWin={false}
            onClick={handleRestart}
          >
            <img src={playerLostImg} height={200} width={200} />
          </Overlay>
        )}
        <GameBoard />
      </main>
    </GameBoardContext.Provider>
  );
}

export default App;
