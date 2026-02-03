<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>รายการรายรับ-รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="summary-box income">
              <p>รายรับรวม</p>
              <h3>{{ totalIncome.toLocaleString() }}</h3>
            </div>
          </ion-col>
          <ion-col>
            <div class="summary-box expense">
              <p>รายจ่ายรวม</p>
              <h3>{{ totalExpense.toLocaleString() }}</h3>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list>
        <ion-item 
          v-for="item in expenses" 
          :key="item.id" 
          button 
          @click="router.push('/edit-expense/' + item.id)"
          :detail="true"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }}</p>
          </ion-label>
          <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'">
            {{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toLocaleString() }}
          </ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonNote, IonGrid, IonRow, IonCol 
} from "@ionic/vue";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const expenses = ref<any[]>([]);

onMounted(() => {
  // ดึงข้อมูล Realtime จาก Firestore
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  onSnapshot(q, (querySnapshot) => {
    const tempExpenses: any[] = [];
    querySnapshot.forEach((doc) => {
      tempExpenses.push({ id: doc.id, ...doc.data() });
    });
    expenses.value = tempExpenses;
  });
});

const totalIncome = computed(() => {
  return expenses.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
});

const totalExpense = computed(() => {
  return expenses.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
});
</script>

<style scoped>
.summary-box { text-align: center; padding: 10px; border-radius: 8px; color: white; }
.income { background-color: #2dd36f; }
.expense { background-color: #eb445a; }
</style>