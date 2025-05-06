import { useEffect } from "react";
import WebSocketController from "@src/controller/WebSocketController"
import { useSnackbar } from "notistack";
import React from 'react';
import { acceptChallenge, declineChallenge } from "@src/helpers/WebsocketResponses/challenge";
import { useNavigate } from "react-router";
import { useGameBoard } from "@src/context/GameBoardContext";
import { useChat } from "@src/context/ChatContext";

const openSnackbarMessages = new Map();

export default function WebSocketHandler() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {setFenPosition} = useGameBoard();
  const {addEntry, clearEntries} = useChat();

  useEffect(() => {
		WebSocketController.initConnection(handleWebsocketMessage);
	}, []);

  function handleWebsocketMessage(message) {
    switch (message.type) {
      case "challenge":
        handleChallengeMessage(message.data); // Pass the function to enqueueSnackbar
        break;
      case "challengeCanceled":
        handleChallengeDeclinedMessage(message.data.id);
        break;
      case "gameStart":
        handleGameStartMessage(message.data);
        break;
      case "pieceMoved":
        handlePieceMoved(message.data);
        break;
      case "chat":
        addEntry(message.data.username, message.data.isMe, message.data.message);
        break;
      default:
        console.error("Frontend cannot handle this type of message:", message.type);
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

  function handleGameStartMessage(data) {
    setFenPosition(data.fen);
    navigate("/game", {state: data});
  }

  function handlePieceMoved(data) {
    setFenPosition(data.fen);
  }
  
  return null;  //doesn't render anything
}