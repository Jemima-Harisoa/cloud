<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="register-container">
        <h1>Créer un compte</h1>

        <ion-item class="ion-margin-bottom">
          <ion-input label="Nom" label-placement="floating" v-model="formData.lastName" fill="outline"></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom">
          <ion-input label="Prénom" label-placement="floating" v-model="formData.firstName" fill="outline"></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom">
          <ion-input label="Email" label-placement="floating" type="email" v-model="formData.email" fill="outline"></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom">
          <ion-input label="Téléphone" label-placement="floating" type="tel" v-model="formData.phoneNumber" fill="outline"></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom">
          <ion-input label="Mot de passe" label-placement="floating" type="password" v-model="formData.password" fill="outline"></ion-input>
        </ion-item>

        <ion-text color="danger" v-if="error">
          <p class="error-message">{{ error }}</p>
        </ion-text>

        <ion-button expand="block" @click="handleRegister" :disabled="loading" class="ion-margin-top">
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </ion-button>

        <ion-button fill="clear" @click="goToLogin" class="ion-margin-top">
          Déjà un compte ? Se connecter
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonButton, IonItem, IonText, toastController 
} from '@ionic/vue';
import authService from '@/services/authService';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const formData = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: ''
});

const handleRegister = async () => {
  if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
    error.value = 'Veuillez remplir tous les champs obligatoires';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authService.register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phoneNumber || ''
    );
    
    const toast = await toastController.create({
      message: 'Compte créé avec succès',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    
    window.location.href = '/map';
  } catch (err: any) {
    console.error(err);
    error.value = err.response?.data?.message || "Erreur lors de l'inscription";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
}
</style>
