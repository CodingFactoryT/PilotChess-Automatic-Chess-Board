import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';
import AuthGuard from './AuthGuard';
import DebugPage from './pages/debugPage';
import { AuthProvider } from './context/AuthContext';
import config from '../../config';
import { useEffect } from 'react';
import { useWebsocketNotification } from './context/WebsocketNotificationContext';

function App() {
	const { handleWebsocketMessage } = useWebsocketNotification();

	useEffect(() => {
		const socket = new WebSocket(`ws://localhost:${config.node_port}`);
		socket.addEventListener("message", event => {
			handleWebsocketMessage(JSON.parse(event.data));
		});
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

export default App;
