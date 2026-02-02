import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Header from './Header';
import '../styles/modern-design.css';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser) {
                navigate('/login');
                return;
            }

            const response = await authService.getUser(storedUser.id);
            setUser(response.data);
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                phoneNumber: response.data.phoneNumber || '',
            });
        } catch (err) {
            setError('Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            await authService.updateUser(storedUser.id, formData);
            setSuccess('Profil mis à jour avec succès');
            setEditing(false);
            loadUserData();
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <>
            <Header user={user} showLogout={true} />
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>
                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>Mon Profil</h2>

                    {success && <div className="alert alert-success" style={{ marginBottom: '16px' }}>{success}</div>}
                    {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

                {!editing ? (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.email}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Prénom</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.firstName || 'Non renseigné'}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nom</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.lastName || 'Non renseigné'}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Téléphone</p>
                            <p style={{ fontSize: '1.1rem' }}>{user?.phoneNumber || 'Non renseigné'}</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Statut</p>
                            <p style={{ fontSize: '1.1rem' }}>
                                {user?.isBlocked ? (
                                    <span style={{ color: 'var(--danger-color)' }}>Bloqué</span>
                                ) : (
                                    <span style={{ color: 'var(--secondary-color)' }}>Actif</span>
                                )}
                            </p>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => setEditing(true)}
                        >
                            Modifier le profil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-input"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditing(false)}
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
                </div>
            </div>
        </>
    );
}

export default Profile;
