import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router"

export default function GamePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const setupData = location.state;

    useEffect(() => {
        if(!setupData) {
            navigate("/", {replace: true});
        }
    }, []);

    return setupData && (
        <p>{JSON.stringify(setupData)}</p>
    )
}