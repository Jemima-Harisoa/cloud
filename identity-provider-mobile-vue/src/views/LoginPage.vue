<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="login-container">
        <h1>Signalement Travaux Routiers</h1>
        <p>Antananarivo</p>

        <div class="login-form">
          <ion-item>
            <ion-input
              label="Email"
              label-placement="floating"
              fill="outline"
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              @keyup.enter="handleLogin"
            ></ion-input>
          </ion-item>

          <ion-item class="ion-margin-top">
            <ion-input
              label="Mot de passe"
              label-placement="floating"
              fill="outline"
              v-model="password"
              type="password"
              placeholder="••••••••"
              @keyup.enter="handleLogin"
            ></ion-input>
          </ion-item>

          <ion-text color="danger" v-if="error">
            <p class="error-message">{{ error }}</p>
          </ion-text>

          <div class="ion-margin-top">
            <ion-button 
              expand="block" 
              @click.prevent="handleLogin"
              :disabled="loading"
            >
              {{ loading ? 'Connexion...' : 'Connexion' }}
            </ion-button>
          </div>
        </div>

        <div class="ion-text-center ion-margin-top">
          <ion-button 
            fill="clear" 
            @click="goToRegister"
          >
            Créer un compte
          </ion-button>
          <br>
          <ion-button 
            fill="clear" 
            color="medium"
            @click="continueAsVisitor"
          >
            Continuer en tant que visiteur
          </ion-button>
        </div>

        <ion-loading :is-open="loading" message="Connexion en cours..."></ion-loading>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonInput, 
  IonButton,
  IonItem,
  IonText,
  IonLoading,
  toastController,
  alertController
} from '@ionic/vue';
import authService from '@/services/authService';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async (event?: Event) => {
  // Prevent any form submission or page refresh
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (!email.value || !password.value) {
    const toast = await toastController.create({
      message: 'Veuillez remplir tous les champs',
      duration: 4000,
      color: 'warning',
      position: 'top'
    });
    await toast.present();
    return;
  }

  loading.value = true;

  try {
    await authService.login(email.value, password.value);
    
    // Clear error only on success
    error.value = '';
    
    const toast = await toastController.create({
      message: 'Connexion réussie',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    // Using window.location.href forces a full refresh and avoids state issues
    window.location.href = '/map';
  } catch (err: any) {
    console.error('Login error:', err);
    console.log('Error response:', err.response);
    console.log('Error response data:', err.response?.data);
    console.log('Error message:', err.response?.data?.message);
    
    const errorMessage = err.response?.data?.message || err.message || 'Identifiants incorrects ou erreur serveur';
    
    // Show error only as inline text below password field
    error.value = errorMessage;
    loading.value = false;
  } finally {
    // Loading state is managed in catch block
  }
};

const goToRegister = () => {
  router.push('/register');
};

const continueAsVisitor = () => {
  localStorage.removeItem('token'); // Ensure no old tokens are present
  localStorage.removeItem('user');
  window.location.href = '/map';
};

</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.login-container h1 {
  margin-bottom: 0.5rem;
  color: var(--ion-color-primary);
}

.error-message {
  margin-top: 10px;
  font-size: 0.9em;
}
</style>