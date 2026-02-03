<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Carte - Travaux Routiers</ion-title>
        <ion-button slot="end" fill="clear" @click="handleLogout">
          <ion-icon :icon="logOutOutline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="mobile-map-container">
        <!-- Controls -->
        <div class="map-controls ion-padding">
          <ion-segment v-model="viewMode">
            <ion-segment-button value="all">
              <ion-label>Tous</ion-label>
            </ion-segment-button>
            <ion-segment-button value="mine">
              <ion-label>Mes signalements</ion-label>
            </ion-segment-button>
            <ion-segment-button v-if="currentUser?.role === 'MANAGER'" value="manager">
              <ion-label>Manager</ion-label>
            </ion-segment-button>
          </ion-segment>

          <div v-if="viewMode === 'all'" class="ion-margin-top">
            <ion-item>
              <ion-select v-model="filter" label="Filtrer par statut" label-placement="floating">
                <ion-select-option value="all">Tous</ion-select-option>
                <ion-select-option value="NEW">Nouveaux</ion-select-option>
                <ion-select-option value="IN_PROGRESS">En cours</ion-select-option>
                <ion-select-option value="COMPLETED">Terminés</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div v-if="viewMode === 'mine'" class="ion-margin-top">
             <ion-button expand="block" color="success" @click="goToReport">
               ➕ Signaler un problème
             </ion-button>
          </div>

          <div v-if="viewMode === 'manager'" class="ion-margin-top">
             <ion-list>
               <ion-list-header>
                 <ion-label>Utilisateurs Bloqués</ion-label>
               </ion-list-header>
               <ion-item v-if="blockedUsers.length === 0">
                 <ion-label>Aucun utilisateur bloqué</ion-label>
               </ion-item>
               <ion-item v-for="user in blockedUsers" :key="user.id">
                 <ion-label>
                   <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                   <p>{{ user.email }}</p>
                 </ion-label>
                 <ion-button slot="end" color="success" @click="handleUnblock(user.id)">
                   Débloquer
                 </ion-button>
               </ion-item>
             </ion-list>
          </div>
        </div>

        <!-- Map -->
        <div v-show="viewMode !== 'manager'" id="map" style="height: 60vh; width: 100%;"></div>

        <!-- List (Mobile view) -->
        <div v-show="viewMode !== 'manager'" class="issues-list-mobile ion-padding">
          <h3>{{ viewMode === 'mine' ? 'Mes signalements' : 'Signalements' }} ({{ issues.length }})</h3>
          <ion-list>
            <ion-item v-for="issue in issues" :key="issue.id" lines="none" class="issue-item">
              <ion-label>
                <h2>{{ issue.description }}</h2> <!-- Backend uses description as title usually -->
                <p>
                  <ion-badge :color="getStatusColor(issue.status)">{{ issue.status }}</ion-badge>
                </p>
                <p v-if="issue.surfaceM2">Surface: {{ issue.surfaceM2 }} m²</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSegment, IonSegmentButton, IonLabel, 
  IonButton, IonIcon, IonItem, IonSelect, IonSelectOption,
  IonList, IonBadge, IonListHeader, toastController
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import roadIssueService from '@/services/roadIssueService';
import authService from '@/services/authService';

const router = useRouter();
const currentUser = authService.getCurrentUser();
const issues = ref<any[]>([]);
const blockedUsers = ref<any[]>([]);
const viewMode = ref('all');
const filter = ref('all');
let map: L.Map | null = null;
let markers: L.LayerGroup | null = null;

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerIcon = (status: string) => {
    const colors: any = {
        'NEW': '#ef4444', // Red
        'IN_PROGRESS': '#f59e0b', // Orange
        'COMPLETED': '#10b981' // Green
    };
    const color = colors[status] || '#3b82f6';
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [15, 15],
        iconAnchor: [7, 7]
    });
};

const loadBlockedUsers = async () => {
  if (currentUser?.role === 'MANAGER') {
    try {
      blockedUsers.value = await authService.getBlockedUsers();
    } catch (e) {
      console.error(e);
    }
  }
};

const handleUnblock = async (userId: number) => {
  try {
    await authService.unblockUser(userId);
    const toast = await toastController.create({
      message: 'Utilisateur débloqué',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    loadBlockedUsers();
  } catch (e) {
    console.error(e);
  }
};

const loadIssues = async () => {
  try {
    let data;

    if (viewMode.value === 'mine' && currentUser?.id) {
       data = await roadIssueService.getIssuesByReporter(currentUser.id);
    } else if (filter.value !== 'all') {
       data = await roadIssueService.getIssuesByStatus(filter.value);
    } else {
       data = await roadIssueService.getAllIssues();
    }
    issues.value = data;
    updateMarkers();
  } catch (e) {
    console.error(e);
  }
};

const updateMarkers = () => {
  if (!map) return;
  if (markers) map.removeLayer(markers);

  markers = L.layerGroup().addTo(map);

  issues.value.forEach(issue => {
    if (issue.latitude && issue.longitude) {
      L.marker([issue.latitude, issue.longitude], {
        icon: getMarkerIcon(issue.status)
      })
      .bindPopup(`
        <b>${issue.status}</b><br>
        ${issue.description}
      `)
      .addTo(markers!);
    }
  });
};

const handleLogout = () => {
  authService.logout();
  router.replace('/login');
};

const goToReport = () => {
    router.push('/report-issue');
};

const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'danger';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      default: return 'medium';
    }
};

onMounted(() => {
  map = L.map('map').setView([-18.8792, 47.5079], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  
  loadIssues();
});

watch([viewMode, filter], () => {
  loadIssues();
});
</script>

<style scoped>
.map-controls {
  background: white;
  border-bottom: 1px solid #ddd;
}
.issue-item {
  border-bottom: 1px solid #eee;
  --padding-start: 0;
}
</style>