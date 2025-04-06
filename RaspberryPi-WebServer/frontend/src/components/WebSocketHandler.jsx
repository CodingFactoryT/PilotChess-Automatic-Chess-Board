import { useEffect } from "react";
import WebSocketController from "../controller/WebSocketController"
import { useSnackbar } from "notistack";
import React from 'react';
import { acceptChallenge, declineChallenge } from "../helpers/WebsocketResponses/challenge";
import { useNavigate } from "react-router";
import { useGameBoard } from "../context/GameBoardContext";

const openSnackbarMessages = new Map();

export default function WebSocketHandler() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {setFenPosition} = useGameBoard();

  useEffect(() => {
		WebSocketController.initConnection(handleWebsocketMessage);
	}, []);

  function handleWebsocketMessage(data) {
    switch (data.type) {
      case "challenge":
        handleChallengeMessage(data.data); // Pass the function to enqueueSnackbar
        break;
      case "challengeCanceled":
        handleChallengeDeclinedMessage(data.data.id);
        break;
      case "gameStart":
        handleGameStartMessage(data.data);
        break;
      case "pieceMoved":
        handlePieceMoved(data.data);
        break;
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

  function handleGameStartMessage(data) {
    setFenPosition(data.fen);
    navigate("/game", {state: data});
  }

  function handlePieceMoved(data) {
    setFenPosition(data.fen);
  }
  
  return null;  //doesn't render anything
}