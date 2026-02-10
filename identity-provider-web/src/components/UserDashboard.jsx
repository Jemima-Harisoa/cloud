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
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Tous les Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Mes Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Statistiques
                    </button>
                </div>

                {/* TAB 1: TOUS LES SIGNALEMENTS */}
                {activeTab === 'all' && (
                    <section className="map-section">
                        <h2>Carte des Travaux Routiers</h2>
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
                        <h2>Mes Signalements</h2>
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
                        <h2>Mes Statistiques</h2>
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
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="stat-value">{stats.totalIssues || 0}</div>
                                        <div className="stat-label">Total Signalements</div>
                                    </div>
                                    <div className="stat-card stat-card-new">
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="stat-value">{stats.newIssues || 0}</div>
                                        <div className="stat-label">Nouveaux</div>
                                    </div>
                                    <div className="stat-card stat-card-progress">
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        <div className="stat-value">{stats.inProgressIssues || 0}</div>
                                        <div className="stat-label">En Cours</div>
                                    </div>
                                    <div className="stat-card stat-card-completed">
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="stat-value">{stats.completedIssues || 0}</div>
                                        <div className="stat-label">Terminés</div>
                                    </div>
                                </div>
                                
                                <div className="stats-grid stats-grid-secondary">
                                    <div className="stat-card">
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        </div>
                                        <div className="stat-value">
                                            {stats.totalSurface ? stats.totalSurface.toFixed(2) : 0} m²
                                        </div>
                                        <div className="stat-label">Surface Totale</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
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
