import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./js/store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store } = useContext(Context)
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/LogIn" />;
    }

    return children;
};

export default ProtectedRoute;