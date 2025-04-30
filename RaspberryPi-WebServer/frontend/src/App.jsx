import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';
import AuthGuard from './AuthGuard';
import DebugPage from './pages/debugPage';
import { AuthProvider } from './context/AuthContext';
import WebSocketHandler from './components/WebSocketHandler';
import GamePage from './pages/gamePage';
import { ChatProvider } from './context/ChatContext';
import MenuHeader from './components/MenuHeader';
import { CurrentMoveProvider } from './context/CurrentMoveContext';

export default function App() {
	return (
			<BrowserRouter>
				<ChatProvider>
					<WebSocketHandler/>
					<AuthProvider>
						<Routes>
							<Route path="/wifi-configuration" element={ <WifiConfigurationPage/> } />
							<Route path="/login" element={ <LoginPage/> } />
							<Route path="/" element={
								<AuthGuard>
									<MenuHeader>
										<HomePage/>
									</MenuHeader>
								</AuthGuard>
							} />
							<Route path="/game" element={
								<AuthGuard>
									<MenuHeader>
										<CurrentMoveProvider>
											<GamePage/>
										</CurrentMoveProvider>
									</MenuHeader>
								</AuthGuard>
							} />
							<Route path="/debug" element={ <DebugPage/> }/>
							<Route path="/*" element={ <NotFoundPage/> } />
						</Routes>
					</AuthProvider>
				</ChatProvider>
			</BrowserRouter>
	);
}