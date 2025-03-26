import { Button } from "@mui/material"
import { useAuth } from "../../context/AuthContext"

export default function HomePage() {
    const { logout } = useAuth();
    
    return (
        <>
        <Button variant="contained" color="primary" onClick={logout}>
        Logout from Lichess
        </Button>
        <p>HomePage</p>
        </>
    )
}