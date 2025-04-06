import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from "notistack";
import { GameBoardProvider } from "./context/GameBoardContext.jsx";

createRoot(document.getElementById("root")).render(
	//<StrictMode>
		<>
			<CssBaseline />
			<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
				<GameBoardProvider>
					<App />
				</GameBoardProvider>
			</SnackbarProvider>
		</>
	//</StrictMode>
);
