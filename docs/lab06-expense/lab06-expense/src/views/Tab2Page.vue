<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="ชื่อรายการ" label-placement="stacked" v-model="title" placeholder="ระบุชื่อรายการ"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input label="จำนวนเงิน" label-placement="stacked" type="number" v-model="amount" placeholder="0.00"></ion-input>
      </ion-item>

      <ion-item>
        <ion-select label="ประเภท" label-placement="stacked" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input label="หมวดหมู่" label-placement="stacked" v-model="category" placeholder="เช่น อาหาร, เดินทาง"></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea label="หมายเหตุ" label-placement="stacked" v-model="note" placeholder="รายละเอียดเพิ่มเติม"></ion-textarea>
      </ion-item>

      <div class="ion-padding-top">
        <ion-button expand="block" @click="saveExpense">
          บันทึกข้อมูล
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton, IonItem 
} from '@ionic/vue'; // ต้อง Import Components ของ Ionic มาให้ครบ
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

// ประกาศตัวแปร reactive สำหรับเก็บค่าจากฟอร์ม
const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

// ฟังก์ชันบันทึกข้อมูลลง Firestore
const saveExpense = async () => {
  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date()
    });
    
    console.log("บันทึกสำเร็จ!");
    // ล้างค่าในฟอร์มหลังบันทึก (ทางเลือก)
    title.value = "";
    amount.value = 0;
    
    // ย้ายไปหน้าแสดงรายการ (Tab 1 หรือตามที่ตั้งค่าไว้)
    router.push("/tabs/tab1"); 
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
</script>