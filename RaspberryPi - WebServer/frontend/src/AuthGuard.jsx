import { Navigate, Route } from 'react-router-dom'
import axios from 'axios';

export default function AuthGuard({ children }) {
  const isUserLoggedIn = false; //TODO update dynamically
  return(
    isUserLoggedIn ?  children  : <Navigate to="/login" />
  )
}