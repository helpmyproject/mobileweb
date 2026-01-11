<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Photo Gallery - 663380381-5 นายณัฐดนัย ชาวไทย
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="addNewToGallery()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { camera } from 'ionicons/icons';
import { 
  IonPage, IonHeader, IonFab, IonFabButton, IonIcon, 
  IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonImg, isPlatform 
} from '@ionic/vue';

// Capacitor Plugins
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// --- Interfaces & Constants ---
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';
const photos = ref<UserPhoto[]>([]);

// --- Functions ---

/**
 * ฟังก์ชันแปลงไฟล์เป็น Base64 (ใช้เฉพาะบน Web)
 */
const convertBlobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

/**
 * ฟังก์ชันบันทึกรูปภาพ (รองรับ Hybrid)
 */
const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
  let base64Data: string | Blob;

  // ตรวจสอบว่าเป็น Mobile (hybrid) หรือไม่
  if (isPlatform('hybrid')) {
    const readFile = await Filesystem.readFile({
      path: photo.path!,
    });
    base64Data = readFile.data;
  } else {
    // สำหรับ Web: ต้อง fetch และแปลงเป็น Base64
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    base64Data = (await convertBlobToBase64(blob)) as string;
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  });

  if (isPlatform('hybrid')) {
    // สำหรับ Mobile: แปลงไฟล์ path (file://) ให้เป็น URL ที่ WebView เข้าถึงได้
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    };
  } else {
    // สำหรับ Web: ใช้ webPath แสดงผลได้เลย
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }
};

/**
 * ฟังก์ชันโหลดรูปภาพ (รองรับ Hybrid)
 */
const loadSaved = async () => {
  const photoList = await Preferences.get({ key: PHOTO_STORAGE });
  const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

  // ถ้าเป็นบน Web: ต้องอ่านไฟล์จาก Filesystem ออกมาเป็น Base64 เพื่อแสดงผล
  if (!isPlatform('hybrid')) {
    for (const photo of photosInPreferences) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  photos.value = photosInPreferences;
};

/**
 * ฟังก์ชันถ่ายรูป
 */
const addNewToGallery = async () => {
  try {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    photos.value = [savedImageFile, ...photos.value];
  } catch (error) {
    console.error('Error adding photo:', error);
  }
};

/**
 * บันทึกรายชื่อรูปลงหน่วยความจำ
 */
const cachePhotos = () => {
  Preferences.set({
    key: PHOTO_STORAGE,
    value: JSON.stringify(photos.value),
  });
};

// --- Lifecycle & Watcher ---
onMounted(loadSaved);
watch(photos, cachePhotos);
</script>