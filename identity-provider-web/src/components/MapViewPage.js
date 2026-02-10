import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import roadIssueService from '../services/roadIssueService';
import '../styles/MapView.css';

// Icône personnalisée pour les marqueurs
const issueIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchIssuesAndStats();
  }, [selectedStatus]);

  const fetchIssuesAndStats = async () => {
    try {
      setLoading(true);
      const issuesData = selectedStatus === 'ALL' 
        ? await roadIssueService.getAllIssues()
        : await roadIssueService.getIssuesByStatus(selectedStatus);
      
      const statsData = await roadIssueService.getStatistics();
      
      setIssues(issuesData);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'NEW': return '#ff6b6b';
      case 'IN_PROGRESS': return '#ffa502';
      case 'COMPLETED': return '#2ecc71';
      default: return '#3498db';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'NEW': 'Nouveau',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminé'
    };
    return labels[status] || status;
  };

  // Coordonnées d'Antananarivo
  const antananarivoCenter = [-18.8747, 47.5292];

  return (
    <div className="map-view-container">
      <div className="map-sidebar">
        <h2>Signalements Routiers</h2>
        
        {stats && (
          <div className="stats-box">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.totalIssues}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Surface:</span>
              <span className="stat-value">{stats.totalSurfaceArea?.toFixed(0)} m²</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Budget:</span>
              <span className="stat-value">{stats.totalBudget?.toLocaleString('fr-FR')} Ar</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avancement:</span>
              <span className="stat-value">{stats.completionPercentage?.toFixed(1)}%</span>
            </div>
          </div>
        )}

        <div className="filter-section">
          <h3>Filtrer par statut</h3>
          <div className="filter-buttons">
            {['ALL', 'NEW', 'IN_PROGRESS', 'COMPLETED'].map(status => (
              <button
                key={status}
                className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'ALL' ? 'Tous' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="issues-list">
          <h3>Problèmes ({issues.length})</h3>
          <div className="issues-scroll">
            {issues.map(issue => (
              <div key={issue.id} className="issue-item">
                <div className="issue-header">
                  <h4>{issue.title}</h4>
                  <span className="issue-status" style={{ backgroundColor: getStatusColor(issue.status) }}>
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
                <p className="issue-description">{issue.description}</p>
                <div className="issue-details">
                  <span>Surface: {issue.surfaceArea?.toFixed(0)} m²</span>
                  <span>Budget: {issue.budget?.toLocaleString('fr-FR')} Ar</span>
                </div>
                {issue.company && <p className="issue-company">Entreprise: {issue.company}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        {loading ? (
          <div className="loading">Chargement de la carte...</div>
        ) : (
          <MapContainer center={antananarivoCenter} zoom={12} scrollWheelZoom={true} className="leaflet-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map(issue => (
              <Marker 
                key={issue.id} 
                position={[issue.latitude, issue.longitude]}
                icon={issueIcon}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{issue.title}</h3>
                    <p><strong>Statut:</strong> {getStatusLabel(issue.status)}</p>
                    <p><strong>Surface:</strong> {issue.surfaceArea?.toFixed(0)} m²</p>
                    <p><strong>Budget:</strong> {issue.budget?.toLocaleString('fr-FR')} Ar</p>
                    {issue.company && <p><strong>Entreprise:</strong> {issue.company}</p>}
                    {issue.priority && <p><strong>Priorité:</strong> {issue.priority}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default MapView;
