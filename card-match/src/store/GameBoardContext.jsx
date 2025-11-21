import { createContext } from "react";

export const GameBoardContext = createContext({
  gameBoard: [],
  handleUpdateGameBoard: () => {},
});
