import { useEffect, useContext } from "react";
import clockImg from "../assets/Clock.png";
import getTimeStamps from "../data/Time.js";
import { TimerContext } from "../store/TimerContext.jsx";

const timeStamps = ["3.00", ...getTimeStamps()];
export default function Timer({ timerStarted, resetIndex }) {
  const { currIndex, updateCurrentIndex, resetCurrentIndex } = useContext(TimerContext);

  useEffect(() => {
    if (resetIndex) {
      resetCurrentIndex(); // call context reset function
    }
  }, [resetIndex]);

  useEffect(() => {
    if (!timerStarted) {
      return; // do nothing until timer is started
    }

    const id = setInterval(() => {
      updateCurrentIndex();
    }, 1000);

    return () => clearInterval(id); // cleanup when component unmounts or timer stops
  }, [timerStarted, currIndex]);

  return (
    <section className="timer-container">
      <img src={clockImg} height={30} width={30} />
      <p className="app-theme text">
        {timerStarted ? timeStamps[currIndex] : "3.00"}
      </p>
    </section>
  );
}
