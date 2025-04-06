import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router"
import { Chessboard } from "react-chessboard";
import { Box } from "@mui/material"
import { useGameBoard } from "../../context/GameBoardContext";

export default function GamePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const setupData = location.state;
    const {fenPosition} = useGameBoard();
    
    useEffect(() => {
        if(!setupData) {
            navigate("/", {replace: true});
        }
    }, []);

    return setupData && (
        <Box sx={{
            height: "50vh",
            width: "50vw"
        }}>
            <Chessboard id="defaultChessboard" 
            arePiecesDraggable={false} 
            arePremovesAllowed={false} 
            autoPromoteToQueen={true} 
            boardOrientation={setupData.color}
            position={fenPosition}
            />
        </Box>
    )
}