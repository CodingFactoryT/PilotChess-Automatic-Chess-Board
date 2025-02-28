import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';
import AuthGuard from './AuthGuard';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/wifi-configuration" element={<WifiConfigurationPage/>} />
				<Route path="/login" element={<LoginPage/>} />
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
				<Route path="/*" element={<NotFoundPage/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
