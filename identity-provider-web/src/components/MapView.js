import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mapService } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView() {
    const [mapConfig, setMapConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMapConfig();
    }, []);

    const loadMapConfig = async () => {
        try {
            const response = await mapService.getConfig();
            console.log('🗺️ Configuration reçue:', response.data);
            console.log('🔗 URL des tuiles utilisée:', response.data.tileUrl);
            setMapConfig(response.data);
        } catch (err) {
            console.error('❌ Erreur lors du chargement de la carte:', err);
            setError('Erreur lors du chargement de la carte');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="alert alert-error">{error}</div>
            </div>
        );
    }

    const position = [mapConfig.center.lat, mapConfig.center.lng];

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="card">
                <h2 className="card-title">Carte d'Antananarivo</h2>

                <div className="map-container">
                    <MapContainer
                        center={position}
                        zoom={mapConfig.zoom}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution={mapConfig.attribution}
                            url={mapConfig.tileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                            onLoad={() => {
                                console.log('✅ Tuile chargée depuis:', mapConfig.tileUrl || 'OSM direct');
                            }}
                            onError={(error) => {
                                console.error('❌ Erreur chargement tuile:', error);
                            }}
                        />
                        <Marker position={position}>
                            <Popup>
                                Antananarivo, Madagascar
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--dark-bg)', borderRadius: '0.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        <strong>Centre:</strong> {mapConfig.center.lat}, {mapConfig.center.lng}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <strong>Zoom:</strong> {mapConfig.zoom}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <strong>Serveur de tuiles:</strong> {mapConfig.tileServerUrl}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <strong>URL des tuiles:</strong> 
                        <span style={{ 
                            color: mapConfig.tileUrl?.includes('localhost') ? '#90EE90' : '#FFB6C1',
                            marginLeft: '0.5rem'
                        }}>
                            {mapConfig.tileUrl || 'OSM direct (fallback)'}
                        </span>
                        {mapConfig.tileUrl?.includes('localhost') && <span style={{ color: '#90EE90' }}> 🟢 LOCAL</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MapView;
