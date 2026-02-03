import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonTextarea, IonAlert } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import roadIssueService from '../services/roadIssueService';
import authService from '../services/authService';
import './ReportIssue.css';

const ReportIssuePage: React.FC = () => {
  const history = useHistory();
  const currentUser = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    surfaceArea: 0,
    budget: 0,
    company: '',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setFormData(prev => ({
        ...prev,
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      }));
    } catch (err) {
      setError('Impossible d\'obtenir la localisation');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.latitude || !formData.longitude) {
      setError('Veuillez remplir les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await roadIssueService.createIssue(currentUser?.id, formData);
      setSuccess(true);
      setTimeout(() => {
        history.push('/home');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Signaler un problème</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="report-form">
          <IonInput
            label="Titre *"
            type="text"
            value={formData.title}
            onIonChange={(e) => setFormData({ ...formData, title: e.detail.value || '' })}
            placeholder="Ex: Nid de poule rue Jean"
          />

          <IonTextarea
            label="Description"
            value={formData.description}
            onIonChange={(e) => setFormData({ ...formData, description: e.detail.value || '' })}
            placeholder="Décrivez le problème"
          />

          <div className="location-section">
            <p>Localisation: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</p>
            <IonButton onClick={getLocation} expand="block">
              📍 Obtenir ma position
            </IonButton>
          </div>

          <IonInput
            label="Surface (m²)"
            type="number"
            value={formData.surfaceArea}
            onIonChange={(e) => setFormData({ ...formData, surfaceArea: parseFloat(e.detail.value || '0') })}
          />

          <IonInput
            label="Budget (Ar)"
            type="number"
            value={formData.budget}
            onIonChange={(e) => setFormData({ ...formData, budget: parseFloat(e.detail.value || '0') })}
          />

          <IonInput
            label="Entreprise"
            type="text"
            value={formData.company}
            onIonChange={(e) => setFormData({ ...formData, company: e.detail.value || '' })}
          />

          <IonButton 
            expand="block" 
            color="success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Envoi...' : '✓ Soumettre le signalement'}
          </IonButton>

          <IonButton 
            expand="block" 
            fill="outline"
            onClick={() => history.goBack()}
          >
            Annuler
          </IonButton>
        </div>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError('')}
          header="Erreur"
          message={error}
          buttons={['OK']}
        />

        <IonAlert
          isOpen={success}
          header="Succès"
          message="Signalement créé avec succès!"
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReportIssuePage;
