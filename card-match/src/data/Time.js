export default function getTimeStamps() {
  const timeStamps = [];
  for (let i = 2; i >= 0; i--) {
    for (let j = 59; j >= 0; j--) {
      const timeStamp = `${i}:${j < 10 ? "0" + j : j}`;
      timeStamps.push(timeStamp);
    }
  }
  return timeStamps;
}
