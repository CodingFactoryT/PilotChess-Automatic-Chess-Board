import { Navigate, Route } from 'react-router-dom'
import LoginPage from "./pages/loginPage";

export default function AuthGuard({ children }) {
  const isUserLoggedIn = false; //TODO update dynamically

  return(
    isUserLoggedIn ?  children  : <Navigate to="/login" />
  )
}