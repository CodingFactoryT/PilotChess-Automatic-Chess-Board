import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router"
import { Chessboard } from "react-chessboard";
import { Box } from "@mui/material"
import { useGameBoard } from "../../context/GameBoardContext";
import MakeMoveComponent from "./components/MakeMoveComponent"
import ChatComponent from "./components/ChatComponents";

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

    const calculateResponsiveBoardWidth = () => Math.min(window.innerHeight, window.innerWidth) * 0.85;
    const [boardWidth, setBoardWidth] = useState(calculateResponsiveBoardWidth());

    useEffect(() => {
        const handleResize = () => setBoardWidth(calculateResponsiveBoardWidth());

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    return setupData && (
        <>
            <ChatComponent/>
            <Box sx={{
                display: "flex",
                width: "100%",
            }}>
                <Box sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <ChatComponent/>
                </Box>
                <Box sx={{
                    flexShrink: 0,
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <Box sx={{
                        width: boardWidth,
                        height: boardWidth  //square: width = height
                    }}>
                        <Chessboard id="defaultChessboard" 
                        arePiecesDraggable={false} 
                        arePremovesAllowed={false} 
                        autoPromoteToQueen={true} 
                        boardOrientation={setupData.color}
                        position={fenPosition}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    display: "grid",
                    alignItems: "center",
                }}>
                    <MakeMoveComponent />
                </Box>
            </Box>
        </>
    )
}