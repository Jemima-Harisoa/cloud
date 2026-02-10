<template>
  <div class="scroll-buttons" v-if="isVisible">
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="scrollToTop" size="small" class="scroll-btn top-btn">
        <ion-icon :icon="chevronUpOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-button @click="scrollToBottom" size="small" class="scroll-btn bottom-btn ion-margin-top">
        <ion-icon :icon="chevronDownOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </div>
</template>

<script setup lang="ts">
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isVisible = computed(() => route.path !== '/login');

const scrollToTop = () => {
  const content = document.querySelector('ion-content');
  if (content) {
    (content as any).scrollToTop(500);
  }
};

const scrollToBottom = () => {
  const content = document.querySelector('ion-content');
  if (content) {
    (content as any).scrollToBottom(500);
  }
};
</script>

<style scoped>
.scroll-buttons {
  position: fixed;
  bottom: 80px;
  right: 15px;
  z-index: 999;
}

.scroll-btn {
  --background: #10B981;
  --background-activated: #059669;
  --color: white;
  margin-top: 10px;
}

.top-btn {
  margin-bottom: 5px;
}
</style>
