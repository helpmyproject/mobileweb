import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  // โหลดรูปที่เคยบันทึกไว้
  useEffect(() => {
    const loadSavedPhotos = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const savedPhotos = value ? (JSON.parse(value) as UserPhoto[]) : [];

      // แปลงไฟล์สำหรับแสดงบน web
      for (const photo of savedPhotos) {
        try {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        } catch (err) {
          console.log('Error loading file', err);
        }
      }

      setPhotos(savedPhotos);
    };

    loadSavedPhotos();
  }, []);

  // เพิ่มรูปใหม่
  const addNewToGallery = async () => {
    try {
      // ====== Mobile (Android / iOS) ======
      if (Capacitor.isNativePlatform()) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 100,
        });

        const fileName = Date.now() + '.jpeg';
        const savedImage = await savePicture(capturedPhoto, fileName);

        const newPhotos = [savedImage, ...photos];
        setPhotos(newPhotos);
        await Preferences.set({
          key: PHOTO_STORAGE,
          value: JSON.stringify(newPhotos),
        });
      }
      // ====== Web (Browser) ======
      else {
        openWebCamera();
      }
    } catch (err) {
      console.log('Error taking photo', err);
    }
  };

  // ใช้กล้อง / เลือกรูปบนเว็บ
  const openWebCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // ขอ permission กล้อง
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const base64 = (await convertBlobToBase64(file)) as string;

      const newPhoto: UserPhoto = {
        filepath: Date.now() + '.jpeg',
        webviewPath: base64,
      };

      const newPhotos = [newPhoto, ...photos];
      setPhotos(newPhotos);
      await Preferences.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(newPhotos),
      });
    };

    input.click(); // browser จะถาม permission กล้องตรงนี้
  };

  // บันทึกรูป (Mobile)
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await convertBlobToBase64(blob)) as string;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: `data:image/jpeg;base64,${base64Data}`,
    };
  };

  // แปลง Blob → Base64
  const convertBlobToBase64 = (blob: Blob) =>
    new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result!);
      reader.readAsDataURL(blob);
    });

  return {
    photos,
    addNewToGallery,
  };
}
