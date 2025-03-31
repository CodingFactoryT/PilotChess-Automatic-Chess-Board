import { useLocation, useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext";
import {Box, Button} from "@mui/material"
import { useEffect, useState } from "react";
import { apiGet } from "../../helpers/fetchBackendApi";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const redirectedFrom = location.state?.from?.pathname || "/";

    const [isFirstCall, setIsFirstCall] = useState(true);
    useEffect(() => {
        if(isAuthenticated) {
            console.log("Authenticated!");
            //if(performance.getEntriesByType("navigation").type !== "reload")
            apiGet("/auth/login").then(res => {
                navigate(redirectedFrom, {replace: true});
            }).catch(error => {
                console.error(error);
            });
        } else {
            //is also executed at initial page load
            if(isFirstCall) {
                setIsFirstCall(false);
            } else {
                console.error("Something went wrong while authenticating!");
            }
        }
    }, [isAuthenticated]);
    
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <Button variant="contained" color="primary" onClick={login}>
            Login with Lichess
            </Button>
        </Box>
    )
}