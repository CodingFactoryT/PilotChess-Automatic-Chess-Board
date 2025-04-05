import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';
import AuthGuard from './AuthGuard';
import DebugPage from './pages/debugPage';
import { AuthProvider } from './context/AuthContext';
import WebSocketHandler from './components/WebSocketHandler';
import GamePage from './pages/gamePage';

export default function App() {
	return (
			<BrowserRouter>
				<WebSocketHandler/>
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
						<Route path="/game" element={
							<AuthGuard>
								<GamePage/>
							</AuthGuard>
						} />
						<Route path="/debug" element={ <DebugPage/> }/>
						<Route path="/*" element={ <NotFoundPage/> } />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
	);
}