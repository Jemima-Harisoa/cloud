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

function MapDebugger() {
    const [mapConfig, setMapConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tileRequests, setTileRequests] = useState([]);

    useEffect(() => {
        loadMapConfig();
        interceptTileRequests();
    }, []);

    const loadMapConfig = async () => {
        try {
            const response = await mapService.getConfig();
            console.log('Configuration de la carte récupérée:', response.data);
            setMapConfig(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement de la carte:', err);
            setError('Erreur lors du chargement de la carte');
        } finally {
            setLoading(false);
        }
    };

    const interceptTileRequests = () => {
        // Intercepter les requêtes réseau pour traquer les requêtes de tuiles
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('/tile/')) {
                console.log('🗺️ Requête de tuile interceptée:', url);
                setTileRequests(prev => [...prev.slice(-9), {
                    url,
                    timestamp: new Date().toLocaleTimeString(),
                    isLocal: url.includes('localhost:8081')
                }]);
            }
            return originalFetch.apply(this, args);
        };
    };

    const testTileUrls = async () => {
        if (!mapConfig) return;
        
        console.log('🔍 Test des URLs de tuiles...');
        
        // Test URL directe OSM
        const osmUrl = 'https://a.tile.openstreetmap.org/13/4242/2621.png';
        console.log('Test OSM direct:', osmUrl);
        
        // Test URL serveur local
        const localUrl = mapConfig.tileUrl.replace('{z}', '13').replace('{x}', '4242').replace('{y}', '2621');
        console.log('Test serveur local:', localUrl);
        
        try {
            const localResponse = await fetch(localUrl);
            console.log('Statut serveur local:', localResponse.status);
        } catch (err) {
            console.error('Erreur serveur local:', err);
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
                <h2 className="card-title">🔍 Debugger Serveur de Tuiles</h2>

                {/* Informations de configuration */}
                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--dark-bg)', borderRadius: '0.5rem' }}>
                    <h3>Configuration actuelle</h3>
                    <p><strong>URL serveur tuiles:</strong> <span style={{ color: 'cyan' }}>{mapConfig.tileServerUrl}</span></p>
                    <p><strong>URL template tuiles:</strong> <span style={{ color: 'cyan' }}>{mapConfig.tileUrl}</span></p>
                    <p><strong>Attribution:</strong> {mapConfig.attribution}</p>
                </div>

                {/* Contrôles de test */}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={testTileUrls} className="btn btn-primary">
                        🧪 Tester URLs de tuiles
                    </button>
                    <button onClick={() => setTileRequests([])} className="btn btn-secondary">
                        🗑️ Vider le log
                    </button>
                </div>

                {/* Log des requêtes de tuiles */}
                {tileRequests.length > 0 && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--dark-bg)', borderRadius: '0.5rem' }}>
                        <h3>🔍 Requêtes de tuiles interceptées</h3>
                        <div style={{ maxHeight: '200px', overflow: 'auto', fontSize: '0.9em' }}>
                            {tileRequests.map((req, index) => (
                                <div key={index} style={{ 
                                    margin: '0.5rem 0', 
                                    padding: '0.5rem', 
                                    backgroundColor: req.isLocal ? '#1a4d1a' : '#4d1a1a',
                                    borderRadius: '0.25rem'
                                }}>
                                    <strong>{req.timestamp}</strong> - 
                                    <span style={{ color: req.isLocal ? '#90EE90' : '#FFB6C1' }}>
                                        {req.isLocal ? ' 🟢 LOCAL' : ' 🔴 EXTERNE'}
                                    </span>
                                    <br/>
                                    <small>{req.url}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Carte de test */}
                <div className="map-container">
                    <MapContainer
                        center={position}
                        zoom={mapConfig.zoom}
                        style={{ height: '400px', width: '100%' }}
                        key={mapConfig.tileUrl} // Force le rechargement si l'URL change
                    >
                        <TileLayer
                            attribution={mapConfig.attribution}
                            url={mapConfig.tileUrl}
                            onLoad={() => console.log('🗺️ Tuile chargée depuis:', mapConfig.tileUrl)}
                            onError={(error) => console.error('❌ Erreur chargement tuile:', error)}
                        />
                        <Marker position={position}>
                            <Popup>
                                Test de tuiles - Antananarivo<br/>
                                Source: {mapConfig.tileServerUrl}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--info-bg)', borderRadius: '0.5rem' }}>
                    <h4>Comment vérifier</h4>
                    <ol>
                        <li><strong>Console navigateur:</strong> Ouvrez F12 → Console pour voir les logs détaillés</li>
                        <li><strong>Onglet Network:</strong> F12 → Network → filtrez par "tile" pour voir les requêtes</li>
                        <li><strong>Couleurs du log:</strong> 🟢 Vert = serveur local, 🔴 Rouge = serveur externe</li>
                        <li><strong>Test manuel:</strong> Utilisez le bouton "Tester URLs de tuiles"</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default MapDebugger;