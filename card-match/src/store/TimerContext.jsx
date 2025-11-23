import { createContext } from "react";

export const TimerContext = createContext({
    currentIndex : 0,
    updateCurrentIndex : () => {},
    resetCurrentIndex : () => {}
});