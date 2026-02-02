import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RoadWorkMap from './RoadWorkMap';

function ManagerDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    const loadBlockedUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/blocked-users');
            setBlockedUsers(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs bloqués:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await api.post(`/auth/unblock/${userId}`);
            alert('Utilisateur débloqué avec succès');
            loadBlockedUsers();
        } catch (error) {
            console.error('Erreur lors du déblocage:', error);
            alert('Erreur lors du déblocage de l\'utilisateur');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-brand">Manager Dashboard</div>
                    <div className="navbar-menu">
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ paddingTop: '3rem' }}>
                {/* Welcome Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-color))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Tableau de bord Manager
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Gestion des signalements et des utilisateurs
                    </p>
                </div>

                {/* Blocked Users Section */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>
                        👥 Utilisateurs bloqués
                    </h2>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            Chargement...
                        </p>
                    ) : blockedUsers.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            Aucun utilisateur bloqué
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Nom</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Tentatives</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blockedUsers.map((blockedUser) => (
                                        <tr key={blockedUser.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem' }}>{blockedUser.id}</td>
                                            <td style={{ padding: '1rem' }}>{blockedUser.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {blockedUser.firstName && blockedUser.lastName
                                                    ? `${blockedUser.firstName} ${blockedUser.lastName}`
                                                    : 'N/A'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '1rem',
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    Bloqué
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleUnblockUser(blockedUser.id)}
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                                >
                                                    Débloquer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Road Work Map */}
                <RoadWorkMap userRole="manager" userId={user.id} />
            </div>
        </div>
    );
}

export default ManagerDashboard;
