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

        <ion-item>
          <ion-input
            label="Email"
            label-placement="floating"
            fill="outline"
            v-model="email"
            type="email"
            placeholder="votre@email.com"
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
          ></ion-input>
        </ion-item>

        <ion-text color="danger" v-if="error">
          <p class="error-message">{{ error }}</p>
        </ion-text>

        <div class="ion-margin-top">
          <ion-button 
            expand="block" 
            @click="handleLogin" 
            :disabled="loading"
          >
            {{ loading ? 'Connexion...' : 'Connexion' }}
          </ion-button>
        </div>

        <div class="ion-text-center ion-margin-top">
          <ion-button 
            fill="clear" 
            @click="goToRegister"
          >
            Créer un compte
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
  toastController
} from '@ionic/vue';
import authService from '@/services/authService';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authService.login(email.value, password.value);
    
    const toast = await toastController.create({
      message: 'Connexion réussie',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    router.replace('/map');
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'Identifiants incorrects ou erreur serveur';
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
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