import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonSegment, IonSegmentButton, IonLabel, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapPage.css';
import roadIssueService from '../services/roadIssueService';
import authService from '../services/authService';

const MapPageMobile: React.FC = () => {
  const history = useHistory();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const currentUser = authService.getCurrentUser();

  const antananarivoCenter: [number, number] = [-18.8747, 47.5292];

  useEffect(() => {
    loadIssues();
  }, [viewMode, filter]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      let data;
      
      if (viewMode === 'mine' && currentUser?.id) {
        data = await roadIssueService.getIssuesByReporter(currentUser.id);
      } else if (filter !== 'all') {
        data = await roadIssueService.getIssuesByStatus(filter);
      } else {
        data = await roadIssueService.getAllIssues();
      }
      
      setIssues(data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return '#ff6b6b';
      case 'IN_PROGRESS': return '#ffa502';
      case 'COMPLETED': return '#2ecc71';
      default: return '#3498db';
    }
  };

  const handleReportIssue = () => {
    history.push('/report-issue');
  };

  const handleLogout = () => {
    authService.logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Carte - Travaux Routiers</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear"
            onClick={handleLogout}
          >
            Déconnexion
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="mobile-map-container">
          <div className="map-controls">
            <IonSegment 
              value={viewMode}
              onIonChange={(e) => setViewMode(e.detail.value as any)}
            >
              <IonSegmentButton value="all">
                <IonLabel>Tous</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="mine">
                <IonLabel>Mes signalements</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {viewMode === 'all' && (
              <IonItem>
                <IonLabel>Filtrer par statut:</IonLabel>
                <IonSelect 
                  value={filter}
                  onIonChange={(e) => setFilter(e.detail.value)}
                >
                  <IonSelectOption value="all">Tous</IonSelectOption>
                  <IonSelectOption value="NEW">Nouveaux</IonSelectOption>
                  <IonSelectOption value="IN_PROGRESS">En cours</IonSelectOption>
                  <IonSelectOption value="COMPLETED">Terminés</IonSelectOption>
                </IonSelect>
              </IonItem>
            )}

            {viewMode === 'mine' && (
              <IonButton 
                expand="block"
                color="success"
                onClick={handleReportIssue}
              >
                ➕ Signaler un problème
              </IonButton>
            )}
          </div>

          <div className="map-wrapper">
            <MapContainer center={antananarivoCenter} zoom={12} className="mobile-leaflet-map">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues.map(issue => (
                <Marker 
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>{issue.title}</h3>
                      <p><strong>Statut:</strong> {issue.status}</p>
                      <p><strong>Surface:</strong> {issue.surfaceArea?.toFixed(0)} m²</p>
                      <p><strong>Budget:</strong> {(issue.budget / 1000000)?.toFixed(1)}M Ar</p>
                      {issue.company && <p><strong>Entreprise:</strong> {issue.company}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="issues-list-mobile">
            <h3>{viewMode === 'mine' ? 'Mes signalements' : 'Signalements'} ({issues.length})</h3>
            <div className="issues-scroll">
              {issues.map(issue => (
                <div key={issue.id} className="issue-item-mobile">
                  <h4>{issue.title}</h4>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(issue.status) }}>
                    {issue.status}
                  </span>
                  <p>{issue.description}</p>
                  <div className="issue-meta">
                    <span>Surface: {issue.surfaceArea?.toFixed(0)} m²</span>
                    <span>Budget: {(issue.budget / 1000000)?.toFixed(1)}M Ar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MapPageMobile;
