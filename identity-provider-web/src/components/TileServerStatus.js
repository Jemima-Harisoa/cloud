import React, { useState, useEffect } from 'react';
import { mapService } from '../services/api';

function TileServerStatus() {
    const [status, setStatus] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkTileServerStatus();
    }, []);

    const checkTileServerStatus = async () => {
        try {
            setLoading(true);
            
            // Récupérer le statut du serveur de tuiles
            const statusResponse = await mapService.getTileServerStatus();
            setStatus(statusResponse.data);

            // Récupérer la configuration des cartes
            const configResponse = await mapService.getConfig();
            setConfig(configResponse.data);

            setError('');
        } catch (err) {
            setError('Erreur lors de la connexion au serveur de tuiles');
            console.error('Erreur tile server:', err);
        } finally {
            setLoading(false);
        }
    };

    const testTileUrl = () => {
        if (config && config.tileServerUrl) {
            const testUrl = `${config.tileServerUrl}/tile/13/4242/2621.png`;
            window.open(testUrl, '_blank');
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="card">
                <h2 className="card-title">Statut du Serveur de Tuiles</h2>
                
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {status && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Informations du serveur</h3>
                        <div style={{ background: 'var(--dark-bg)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <p><strong>URL:</strong> {status.url}</p>
                            <p><strong>Statut:</strong> <span style={{ color: status.status === 'active' ? 'green' : 'red' }}>{status.status}</span></p>
                            <p><strong>Ville:</strong> {status.city}</p>
                        </div>
                    </div>
                )}

                {config && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Configuration des cartes</h3>
                        <div style={{ background: 'var(--dark-bg)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <p><strong>URL du serveur de tuiles:</strong> {config.tileServerUrl}</p>
                            <p><strong>URL des tuiles:</strong> {config.tileUrl}</p>
                            <p><strong>Centre:</strong> {config.center.lat}, {config.center.lng}</p>
                            <p><strong>Zoom par défaut:</strong> {config.zoom}</p>
                            <p><strong>Attribution:</strong> {config.attribution}</p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                        onClick={checkTileServerStatus}
                        className="btn btn-primary"
                    >
                        🔄 Actualiser le statut
                    </button>
                    
                    <button 
                        onClick={testTileUrl}
                        className="btn btn-secondary"
                        disabled={!config}
                    >
                        🌍 Tester une tuile
                    </button>
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--info-bg)', borderRadius: '0.5rem' }}>
                    <h4>Instructions de test</h4>
                    <ol>
                        <li>Assurez-vous que le serveur de tuiles est démarré avec <code>docker-compose up -d tile-server</code></li>
                        <li>Vérifiez que le port 8081 est accessible</li>
                        <li>Utilisez le bouton "Tester une tuile" pour vérifier la connectivité</li>
                        <li>Si ça ne marche pas, vérifiez les logs avec <code>docker-compose logs tile-server</code></li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default TileServerStatus;