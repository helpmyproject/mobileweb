<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <p v-if="photos.length === 0">ยังไม่มีรูปภาพ</p>

      <ion-grid v-else>
        <ion-row>
          <ion-col
            size="6"
            v-for="(photo, index) in photos"
            :key="index"
          >
            <ion-img :src="photo"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- ปุ่มถ่ายรูป -->
      <ion-button expand="block" @click="takePhoto">
        ถ่ายรูป
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// เพิ่ม import ของ Capacitor Camera
import { Camera, CameraResultType } from '@capacitor/camera'

const photos = ref<string[]>([])

// ฟังก์ชันเรียกกล้อง
async function takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri
    })

    if (image.webPath) {
      photos.value.push(image.webPath)
    }
  } catch (error) {
    console.error('Error taking photo:', error)
  }
}
</script>
