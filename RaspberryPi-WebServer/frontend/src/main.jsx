import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from "notistack";
import { WebsocketNotificationProvider } from "./context/WebsocketNotificationContext.jsx";

createRoot(document.getElementById("root")).render(
	//<StrictMode>
		<>
			<CssBaseline />
			<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
				<WebsocketNotificationProvider>
					<App />
				</WebsocketNotificationProvider>
			</SnackbarProvider>
		</>
	//</StrictMode>
);
