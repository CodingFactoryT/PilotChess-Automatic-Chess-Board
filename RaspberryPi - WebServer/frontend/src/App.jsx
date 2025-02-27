import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import WifiConfigurationPage from './pages/wifiConfigurationPage';
import NotFoundPage from './pages/notFoundPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>} />
				<Route path="/login" element={<LoginPage/>} />
				<Route path="/profile" element={<ProfilePage/>} />
				<Route path="/wifi-configuration" element={<WifiConfigurationPage/>} />
				<Route path="/*" element={<NotFoundPage/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
