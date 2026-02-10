import React, { useState, useEffect } from 'react';
import RoadWorkMap from './RoadWorkMap';
import Header from './Header';
import '../styles/modern-design.css';
import '../styles/ManagerPage.css';

function ManagerPage() {
    const [user, setUser] = useState(null);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('map');
    const [filterBlocked, setFilterBlocked] = useState('all'); // 'all', 'blocked', 'not-blocked'
    const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadBlockedUsers();
        loadAllUsers();
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

    const loadAllUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
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
                    alert('Utilisateur débloqué avec succès!');
                    loadBlockedUsers();
                    loadAllUsers();
                } else {
                    alert('Erreur lors du déblocage');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du déblocage');
            }
        }
    };

    const handleBlockUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir bloquer cet utilisateur?')) {
            try {
                const response = await fetch(`/api/auth/block/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    alert('Utilisateur bloqué avec succès!');
                    loadBlockedUsers();
                    loadAllUsers();
                } else {
                    alert('Erreur lors du blocage');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du blocage');
            }
        }
    };

    // Filtrer les utilisateurs selon les filtres sélectionnés
    const getFilteredUsers = () => {
        return allUsers.filter(u => {
            // Filtre par statut de blocage
            if (filterBlocked === 'blocked' && !u.isBlocked) return false;
            if (filterBlocked === 'not-blocked' && u.isBlocked) return false;
            
            // Filtre par statut actif
            if (filterActive === 'active' && !u.isActive) return false;
            if (filterActive === 'inactive' && u.isActive) return false;
            
            return true;
        });
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
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Gestion des Signalements
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'blocked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blocked')}
                    >
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Utilisateurs Bloqués
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Liste des Utilisateurs
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

                {/* TAB 3: LISTE DES UTILISATEURS */}
                {activeTab === 'users' && (
                    <section className="users-section">
                        <h2>Liste des Utilisateurs</h2>
                        <p className="users-description">
                            Vue d'ensemble de tous les utilisateurs inscrits avec leur statut
                        </p>

                        {/* FILTRES */}
                        <div className="users-filters">
                            <div className="filter-group">
                                <label>Statut Blocage:</label>
                                <div className="filter-buttons">
                                    <button 
                                        className={`filter-btn ${filterBlocked === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilterBlocked('all')}
                                    >
                                        Tous
                                    </button>
                                    <button 
                                        className={`filter-btn ${filterBlocked === 'blocked' ? 'active' : ''}`}
                                        onClick={() => setFilterBlocked('blocked')}
                                    >
                                        Bloqués
                                    </button>
                                    <button 
                                        className={`filter-btn ${filterBlocked === 'not-blocked' ? 'active' : ''}`}
                                        onClick={() => setFilterBlocked('not-blocked')}
                                    >
                                        Non Bloqués
                                    </button>
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Statut Compte:</label>
                                <div className="filter-buttons">
                                    <button 
                                        className={`filter-btn ${filterActive === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilterActive('all')}
                                    >
                                        Tous
                                    </button>
                                    <button 
                                        className={`filter-btn ${filterActive === 'active' ? 'active' : ''}`}
                                        onClick={() => setFilterActive('active')}
                                    >
                                        Actifs
                                    </button>
                                    <button 
                                        className={`filter-btn ${filterActive === 'inactive' ? 'active' : ''}`}
                                        onClick={() => setFilterActive('inactive')}
                                    >
                                        Inactifs
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading">Chargement...</div>
                        ) : getFilteredUsers().length === 0 ? (
                            <div className="no-data">
                                Aucun utilisateur trouvé avec ces filtres
                            </div>
                        ) : (
                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Email</th>
                                            <th>Prénom</th>
                                            <th>Nom</th>
                                            <th>Téléphone</th>
                                            <th>Rôle</th>
                                            <th>Statut Compte</th>
                                            <th>Statut Blocage</th>
                                            <th>Dernière Connexion</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFilteredUsers().map((u, index) => (
                                            <tr key={u.id}>
                                                <td>{index + 1}</td>
                                                <td><code>{u.email}</code></td>
                                                <td>{u.firstName}</td>
                                                <td>{u.lastName}</td>
                                                <td>{u.phoneNumber || '-'}</td>
                                                <td>
                                                    <span className={`badge-role badge-role-${u.role.toLowerCase()}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.isActive ? (
                                                        <span className="badge-active">
                                                            ✓ ACTIF
                                                        </span>
                                                    ) : (
                                                        <span className="badge-inactive">
                                                            ✗ INACTIF
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {u.isBlocked ? (
                                                        <span className="badge-blocked">
                                                            BLOQUÉ
                                                        </span>
                                                    ) : (
                                                        <span className="badge-not-blocked">
                                                            NON BLOQUÉ
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                                                </td>
                                                <td>
                                                    {u.isBlocked && (
                                                        <button 
                                                            className="btn-unblock"
                                                            onClick={() => handleUnblockUser(u.id)}
                                                        >
                                                            Débloquer
                                                        </button>
                                                    )}
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
