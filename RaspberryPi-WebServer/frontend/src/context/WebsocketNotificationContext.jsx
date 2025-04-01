import { useSnackbar } from "notistack";
import React, { createContext, useContext } from 'react';
import { acceptChallenge, declineChallenge } from "../helpers/WebsocketResponses/challenge";

const WebsocketNotificationContext = createContext();
const openSnackbarMessages = new Map();

export function useWebsocketNotification() {
	return useContext(WebsocketNotificationContext);
}

export function WebsocketNotificationProvider({children}) {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleWebsocketMessage(data) {
    switch (data.type) {
      case "challenge":
        handleChallengeMessage(data.data); // Pass the function to enqueueSnackbar
        break;
      case "challengeCanceled":
        handleChallengeDeclinedMessage(data.data.id);
      default:
        console.error("Frontend cannot handle this type of message:", data.type);
    }
  }

  function handleChallengeMessage(challengeData) {
    const key = enqueueSnackbar(`Challenge received from ${challengeData.challenger}`, { variant: "info", action:(
			<>
			<button onClick={() => {
        acceptChallenge(challengeData.id);
        closeSnackbar();
        openSnackbarMessages.delete(challengeData.id);
      }}>Accept</button>
			<button onClick={() => {
        declineChallenge(challengeData.id); 
        closeSnackbar();
        openSnackbarMessages.delete(challengeData.id);
      }}>Decline</button>
			</>
		), persist: true});
  
    openSnackbarMessages.set(challengeData.id, key);
  }

  function handleChallengeDeclinedMessage(challengeId) {
    const snackbarMessageKey = openSnackbarMessages[challengeId];
    closeSnackbar(snackbarMessageKey);
    openSnackbarMessages.delete(challengeId);
  }

  return (
    <WebsocketNotificationContext.Provider value={{handleWebsocketMessage, handleChallengeDeclinedMessage}}>
      {children}
    </WebsocketNotificationContext.Provider>
  );
}