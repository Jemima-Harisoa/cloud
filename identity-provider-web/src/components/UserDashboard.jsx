import React, { useState, useEffect } from 'react';
import RoadWorkMap from './RoadWorkMap';
import Header from './Header';
import '../styles/modern-design.css';
import '../styles/UserDashboard.css';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'stats' && user) {
            loadStatistics();
        }
    }, [activeTab, user]);

    const loadStatistics = async () => {
        if (!user?.id) return;
        
        try {
            // Charger uniquement les signalements de l'utilisateur
            const response = await fetch(`http://localhost:8080/api/road-issues?reporterId=${user.id}`);
            if (response.ok) {
                const userIssues = await response.json();
                
                // Calculer les statistiques personnelles
                const totalIssues = userIssues.length;
                const completedIssues = userIssues.filter(issue => issue.status === 'TERMINE').length;
                const inProgressIssues = userIssues.filter(issue => issue.status === 'EN_COURS').length;
                const newIssues = userIssues.filter(issue => issue.status === 'NOUVEAU').length;
                const totalSurface = userIssues.reduce((sum, issue) => sum + (issue.surfaceM2 || 0), 0);
                const totalBudget = userIssues.reduce((sum, issue) => sum + (issue.budget || 0), 0);
                
                setStats({
                    totalIssues,
                    completedIssues,
                    inProgressIssues,
                    newIssues,
                    totalSurface,
                    totalBudget
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    };

    return (
        <div className="user-dashboard">
            <Header user={user} showLogout={true} />

            <div className="user-content">
                <div className="user-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        🗺️ Tous les Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        📍 Mes Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        📊 Statistiques
                    </button>
                </div>

                {/* TAB 1: TOUS LES SIGNALEMENTS */}
                {activeTab === 'all' && (
                    <section className="map-section">
                        <h2>🗺️ Carte des Travaux Routiers</h2>
                        <div className="map-instructions">
                            <p>Consultez tous les travaux routiers en cours à Antananarivo</p>
                            <p className="info-text">
                                <strong>Cliquez sur un point</strong> pour voir les détails du signalement
                            </p>
                        </div>
                        <RoadWorkMap 
                            userRole="user" 
                            userId={user?.id}
                        />
                    </section>
                )}

                {/* TAB 2: MES SIGNALEMENTS */}
                {activeTab === 'my' && (
                    <section className="map-section">
                        <h2>📍 Mes Signalements</h2>
                        <div className="map-instructions">
                            <p>Filtrez et suivez uniquement vos propres signalements</p>
                            <p className="info-text">
                                Seuls vos signalements sont affichés sur la carte
                            </p>
                        </div>
                        <RoadWorkMap 
                            userRole="user" 
                            userId={user?.id}
                            showMyIssuesOnly={true}
                        />
                    </section>
                )}

                {/* TAB 3: STATISTIQUES */}
                {activeTab === 'stats' && (
                    <section className="stats-section">
                        <h2>📊 Mes Statistiques</h2>
                        <p className="stats-description">
                            Vue d'ensemble de vos propres signalements de travaux routiers
                        </p>

                        {!stats ? (
                            <div className="loading">Chargement de vos statistiques...</div>
                        ) : stats.totalIssues === 0 ? (
                            <div className="no-data-stats">
                                <p>Vous n'avez pas encore de signalements.</p>
                                <p>Rendez-vous dans l'onglet "Mes Signalements" pour en créer.</p>
                            </div>
                        ) : (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card stat-card-primary">
                                        <div className="stat-icon">📍</div>
                                        <div className="stat-value">{stats.totalIssues || 0}</div>
                                        <div className="stat-label">Total Signalements</div>
                                    </div>
                                    <div className="stat-card stat-card-new">
                                        <div className="stat-icon">🆕</div>
                                        <div className="stat-value">{stats.newIssues || 0}</div>
                                        <div className="stat-label">Nouveaux</div>
                                    </div>
                                    <div className="stat-card stat-card-progress">
                                        <div className="stat-icon">🚧</div>
                                        <div className="stat-value">{stats.inProgressIssues || 0}</div>
                                        <div className="stat-label">En Cours</div>
                                    </div>
                                    <div className="stat-card stat-card-completed">
                                        <div className="stat-icon">✅</div>
                                        <div className="stat-value">{stats.completedIssues || 0}</div>
                                        <div className="stat-label">Terminés</div>
                                    </div>
                                </div>
                                
                                <div className="stats-grid stats-grid-secondary">
                                    <div className="stat-card">
                                        <div className="stat-icon">📐</div>
                                        <div className="stat-value">
                                            {stats.totalSurface ? stats.totalSurface.toFixed(2) : 0} m²
                                        </div>
                                        <div className="stat-label">Surface Totale</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-value">
                                            {stats.totalBudget ? (stats.totalBudget / 1000000).toFixed(2) + 'M' : 0} Ar
                                        </div>
                                        <div className="stat-label">Budget Total</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
