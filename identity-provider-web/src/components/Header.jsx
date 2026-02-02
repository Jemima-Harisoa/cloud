import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, showLogout = true }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header style={{
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#10b981',
                        letterSpacing: '-0.5px',
                        fontFamily: 'Georgia, serif',
                    }}>
                        signal.eo
                    </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {user && (
                        <>
                            <div style={{ fontSize: '15px', color: '#6b7280' }}>
                                {user.firstName} {user.lastName}
                            </div>
                            {showLogout && (
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '15px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#dc2626'}
                                    onMouseOut={(e) => e.target.style.color = '#ef4444'}
                                >
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
