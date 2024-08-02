import React from "react"; 
import { Navigate } from "react-router-dom";
import { useAuth } from "../../ContextProviders";
import "./PrivateRoute.css";

interface PrivateRouteProps {
    children: React.ReactNode,
    redirectPath: string
}

export const PrivateRoute = ({ children, redirectPath }: PrivateRouteProps) => {
    const auth = useAuth();

    if (!auth.currentUser) {
        return <Navigate to={redirectPath}/>
    }

    return (
        <>
            {children}
        </>
    );
}