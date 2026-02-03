<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Signaler un problème</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="report-form">
        <ion-input
          label="Titre *"
          label-placement="floating"
          fill="outline"
          v-model="formData.title"
          placeholder="Ex: Nid de poule rue Jean"
        ></ion-input>

        <div class="ion-margin-top">
          <ion-textarea
            label="Description"
            label-placement="floating"
            fill="outline"
            v-model="formData.description"
            placeholder="Décrivez le problème"
            :rows="4"
          ></ion-textarea>
        </div>

        <div class="location-section ion-margin-top ion-margin-bottom">
          <p v-if="formData.latitude">
            Localisation: {{ formData.latitude.toFixed(4) }}, {{ formData.longitude.toFixed(4) }}
          </p>
          <p v-else>Localisation non définie</p>
          <ion-button @click="getLocation" expand="block" fill="outline">
            📍 Obtenir ma position
          </ion-button>
        </div>

        <ion-input
          label="Surface (m²)"
          label-placement="floating"
          fill="outline"
          type="number"
          v-model="formData.surfaceArea"
        ></ion-input>

        <div class="ion-margin-top">
          <ion-input
            label="Budget (Ar)"
            label-placement="floating"
            fill="outline"
            type="number"
            v-model="formData.budget"
          ></ion-input>
        </div>

        <div class="ion-margin-top">
          <ion-input
            label="Entreprise"
            label-placement="floating"
            fill="outline"
            v-model="formData.company"
          ></ion-input>
        </div>

        <div class="ion-margin-top">
          <ion-button 
            expand="block" 
            color="success"
            @click="handleSubmit"
            :disabled="loading"
          >
            {{ loading ? 'Envoi...' : '✓ Soumettre le signalement' }}
          </ion-button>
        </div>

        <ion-button 
          expand="block" 
          fill="clear"
          @click="goBack"
        >
          Annuler
        </ion-button>
      </div>

      <ion-alert
        :is-open="!!error"
        header="Erreur"
        :message="error"
        :buttons="['OK']"
        @didDismiss="error = ''"
      ></ion-alert>

      <ion-alert
        :is-open="success"
        header="Succès"
        message="Signalement créé avec succès!"
        :buttons="['OK']"
        @didDismiss="success = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonTextarea, IonButton, IonAlert 
} from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import roadIssueService from '@/services/roadIssueService';
import authService from '@/services/authService';

const router = useRouter();
const currentUser = authService.getCurrentUser();

const formData = reactive({
  title: '',
  description: '',
  latitude: 0,
  longitude: 0,
  surfaceArea: 0,
  budget: 0,
  company: '',
  priority: 'MEDIUM'
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

const getLocation = async () => {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    formData.latitude = coordinates.coords.latitude;
    formData.longitude = coordinates.coords.longitude;
  } catch (err) {
    console.error(err);
    error.value = "Impossible d'obtenir la localisation";
  }
};

const handleSubmit = async () => {
  if (!formData.title || !formData.latitude || !formData.longitude) {
    error.value = 'Veuillez remplir les champs obligatoires (Titre et Localisation)';
    return;
  }

  loading.value = true;
  try {
    await roadIssueService.createIssue(currentUser?.id, formData);
    success.value = true;
    setTimeout(() => {
      router.push('/map'); // Changed to /map as /home is usually the map in this app
    }, 2000);
  } catch (err: any) {
    console.error(err);
    error.value = err.response?.data?.message || 'Erreur lors de la création';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.report-form {
  max-width: 600px;
  margin: 0 auto;
}
.location-section {
  text-align: center;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
}
</style>
