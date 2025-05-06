import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router"
import { Chessboard } from "react-chessboard";
import { Box } from "@mui/material"
import { useGameBoard } from "@src/context/GameBoardContext";
import MakeMoveComponent from "./components/MakeMoveComponent"
import ChatComponent from "./components/ChatComponent";
import { useCurrentMove } from "@src/context/CurrentMoveContext";

export default function GamePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const setupData = location.state;
    const {fenPosition} = useGameBoard();
    const {fromPosition, toPosition} = useCurrentMove();
    
    useEffect(() => {
        if(!setupData) {
            navigate("/", {replace: true});
        }
    }, []);

    return setupData && (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            width: "100%",
        }}>
            <Box sx={{
                justifySelf: "end"
            }}>
                <ChatComponent/>
            </Box>
            <Box sx={{
                justifySelf: "center",
                width: "min(85vh, 75vw)",
            }}>
                <Chessboard id="defaultChessboard" 
                arePiecesDraggable={false} 
                arePremovesAllowed={false} 
                autoPromoteToQueen={true} 
                boardOrientation={setupData.color}
                position={fenPosition}
                customBoardStyle={{
                    borderRadius: "8px"
                }}
                customArrows={fromPosition !== "" && toPosition !== "" ? [
                    [fromPosition, toPosition, "darkred"]
                ] : []}
                customSquareStyles={{
                    [fromPosition]: {
                        background: "#82AD65",
                    },
                    [toPosition]: {
                        background: "#5D5F71",
                    }
                }}  
                />
            </Box>
            <Box sx={{
                justifySelf: "start",
                alignSelf: "center",
                width: "100%",
            }}>
                <MakeMoveComponent />
            </Box>
        </Box>
    )
}