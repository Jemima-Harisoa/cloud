import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/modern-design.css';
import '../styles/VisitorPage.css';

function VisitorPage() {
    const [stats, setStats] = useState({
        totalReports: 0,
        activeReports: 0,
        resolvedReports: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch statistics
        fetch('http://localhost:8080/api/road-issues/stats')
            .then(response => response.json())
            .then(data => {
                setStats({
                    totalReports: data.totalReports || 0,
                    activeReports: data.activeReports || 0,
                    resolvedReports: data.resolvedReports || 0
                });
            })
            .catch(error => console.error('Error fetching stats:', error));
    }, []);

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    return (
        <div className="visitor-page">
            {/* Header */}
            <div style={{
                background: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px'
            }}>
                <div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#10b981',
                        letterSpacing: '-0.5px',
                        fontFamily: 'Georgia, serif',
                        margin: '0 0 8px 0'
                    }}>
                        signal.eo
                    </div>
                    <div style={{
                        color: '#6b7280',
                        fontSize: '15px'
                    }}>
                        Signalez les problèmes routiers en temps réel
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={handleLogin}
                        style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '15px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)';
                        }}
                    >
                        Se Connecter
                    </button>
                    <button
                        onClick={handleRegister}
                        style={{
                            padding: '12px 20px',
                            background: '#ffffff',
                            color: '#10b981',
                            border: '2px solid #10b981',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '15px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.05)'}
                        onMouseLeave={(e) => e.target.style.background = '#ffffff'}
                    >
                        S'Inscrire
                    </button>
                </div>
            </div>

            <div className="visitor-content">
                {/* Info Section */}
                <section className="visitor-info-section">
                    <h2>Comment ça marche?</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <span style={{ fontSize: '24px', color: '#ffffff' }}>1</span>
                            </div>
                            <h3>Signalez</h3>
                            <p>Repérez un problème routier? Créez un compte et signalez-le immédiatement.</p>
                        </div>
                        <div className="info-card">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <span style={{ fontSize: '24px', color: '#ffffff' }}>2</span>
                            </div>
                            <h3>Communauté</h3>
                            <p>Partager avec d'autres utilisateurs pour amplifier le signal des problèmes.</p>
                        </div>
                        <div className="info-card">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <span style={{ fontSize: '24px', color: '#ffffff' }}>3</span>
                            </div>
                            <h3>Action</h3>
                            <p>Les autorités répondent et résolvent les problèmes signalés.</p>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="visitor-stats-section">
                    <h2>Statistiques</h2>
                    <p className="stats-description">État actuel du réseau</p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px',
                        marginTop: '24px',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#10b981',
                                marginBottom: '8px'
                            }}>
                                {stats.totalReports}
                            </div>
                            <div style={{
                                color: '#6b7280',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}>
                                Signalements Total
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#f59e0b',
                                marginBottom: '8px'
                            }}>
                                {stats.activeReports}
                            </div>
                            <div style={{
                                color: '#6b7280',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}>
                                En Cours
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#059669',
                                marginBottom: '8px'
                            }}>
                                {stats.resolvedReports}
                            </div>
                            <div style={{
                                color: '#6b7280',
                                fontSize: '15px',
                                fontWeight: '500'
                            }}>
                                Résolus
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="map-section">
                    <h2>Carte des Signalements</h2>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '15px',
                        margin: '8px 0 24px 0'
                    }}>
                        Visualisez les problèmes routiers actuels sur la carte interactive
                    </p>
                    <div className="map-container" style={{
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                            <p style={{ margin: 0 }}>Connectez-vous pour voir la carte interactive</p>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="visitor-footer">
                    <h2>Prêt à commencer?</h2>
                    <p>Rejoignez notre communauté pour améliorer la sécurité routière</p>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={handleRegister}
                            style={{
                                padding: '12px 24px',
                                background: '#ffffff',
                                color: '#10b981',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            S'Inscrire Maintenant
                        </button>
                        <button
                            onClick={handleLogin}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                border: '2px solid #ffffff',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '16px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                            Se Connecter
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default VisitorPage;
