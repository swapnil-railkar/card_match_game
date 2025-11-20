import { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";

function App() {
  const [timerState, updateTimerState] = useState(false);
  function handleLoss() {

  }


  return (
    <>
      <Timer timerStarted={timerState} onTimeExpire={handleLoss}/>
    </>
  );
}

export default App;
