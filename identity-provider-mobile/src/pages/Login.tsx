import React, { useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_BASE_URL = 'http://localhost:8080/api';

const Login: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            // Save token and user info
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.data.userId,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName
            }));

            // Navigate to map
            history.push('/map');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Connexion</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="login-container">
                    <div className="login-header">
                        <h1>Signalement Travaux Routiers</h1>
                        <p>Antananarivo</p>
                    </div>

                    {error && (
                        <IonText color="danger">
                            <p className="error-message">{error}</p>
                        </IonText>
                    )}

                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput
                            type="email"
                            value={email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Mot de passe</IonLabel>
                        <IonInput
                            type="password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        />
                    </IonItem>

                    <IonButton
                        expand="block"
                        onClick={handleLogin}
                        className="login-button"
                    >
                        Se connecter
                    </IonButton>

                    <IonButton
                        expand="block"
                        fill="clear"
                        onClick={() => history.push('/register')}
                    >
                        Créer un compte
                    </IonButton>

                    <IonLoading isOpen={loading} message="Connexion en cours..." />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
