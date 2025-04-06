import { createContext, useContext, useState } from "react";

const GameBoardContext = createContext();

export function GameBoardProvider({children}) {
  const [fenPosition, setFenPosition] = useState();
  return (
    <GameBoardContext.Provider value={{fenPosition, setFenPosition}}>
      {children}
    </GameBoardContext.Provider>
  )
}

export function useGameBoard() {
  return useContext(GameBoardContext);
}