import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LoginPage from '../pages/LoginPage/LoginPage';
import DashboardLayout from '../pages/Dashboard/DashboardLayout/DashboardLayout';
import DashboardHome from '../pages/Dashboard/SidebarLayout/components/DashboardHome/DashboardHome';
import DashboardTwo from '../pages/Dashboard/SidebarLayout/components/DashboardTwo/DashboardTwo';
import DashboardThree from '../pages/Dashboard/SidebarLayout/components/DashboardThree/DashboardThree';
import DashboardFour from '../pages/Dashboard/SidebarLayout/components/DashboardFour/DashboardFour';
import UiPathConfiguration from '../pages/Configuration/UiPathConfiguration';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="dashboard-2" element={<DashboardTwo />} />
                    <Route path="dashboard-3" element={<DashboardThree />} />
                    <Route path="dashboard-4" element={<DashboardFour />} />
                    <Route path="configuration" element={<UiPathConfiguration />} />
                    <Route path="settings" element={<div className="dashboard-page"><h1>Settings</h1></div>} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
