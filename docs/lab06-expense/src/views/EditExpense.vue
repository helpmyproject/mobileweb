<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="ชื่อรายการ" label-placement="stacked" v-model="expense.title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="จำนวนเงิน" label-placement="stacked" type="number" v-model="expense.amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-select label="ประเภท" label-placement="stacked" v-model="expense.type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-button expand="block" color="warning" @click="updateExpense" class="ion-margin-top">
        อัปเดตข้อมูล
      </ion-button>

      <ion-button expand="block" color="danger" @click="confirmDelete" class="ion-margin-top">
        ลบรายการนี้
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonSelect, 
  IonSelectOption, IonButton, IonItem, IonButtons, IonBackButton, alertController 
} from '@ionic/vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const expense = ref({ title: '', amount: 0, type: 'expense' });

// ดึงข้อมูลเดิมมาโชว์
onMounted(async () => {
  const docRef = doc(db, "expenses", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    expense.value = docSnap.data() as any;
  }
});

// ฟังก์ชันอัปเดต (ขั้นตอนที่ 5)
const updateExpense = async () => {
  const docRef = doc(db, "expenses", id);
  await updateDoc(docRef, {
    title: expense.value.title,
    amount: Number(expense.value.amount),
    type: expense.value.type
  });
  router.push('/tabs/tab1');
};

// ฟังก์ชันลบข้อมูลพร้อมตัวยืนยัน (ขั้นตอนที่ 6)
const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ?',
    message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      {
        text: 'ลบ',
        handler: async () => {
          await deleteDoc(doc(db, "expenses", id));
          router.push('/tabs/tab1');
        }
      }
    ]
  });
  await alert.present();
};
</script>