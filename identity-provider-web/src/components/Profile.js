import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

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
        return <div className="spinner"></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="card-title">Mon Profil</h2>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

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

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;
