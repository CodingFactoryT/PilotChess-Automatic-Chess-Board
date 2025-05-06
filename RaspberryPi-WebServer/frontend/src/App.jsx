import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@src/pages/homePage';
import LoginPage from '@src/pages/loginPage';
import WifiConfigurationPage from '@src/pages/wifiConfigurationPage';
import NotFoundPage from '@src/pages/notFoundPage';
import AuthGuard from '@src/AuthGuard';
import DebugPage from '@src/pages/debugPage';
import { AuthProvider } from '@src/context/AuthContext';
import WebSocketHandler from '@src/components/WebSocketHandler';
import GamePage from './pages/gamePage';
import { ChatProvider } from '@src/context/ChatContext';
import MenuHeader from '@src/components/MenuHeader';
import { CurrentMoveProvider } from '@src/context/CurrentMoveContext';

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