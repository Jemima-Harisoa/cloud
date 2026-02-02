import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoadWorkMap from './RoadWorkMap';

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <nav className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-brand">Identity Provider</div>
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="navbar-link">Tableau de bord</Link>
                        <Link to="/map" className="navbar-link">Carte</Link>
                        <Link to="/profile" className="navbar-link">Profil</Link>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Bienvenue {user.firstName || user.email}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Signalement et suivi des travaux routiers - Antananarivo
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <div className="card">
                        <h3 className="card-title" style={{ fontSize: '1.25rem' }}>
                            👤 Mon Profil
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Gérez vos informations personnelles
                        </p>
                        <Link to="/profile" className="btn btn-primary">
                            Voir le profil
                        </Link>
                    </div>

                    <div className="card">
                        <h3 className="card-title" style={{ fontSize: '1.25rem' }}>
                            🗺️ Carte
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Explorez la carte d'Antananarivo
                        </p>
                        <Link to="/map" className="btn btn-primary">
                            Voir la carte
                        </Link>
                    </div>

                    <div className="card">
                        <h3 className="card-title" style={{ fontSize: '1.25rem' }}>
                            📊 Mes Signalements
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Consultez vos signalements
                        </p>
                        <Link to="/map" className="btn btn-primary">
                            Voir mes signalements
                        </Link>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 className="card-title">Informations du compte</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</p>
                            <p style={{ fontSize: '1.1rem' }}>{user.email}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nom complet</p>
                            <p style={{ fontSize: '1.1rem' }}>
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : 'Non renseigné'}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Statut</p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--secondary-color)' }}>Actif</p>
                        </div>
                    </div>
                </div>

                {/* Road Work Map */}
                <RoadWorkMap userRole="user" userId={user.id} />
            </div>
        </div>
    );
}

export default Dashboard;
