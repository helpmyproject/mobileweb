<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- แสดงข้อมูลผู้ใช้ -->
      <div class="ion-padding">
        <p><strong>UID:</strong> {{ user?.uid }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Phone:</strong> {{ user?.phoneNumber }}</p>
        <p><strong>Name:</strong> {{ user?.displayName }}</p>
        <p><strong>Photo URL:</strong> {{ user?.photoUrl }}</p>
      </div>

      <!-- ถ้ายังอยากเก็บ ExploreContainer -->
      <ExploreContainer name="Tab 1 page" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { authService } from '@/auth/auth-service';

// type ของ AuthUser ตามที่คุณส่งมา
type AuthUser = {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
};

const user = ref<AuthUser | null>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser() as AuthUser | null;
});
</script>