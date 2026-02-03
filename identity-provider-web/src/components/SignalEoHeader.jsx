import React from 'react';
import '../styles/signal-eo-design.css';

function SignalEoHeader({ user = null, onLogout = null }) {
    return (
        <header className="signal-eo-header">
            <a href="/" className="signal-eo-logo">
                <div className="signal-eo-logo-icon">📍</div>
                <div>
                    <div className="signal-eo-brand-text">Signal-eo</div>
                    <div className="signal-eo-tagline">Suivi des travaux routiers</div>
                </div>
            </a>
            
            <div className="header-actions">
                {user && (
                    <span style={{ color: 'var(--text-gray)', fontSize: '0.95rem' }}>
                        Connecté: <strong>{user.firstName}</strong>
                    </span>
                )}
                {onLogout && (
                    <button 
                        className="btn btn-logout"
                        onClick={onLogout}
                    >
                        🚪 Déconnexion
                    </button>
                )}
            </div>
        </header>
    );
}

export default SignalEoHeader;
