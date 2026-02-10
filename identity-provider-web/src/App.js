import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import ManagerPage from './components/ManagerPage';
import VisitorPage from './components/VisitorPage';
import Profile from './components/Profile';
import TileServerStatus from './components/TileServerStatus';
import MapDebugger from './components/MapDebugger';
import './index.css';

// Composant pour protéger les routes
function PrivateRoute({ children, requiredRole = null }) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    if (requiredRole && user && user.role !== requiredRole) {
        // Rediriger vers la bonne page selon le rôle
        if (user.role === 'MANAGER') {
            return <Navigate to="/manager-dashboard" />;
        } else {
            return <Navigate to="/user-dashboard" />;
        }
    }
    
    return children;
}

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                {/* Routes publiques */}
                <Route path="/visitor" element={<VisitorPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tile-server-status" element={<TileServerStatus />} />
                <Route path="/map-debugger" element={<MapDebugger />} />
                
                {/* Routes protégées - UTILISATEUR */}
                <Route
                    path="/user-dashboard"
                    element={
                        <PrivateRoute requiredRole="USER">
                            <UserDashboard />
                        </PrivateRoute>
                    }
                />
                
                {/* Routes protégées - MANAGER */}
                <Route
                    path="/manager-dashboard"
                    element={
                        <PrivateRoute requiredRole="MANAGER">
                            <ManagerPage />
                        </PrivateRoute>
                    }
                />
                
                {/* Route Profil - pour tous les rôles authentifiés */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                
                {/* Redirection par défaut */}
                <Route path="/" element={<Navigate to="/visitor" />} />
                
                {/* Page 404 */}
                <Route path="*" element={<Navigate to="/visitor" />} />
            </Routes>
        </Router>
    );
}

export default App;
