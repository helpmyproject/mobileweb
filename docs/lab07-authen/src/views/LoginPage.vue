<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        
        <ion-list lines="full">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="password" type="password"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="loginWithEmail" class="ion-margin-top">
            Login with Email
          </ion-button>
        </ion-list>

        <div class="divider">OR</div>

        <ion-button expand="block" color="danger" @click="loginWithGoogle">
          <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
          Login with Google
        </ion-button>

        <div class="divider">OR</div>

        <ion-list lines="full">
          <ion-item>
            <ion-label position="floating">Phone (+66...)</ion-label>
            <ion-input v-model="phoneNumber" type="tel" placeholder="+66812345678"></ion-input>
          </ion-item>
          
          <ion-button expand="block" color="tertiary" @click="startPhoneLogin" v-if="!verificationId">
            Send OTP
          </ion-button>

          <div v-if="verificationId">
            <ion-item>
              <ion-label position="floating">OTP Code</ion-label>
              <ion-input v-model="otpCode" type="text"></ion-input>
            </ion-item>
            <ion-button expand="block" color="success" @click="confirmPhoneCode">
              Confirm OTP
            </ion-button>
          </div>
        </ion-list>

        <div id="recaptcha-container"></div>

        <ion-text color="danger" v-if="errorMessage">
          <p class="ion-text-center">{{ errorMessage }}</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonList, IonText, IonIcon 
} from '@ionic/vue';
import { logoGoogle } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service'; // แก้ไข Path ให้ถูกต้อง

const router = useRouter();
const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const otpCode = ref('');
const verificationId = ref<string | null>(null);
const errorMessage = ref('');

// ฟังก์ชันช่วยย้ายหน้าเมื่อ login สำเร็จ
const handleSuccess = () => {
  errorMessage.value = '';
  router.push('/tabs/tab1'); // ไปที่หน้า Tab 1 ตามที่ Lab กำหนด
};

async function loginWithEmail() {
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    handleSuccess();
  } catch (err: any) {
    errorMessage.value = err.message || 'Login failed';
  }
}

async function loginWithGoogle() {
  try {
    await authService.loginWithGoogle();
    handleSuccess();
  } catch (err: any) {
    errorMessage.value = err.message || 'Login failed';
  }
}

async function startPhoneLogin() {
  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phoneNumber.value,
    });
    verificationId.value = result.verificationId;
    errorMessage.value = '';
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to send OTP';
  }
}

async function confirmPhoneCode() {
  try {
    await authService.confirmPhoneCode({
      verificationId: verificationId.value!,
      verificationCode: otpCode.value,
    });
    handleSuccess();
  } catch (err: any) {
    errorMessage.value = err.message || 'OTP confirmation failed';
  }
}
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 20px;
}
.divider {
  text-align: center;
  margin: 20px 0;
  color: #888;
  font-weight: bold;
}
#recaptcha-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>