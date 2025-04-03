import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';
import AuthGuard from './AuthGuard';
import DebugPage from './pages/debugPage';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { useWebsocketNotification } from './context/WebsocketNotificationContext';
import WebsocketController from './controller/WebSocketController';

export default function App() {
	const { handleWebsocketMessage } = useWebsocketNotification();

	useEffect(() => {
		WebsocketController.initConnection(handleWebsocketMessage);
	}, []);

	return (
			<BrowserRouter>
				<AuthProvider>
					<Routes>
						<Route path="/wifi-configuration" element={ <WifiConfigurationPage/> } />
						<Route path="/login" element={ <LoginPage/> } />
						<Route path="/" element={
							<AuthGuard>
								<HomePage/>
							</AuthGuard>
						} />
						<Route path="/profile" element={
							<AuthGuard>
								<ProfilePage/>
							</AuthGuard>
						} />
						<Route path="/debug" element={ <DebugPage/> }/>
						<Route path="/*" element={ <NotFoundPage/> } />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
	);
}