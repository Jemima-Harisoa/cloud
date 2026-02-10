import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header({ user, showLogout = true }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="header-logo-link">
                    <div className="header-logo">
                        signal.eo
                    </div>
                </Link>

                <div className="header-actions">
                    {user && (
                        <>
                            <div className="header-user-info">
                                {user.firstName} {user.lastName}
                            </div>
                            {showLogout && (
                                <button
                                    onClick={handleLogout}
                                    className="header-logout-btn"
                                >
                                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Déconnexion
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
