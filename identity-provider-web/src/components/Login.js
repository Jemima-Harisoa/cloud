import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/modern-design.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                const user = response.data.user;
                if (user.role === 'MANAGER') {
                    navigate('/manager-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            } else {
                setError('Erreur: Token non reçu');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '16px' }}>
            <div className="form-container">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#10b981',
                        letterSpacing: '-0.5px',
                        fontFamily: 'Georgia, serif',
                        marginBottom: '12px',
                    }}>
                        signal.eo
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Suivi des travaux routiers</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se Connecter'}
                    </button>
                </form>

                <div className="form-divider">
                    <span>ou</span>
                </div>

                <Link 
                    to="/register"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    S'Inscrire
                </Link>

                <div className="form-footer">
                    <p>
                        <Link to="/visitor">Accéder en tant que visiteur</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
