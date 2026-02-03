import React, { useState, useEffect } from 'react';
import RoadWorkMap from './RoadWorkMap';
import Header from './Header';
import '../styles/modern-design.css';
import '../styles/ManagerPage.css';

function ManagerPage() {
    const [user, setUser] = useState(null);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('map');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadBlockedUsers();
    }, []);

    const loadBlockedUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/blocked-users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBlockedUsers(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs bloqués:', error);
        }
        setLoading(false);
    };

    const handleUnblockUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir débloquer cet utilisateur?')) {
            try {
                const response = await fetch(`/api/auth/unblock/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    alert('✅ Utilisateur débloqué avec succès!');
                    loadBlockedUsers();
                } else {
                    alert('❌ Erreur lors du déblocage');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('❌ Erreur lors du déblocage');
            }
        }
    };

    return (
        <div className="manager-page">
            <Header user={user} showLogout={true} />

            <div className="manager-content">
                <div className="manager-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                        onClick={() => setActiveTab('map')}
                    >
                        Gestion des Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'blocked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blocked')}
                    >
                        Utilisateurs Bloqués
                    </button>
                </div>

                {/* TAB 1: CARTE MANAGER */}
                {activeTab === 'map' && (
                    <section className="map-section">
                        <h2>Gestion des Signalements</h2>
                        <div className="map-instructions">
                            <p>
                                <strong>Cliquez sur un point</strong> pour modifier:
                            </p>
                            <ul>
                                <li>Surface (m²)</li>
                                <li>Budget (Ar)</li>
                                <li>Entreprise</li>
                                <li>Statut (Nouveau / En cours / Terminé)</li>
                            </ul>
                            <p className="sync-info">
                                <strong>Bouton Synchroniser:</strong> Envoie tous les signalements vers Firebase pour l'affichage mobile
                            </p>
                        </div>
                        <RoadWorkMap 
                            userRole="manager" 
                            userId={user?.id}
                        />
                    </section>
                )}

                {/* TAB 2: UTILISATEURS BLOQUÉS */}
                {activeTab === 'blocked' && (
                    <section className="blocked-users-section">
                        <h2>Utilisateurs Bloqués</h2>
                        <p className="blocked-description">
                            Débloquez les utilisateurs qui ont essayé de se connecter trop de fois
                        </p>

                        {loading ? (
                            <div className="loading">Chargement...</div>
                        ) : blockedUsers.length === 0 ? (
                            <div className="no-data">
                                Aucun utilisateur bloqué actuellement!
                            </div>
                        ) : (
                            <div className="blocked-users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Prénom</th>
                                            <th>Nom</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blockedUsers.map((u, index) => (
                                            <tr key={u.id}>
                                                <td>{index + 1}</td>
                                                <td><code>{u.email}</code></td>
                                                <td>{u.firstName}</td>
                                                <td>{u.lastName}</td>
                                                <td>
                                                    <span className="badge-blocked">
                                                        BLOQUÉ
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn-unblock"
                                                        onClick={() => handleUnblockUser(u.id)}
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
                    </section>
                )}
            </div>
        </div>
    );
}

export default ManagerPage;
