import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonAlert } from '@ionic/react';
import './Login.css';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.user.role === 'MANAGER') {
        history.push('/manager-dashboard');
      } else {
        history.push('/home');
      }
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
          <h1>Signalement Routier</h1>
          <p>Antananarivo</p>

          <div className="login-form">
            <IonInput
              label="Email"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value || '')}
              placeholder="votre@email.com"
            />
            <IonInput
              label="Mot de passe"
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value || '')}
              placeholder="••••••••"
            />

            <IonButton 
              expand="block" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </IonButton>

            <div className="divider">ou</div>

            <IonButton 
              expand="block" 
              fill="outline"
              onClick={() => history.push('/register')}
            >
              S'inscrire
            </IonButton>
          </div>
        </div>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError('')}
          header="Erreur"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
