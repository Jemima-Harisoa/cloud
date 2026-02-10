import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons for different statuses
const getMarkerIcon = (status) => {
    const colors = {
        NOUVEAU: '#ef4444',
        EN_COURS: '#f59e0b',
        TERMINE: '#10b981'
    };

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${colors[status]}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12]
    });
};

function RoadWorkMap({ userRole = 'visitor', userId = null, showMyIssuesOnly: propShowMyIssuesOnly = null }) {
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showMyIssuesOnly, setShowMyIssuesOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        surfaceM2: '',
        budget: '',
        companyName: '',
        status: 'NOUVEAU'
    });

    const center = [-18.8792, 47.5079]; // Antananarivo

    // Use prop value if provided, otherwise use state
    const effectiveShowMyIssuesOnly = propShowMyIssuesOnly !== null ? propShowMyIssuesOnly : showMyIssuesOnly;

    useEffect(() => {
        loadIssues();
    }, [effectiveShowMyIssuesOnly, userId]);

    // Calculer les statistiques à partir des issues affichées
    useEffect(() => {
        if (issues.length > 0) {
            calculateStats();
        } else {
            setStats(null);
        }
    }, [issues]);

    const loadIssues = async () => {
        try {
            setLoading(true);
            let url = '/road-issues';
            if (effectiveShowMyIssuesOnly && userId) {
                url += `?reporterId=${userId}`;
            }
            const response = await api.get(url);
            setIssues(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des signalements:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const totalIssues = issues.length;
        const completedIssues = issues.filter(issue => issue.status === 'TERMINE').length;
        const totalSurfaceM2 = issues.reduce((sum, issue) => sum + (issue.surfaceM2 || 0), 0);
        const totalBudget = issues.reduce((sum, issue) => sum + (issue.budget || 0), 0);
        const completionPercentage = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;

        setStats({
            totalIssues,
            completedIssues,
            totalSurfaceM2,
            totalBudget,
            completionPercentage
        });
    };

    const handleUpdateIssue = async (issueId) => {
        try {
            await api.put(`/road-issues/${issueId}`, formData);
            setEditMode(false);
            setSelectedIssue(null);
            loadIssues();
            alert('Signalement mis à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleDeleteIssue = async (issueId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
            try {
                await api.delete(`/road-issues/${issueId}`);
                setSelectedIssue(null);
                loadIssues();
                alert('Signalement supprimé avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleSync = async () => {
        try {
            await api.post('/road-issues/sync');
            alert('Synchronisation effectuée avec succès');
            loadIssues();
        } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
            alert('Erreur lors de la synchronisation');
        }
    };

    const startEdit = (issue) => {
        setEditMode(true);
        setFormData({
            surfaceM2: issue.surfaceM2 || '',
            budget: issue.budget || '',
            companyName: issue.companyName || '',
            status: issue.status
        });
    };

    const getStatusLabel = (status) => {
        const labels = {
            NOUVEAU: 'Nouveau',
            EN_COURS: 'En cours',
            TERMINE: 'Terminé'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            NOUVEAU: '#ef4444',
            EN_COURS: '#f59e0b',
            TERMINE: '#10b981'
        };
        return colors[status] || '#6b7280';
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header with stats */}
            {stats && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            Carte des Travaux Routiers
                        </h2>
                        {userRole === 'manager' && (
                            <button onClick={handleSync} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Synchroniser
                            </button>
                        )}
                    </div>

                    {/* Stats cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nombre de signalements</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {stats.totalIssues}
                            </p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Surface totale (m²)</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                {stats.totalSurfaceM2?.toFixed(2) || 0}
                            </p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Budget total (Ar)</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                                {stats.totalBudget?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Avancement</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                                {stats.completionPercentage?.toFixed(1) || 0}%
                            </p>
                        </div>
                    </div>

                    {/* Filter for users - only show if not controlled by parent */}
                    {userRole === 'user' && propShowMyIssuesOnly === null && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={showMyIssuesOnly}
                                    onChange={(e) => setShowMyIssuesOnly(e.target.checked)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Afficher uniquement mes signalements
                            </label>
                        </div>
                    )}
                </div>
            )}

            {/* Map */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', height: '600px' }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="http://localhost:8081/tile/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {issues.map((issue) => (
                        <Marker
                            key={issue.id}
                            position={[issue.latitude, issue.longitude]}
                            icon={getMarkerIcon(issue.status)}
                            eventHandlers={{
                                click: () => setSelectedIssue(issue)
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: '250px' }}>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                        Signalement #{issue.id}
                                    </h3>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: getStatusColor(issue.status),
                                            color: 'white'
                                        }}>
                                            {getStatusLabel(issue.status)}
                                        </span>
                                    </div>
                                    {issue.description && (
                                        <p style={{ marginBottom: '0.5rem' }}>{issue.description}</p>
                                    )}
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        Date: {new Date(issue.createdAt).toLocaleDateString()}
                                    </p>
                                    {issue.surfaceM2 && (
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Surface: {issue.surfaceM2} m²
                                        </p>
                                    )}
                                    {issue.budget && (
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Budget: {issue.budget.toLocaleString()} Ar
                                        </p>
                                    )}
                                    {issue.companyName && (
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Entreprise: {issue.companyName}
                                        </p>
                                    )}

                                    {userRole === 'manager' && (
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => startEdit(issue)}
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteIssue(issue.id)}
                                                className="btn btn-secondary"
                                                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Edit Modal */}
            {editMode && selectedIssue && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Modifier le signalement #{selectedIssue.id}</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Statut</label>
                            <select
                                className="form-input"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="NOUVEAU">Nouveau</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="TERMINE">Terminé</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Surface (m²)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.surfaceM2}
                                onChange={(e) => setFormData({ ...formData, surfaceM2: e.target.value })}
                                placeholder="Surface en m²"
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Budget (Ar)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="Budget en Ariary"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Entreprise</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Nom de l'entreprise"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => handleUpdateIssue(selectedIssue.id)}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setSelectedIssue(null);
                                }}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadWorkMap;
