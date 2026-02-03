import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonLoading
} from '@ionic/react';
import { add, location, list, logOut } from 'ionicons/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './MapPage.css';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = 'http://localhost:8080/api';

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerIcon = (status: string) => {
    const colors: any = {
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

interface RoadIssue {
    id: number;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
    surfaceM2?: number;
    budget?: number;
    companyName?: string;
    createdAt: string;
    reporterId?: number;
}

const MapPage: React.FC = () => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [issues, setIssues] = useState<RoadIssue[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [newIssueLocation, setNewIssueLocation] = useState<[number, number] | null>(null);
    const [description, setDescription] = useState('');
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([-18.8792, 47.5079]);
    const [filter, setFilter] = useState<'all' | 'mine'>('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCurrentLocation();
        loadIssues();
        loadStats();
    }, [filter]);

    const getCurrentLocation = async () => {
        try {
            const position = await Geolocation.getCurrentPosition();
            setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    const loadIssues = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = `${API_BASE_URL}/road-issues`;

            if (filter === 'mine') {
                url += `?reporterId=${user.id}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIssues(response.data);
        } catch (error) {
            console.error('Error loading issues:', error);
        }
    };

    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/road-issues/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleMapClick = (latlng: [number, number]) => {
        setNewIssueLocation(latlng);
        setShowModal(true);
    };

    const handleSubmitIssue = async () => {
        if (!newIssueLocation || !description) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE_URL}/road-issues?reporterId=${user.id}`,
                {
                    latitude: newIssueLocation[0],
                    longitude: newIssueLocation[1],
                    description,
                    status: 'NOUVEAU'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowModal(false);
            setDescription('');
            setNewIssueLocation(null);
            loadIssues();
            loadStats();
            alert('Signalement créé avec succès');
        } catch (error) {
            console.error('Error creating issue:', error);
            alert('Erreur lors de la création du signalement');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        history.push('/login');
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                handleMapClick([e.latlng.lat, e.latlng.lng]);
            }
        });
        return null;
    };

    const getStatusLabel = (status: string) => {
        const labels: any = {
            NOUVEAU: 'Nouveau',
            EN_COURS: 'En cours',
            TERMINE: 'Terminé'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            NOUVEAU: 'danger',
            EN_COURS: 'warning',
            TERMINE: 'success'
        };
        return colors[status] || 'medium';
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Carte des Travaux</IonTitle>
                    <IonButton slot="end" fill="clear" onClick={handleLogout}>
                        <IonIcon icon={logOut} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Stats */}
                {stats && (
                    <div className="stats-container">
                        <IonCard>
                            <IonCardContent>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.totalIssues}</div>
                                        <div className="stat-label">Signalements</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.totalSurfaceM2?.toFixed(0) || 0}</div>
                                        <div className="stat-label">Surface (m²)</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.completionPercentage?.toFixed(0) || 0}%</div>
                                        <div className="stat-label">Avancement</div>
                                    </div>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </div>
                )}

                {/* Filter */}
                <div className="filter-container">
                    <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as any)}>
                        <IonSegmentButton value="all">
                            <IonLabel>Tous</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="mine">
                            <IonLabel>Mes signalements</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>

                {/* Map */}
                <div className="map-container">
                    <MapContainer
                        center={currentLocation}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <MapClickHandler />

                        {/* Current location marker */}
                        <Marker position={currentLocation}>
                            <Popup>Votre position</Popup>
                        </Marker>

                        {/* Issue markers */}
                        {issues.map((issue) => (
                            <Marker
                                key={issue.id}
                                position={[issue.latitude, issue.longitude]}
                                icon={getMarkerIcon(issue.status)}
                            >
                                <Popup>
                                    <div className="popup-content">
                                        <h3>Signalement #{issue.id}</h3>
                                        <IonBadge color={getStatusColor(issue.status)}>
                                            {getStatusLabel(issue.status)}
                                        </IonBadge>
                                        <p>{issue.description}</p>
                                        <p className="popup-date">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* FAB for adding new issue */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={getCurrentLocation}>
                        <IonIcon icon={location} />
                    </IonFabButton>
                </IonFab>

                {/* Modal for new issue */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle>Nouveau Signalement</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <IonTextarea
                                value={description}
                                onIonChange={(e) => setDescription(e.detail.value!)}
                                placeholder="Décrivez le problème routier..."
                                rows={5}
                            />
                        </IonItem>

                        {newIssueLocation && (
                            <IonItem>
                                <IonLabel>
                                    <p>Latitude: {newIssueLocation[0].toFixed(6)}</p>
                                    <p>Longitude: {newIssueLocation[1].toFixed(6)}</p>
                                </IonLabel>
                            </IonItem>
                        )}

                        <IonButton expand="block" onClick={handleSubmitIssue} className="submit-button">
                            Créer le signalement
                        </IonButton>

                        <IonButton expand="block" fill="clear" onClick={() => setShowModal(false)}>
                            Annuler
                        </IonButton>

                        <IonLoading isOpen={loading} message="Création en cours..." />
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default MapPage;
