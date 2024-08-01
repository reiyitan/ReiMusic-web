import React from "react"; 
import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./PrivateRoute.css";

interface PrivateRouteProps {
    children: React.ReactNode,
    redirectPath: string
}

export const PrivateRoute = ({ children, redirectPath }: PrivateRouteProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(true);

    if (!isAuth) {
        return (
            <Navigate to={redirectPath} />
        );
    }
    else {
        return (
            <>
                {children}
            </>
        );
    }
}