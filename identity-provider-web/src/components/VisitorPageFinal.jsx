import React from 'react';
import RoadWorkMap from './RoadWorkMap';
import '../styles/VisitorPage.css';

function VisitorPage() {
    return (
        <div className="visitor-page">
            <header className="visitor-header">
                <div className="visitor-info">
                    <h1>🌍 Travaux Routiers - Antananarivo</h1>
                    <p className="visitor-subtitle">
                        Consultez en temps réel les travaux routiers en cours dans la ville
                    </p>
                </div>
                <div className="visitor-actions">
                    <button 
                        className="btn-login"
                        onClick={() => window.location.href = '/login'}
                    >
                        🔐 Se Connecter
                    </button>
                    <button 
                        className="btn-register"
                        onClick={() => window.location.href = '/register'}
                    >
                        ✍️ S'Inscrire
                    </button>
                </div>
            </header>

            <div className="visitor-content">
                <section className="visitor-info-section">
                    <h2>📋 Comment Utiliser Cette Carte</h2>
                    <div className="info-grid">
                        <div className="info-card">
                            <h3>🔴 Points Rouges = NOUVEAU</h3>
                            <p>Signalement récemment créé, travaux non commencés</p>
                        </div>
                        <div className="info-card">
                            <h3>🟠 Points Orange = EN COURS</h3>
                            <p>Travaux routiers actuellement en progression</p>
                        </div>
                        <div className="info-card">
                            <h3>🟢 Points Verts = TERMINÉ</h3>
                            <p>Travaux routiers complètement terminés</p>
                        </div>
                        <div className="info-card">
                            <h3>ℹ️ Cliquez sur un Point</h3>
                            <p>Voir les détails: date, surface, budget, entreprise</p>
                        </div>
                    </div>
                </section>

                <section className="visitor-stats-section">
                    <h2>📊 Statistiques Actuelles</h2>
                    <p className="stats-description">
                        Voici un récapitulatif des travaux routiers d'Antananarivo
                    </p>
                </section>

                <section className="map-section">
                    <h2>🗺️ Carte Interactive</h2>
                    <div className="map-container">
                        <RoadWorkMap 
                            userRole="visitor"
                        />
                    </div>
                </section>

                <section className="visitor-footer">
                    <h2>👤 Vous Avez Un Compte?</h2>
                    <p>
                        Connectez-vous pour signaler et suivre les travaux routiers!
                    </p>
                    <button 
                        className="btn-login-large"
                        onClick={() => window.location.href = '/login'}
                    >
                        🔐 Se Connecter Maintenant
                    </button>
                </section>
            </div>
        </div>
    );
}

export default VisitorPage;
