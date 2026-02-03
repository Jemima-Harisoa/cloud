import React, { useState, useEffect } from 'react';
import RoadWorkMap from './RoadWorkMap';
import Header from './Header';
import '../styles/modern-design.css';
import '../styles/UserDashboard.css';

function UserDashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="user-dashboard">
            <Header user={user} showLogout={true} />

            <div className="user-content">
                <section className="user-features">
                    <h2>Mes Fonctionnalités</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🗺️ Voir la Carte</h3>
                            <p>Consultez tous les travaux routiers en cours à Antananarivo</p>
                        </div>
                        <div className="feature-card">
                            <h3>📍 Mes Signalements</h3>
                            <p>Filtrez et suivez uniquement vos propres signalements</p>
                        </div>
                        <div className="feature-card">
                            <h3>📊 Statistiques</h3>
                            <p>Consultez le nombre de points, surface et avancement</p>
                        </div>
                        <div className="feature-card">
                            <h3>✏️ Modifier Profil</h3>
                            <p>Mettez à jour vos informations personnelles</p>
                        </div>
                    </div>
                </section>

                <section className="map-section">
                    <h2>🗺️ Carte Interactive</h2>
                    <p className="map-instructions">
                        Cliquez sur un point pour voir les détails: 
                        date, statut, surface (m²), budget et entreprise concernée
                    </p>
                    <RoadWorkMap 
                        userRole="user" 
                        userId={user?.id}
                    />
                </section>
            </div>
        </div>
    );
}

export default UserDashboard;
