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

          <!-- Dashboard Recap (Visible for all) -->
          <div v-if="viewMode !== 'manager'" class="dashboard-recap ion-margin-top">
            <ion-grid>
              <ion-row>
                <ion-col size="6">
                  <div class="stat-card">
                    <span class="stat-label">Points</span>
                    <span class="stat-value">{{ stats.totalIssues || 0 }}</span>
                  </div>
                </ion-col>
                <ion-col size="6">
                  <div class="stat-card">
                    <span class="stat-label">Surface</span>
                    <span class="stat-value">{{ stats.totalSurfaceM2?.toFixed(1) || 0 }} m²</span>
                  </div>
                </ion-col>
                <ion-col size="6">
                  <div class="stat-card">
                    <span class="stat-label">Budget</span>
                    <span class="stat-value">{{ (stats.totalBudget || 0).toLocaleString() }} Ar</span>
                  </div>
                </ion-col>
                <ion-col size="6">
                  <div class="stat-card">
                    <span class="stat-label">Avanc.</span>
                    <span class="stat-value">{{ stats.completionPercentage?.toFixed(1) || 0 }}%</span>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>

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
             <div class="ion-padding-horizontal">
               <ion-button expand="block" color="tertiary" @click="handleSync" :disabled="syncing">
                 <ion-icon slot="start" :icon="syncOutline"></ion-icon>
                 {{ syncing ? 'Synchronisation...' : 'Synchroniser avec Firebase' }}
               </ion-button>
             </div>
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
                <h2>{{ issue.title || 'Sans titre' }}</h2>
                <p v-if="issue.description">{{ issue.description }}</p>
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
  IonList, IonBadge, IonListHeader, IonGrid, IonRow, IonCol,
  toastController
} from '@ionic/vue';
import { logOutOutline, syncOutline } from 'ionicons/icons';
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
const syncing = ref(false);
const stats = ref<any>({
  totalIssues: 0,
  totalSurfaceM2: 0,
  totalBudget: 0,
  completionPercentage: 0
});
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
    fetchStats();
  } catch (e) {
    console.error(e);
  }
};

const fetchStats = async () => {
  try {
    stats.value = await roadIssueService.getStatistics();
  } catch (e) {
    console.error('Error fetching stats:', e);
  }
};

const handleSync = async () => {
  syncing.value = true;
  try {
    await roadIssueService.syncWithFirebase();
    const toast = await toastController.create({
      message: 'Synchronisation réussie avec Firebase',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    loadIssues();
  } catch (e) {
    const toast = await toastController.create({
      message: 'Erreur lors de la synchronisation',
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  } finally {
    syncing.value = false;
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
  if (viewMode.value === 'manager') {
    loadBlockedUsers();
  }
});
</script>

<style scoped>
.map-controls {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.dashboard-recap {
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f1f4f9 100%);
  border-radius: 10px;
  padding: 12px 4px;
  border: 1px solid #edf2f7;
  transition: transform 0.2s;
}

.stat-card:active {
  transform: scale(0.95);
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 700;
}

.issues-list-mobile {
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 10;
  min-height: 40vh;
}

.issue-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
  border-radius: 12px;
  background: #fff;
}

.issue-item h2 {
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.issue-item p {
  color: #4a5568;
  font-size: 0.9rem;
}

.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>