import { createContext, useContext, useState } from "react";
import BoardPosition from "@shared/backend/src/helpers/BoardPosition.js"
const CurrentMoveContext = createContext();

export function CurrentMoveProvider({children}) {
  const [fromPosition, setFromPositionState] = useState("");
  const [toPosition, setToPositionState] = useState("");

  const validatePosition = (position) => position.length == 2 && BoardPosition.isValid(position.charAt(0), Number(position.charAt(1)));

  const setFromPosition = (newFromPosition) => {
    if(!newFromPosition.trim() === "" && !validatePosition(newFromPosition)) {
      setFromPositionState("");
      return;
    }
    setFromPositionState(newFromPosition);
  }

  const setToPosition = (newToPosition) => {
    if(!newToPosition.trim() === "" && !validatePosition(newToPosition)) {
      setToPositionState("");
      return;
    }
    setToPositionState(newToPosition);
  }

  return (
    <CurrentMoveContext.Provider value={{fromPosition, toPosition, setFromPosition, setToPosition}}>
      {children}
    </CurrentMoveContext.Provider>
  )
}

export function useCurrentMove() {
  return useContext(CurrentMoveContext);
}