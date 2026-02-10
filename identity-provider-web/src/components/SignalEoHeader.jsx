import React from 'react';
import '../styles/signal-eo-design.css';

function SignalEoHeader({ user = null, onLogout = null }) {
    return (
        <header className="signal-eo-header">
            <a href="/" className="signal-eo-logo">
                <div className="signal-eo-logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
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
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </button>
                )}
            </div>
        </header>
    );
}

export default SignalEoHeader;
