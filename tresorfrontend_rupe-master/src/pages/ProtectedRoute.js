import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../comunication/Auth';

const ProtectedRoute = () => {
    const isAuthenticated = getToken();

    return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default ProtectedRoute; 