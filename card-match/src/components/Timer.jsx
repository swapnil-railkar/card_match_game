import { useRef, useState, useEffect } from "react";
import clockImg from "../assets/Clock.png";
import getTimeStamps from "../data/Time.js";

const timeStamps = getTimeStamps();
export default function Timer({ timerStarted, onTimeExpire }) {
  const [currTimeStamp, updateTimeStamp] = useState("3.00");
  const currIndex = useRef(0);

  function handleUpdateTimeStamp() {
    const index = currIndex.current;
    if (index + 1 >= timeStamps.length) {
      onTimeExpire();
      return;
    }
    currIndex.current = index + 1;
    updateTimeStamp(timeStamps[currIndex.current]);
  }

  useEffect(() => {
    if (!timerStarted) return; // do nothing until timer is started

    const id = setInterval(() => {
      handleUpdateTimeStamp();
    }, 1000);

    return () => clearInterval(id); // cleanup when component unmounts or timer stops
  }, [timerStarted]);

  return (
    <section className="timer-container">
      <img src={clockImg} height={30} width={30} />
      <p className="app-theme text">{currTimeStamp}</p>
    </section>
  );
}
