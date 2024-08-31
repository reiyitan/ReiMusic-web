import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../ContextProviders";
import "./PrivateRoute.css";

const SERVER_IP = import.meta.env.VITE_SERVER_IP;
interface PrivateRouteProps {
    children: React.ReactNode,
    redirectPath: string
}

export const PrivateRoute = ({ children, redirectPath }: PrivateRouteProps) => {
    const navigate = useNavigate();
    const auth = useAuth();
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate(redirectPath);
        }
        else {
            const checkUserInDb = async () => {
                fetch(`http://${SERVER_IP}:3000/api/user/${user.uid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${await user.getIdToken(true)}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.user) {
                            navigate(redirectPath);
                        }
                    })
            }
            checkUserInDb();
        }
    }, []); 

    return (
        <>
            {children}
        </>
    );
}