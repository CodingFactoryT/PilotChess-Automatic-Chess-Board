import { Navigate, Route, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  return(
    isAuthenticated ?  children  : <Navigate to="/login" state={{ from: location }}/>
  )
}