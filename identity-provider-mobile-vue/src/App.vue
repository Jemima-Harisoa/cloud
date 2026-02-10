<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>
@import './theme/variables.css';

/* Global font application */
body,
html,
ion-app,
ion-content,
ion-header,
ion-toolbar,
ion-title,
ion-button,
ion-input,
ion-label,
ion-item,
ion-list,
ion-card,
ion-card-header,
ion-card-title,
ion-card-content,
ion-text,
p,
h1,
h2,
h3,
h4,
h5,
h6,
span,
div {
  font-family: Georgia, serif !important;
}

/* Ensure green theme is applied */
ion-app {
  --ion-color-primary: #10B981;
}
</style>

