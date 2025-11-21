function getAllCards() {
  const cards = [];
  ["H", "D", "S", "C"].map((symbol) => {
    for (let i = 1; i <= 13; i++) {
      let card = `${i}` + symbol;
      cards.push(card);
    }
  });
  return cards;
}

export default function getInitialGameBoard() {
  const deck = getAllCards();
  const selectedCards = [];
  const gameBoard = [];

  //select 12 random cards.
  for(let i = 0; i< 12; i++) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    selectedCards.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
  }

  //make pairs.
  const pairs = [...selectedCards, ...selectedCards];

  //shuffle cards (Fisher-Yates)
  for(let i = pairs.length - 1; i>=0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    // swap cards at ith and jth index.
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  //populate gameboard.
  let index = 0;
  for (let row = 0; row < 4; row++) {
    let currRow = [];
    for (let column = 0; column < 6; column++) {
      currRow.push({
        id: pairs[index],
        row: row,
        col : column,
        open: false
      });
      index++;
    }
    gameBoard.push(currRow);
  }
  return gameBoard;
}
