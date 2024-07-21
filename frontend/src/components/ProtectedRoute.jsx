/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

/**
 * Verifies access for protected routes
 *
 * When route is loaded, tries to authorize
 * If there is a token that is expired -> refresh the token
 * If there is no token -> not authorized -> navigate to login page
 */

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // as soon as we load a protected route, we try to auth with our token
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    })

    const refreshToken = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: token,
            });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        // check if token and if expired
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; // date in seconds

        if (tokenExpiration < now) {
            //if the token is expired
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="login" />;
}

export default ProtectedRoute;
