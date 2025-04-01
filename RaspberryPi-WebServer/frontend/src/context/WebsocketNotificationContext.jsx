import { useSnackbar } from "notistack";
import React, { createContext, useContext } from 'react';
import { acceptChallenge, declineChallenge } from "../helpers/WebsocketResponses/challenge";

const WebsocketNotificationContext = createContext();

export function useWebsocketNotification() {
	return useContext(WebsocketNotificationContext);
}

export function WebsocketNotificationProvider({children}) {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleWebsocketMessage(data) {
    switch (data.type) {
      case "challenge":
        console.log(data);
        handleChallengeMessage(data.data); // Pass the function to enqueueSnackbar
        break;
      default:
        console.error("Frontend cannot handle this type of message:", data.type);
    }
  }

  function handleChallengeMessage(challengeData) {
    enqueueSnackbar(`Challenge received from ${challengeData.challenger}`, { variant: "info", action:(
			<>
			<button onClick={() => {acceptChallenge(challengeData.id); closeSnackbar();}}>Accept</button>
			<button onClick={() => {declineChallenge(challengeData.id); closeSnackbar();}}>Decline</button>
			</>
		), persist: true});
  }

  return (
    <WebsocketNotificationContext.Provider value={handleWebsocketMessage}>
      {children}
    </WebsocketNotificationContext.Provider>
  );
}