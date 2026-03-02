<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="dark">
        <ion-title style="color: #3880ff;">ARM WORKOUT PRO</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dark-content ion-padding">
      <div class="student-card-dark">
        <div class="info-label">STUDENT ID: 663380381-5</div>
        <div class="info-name">นายณัฐดนัย ชาวไทย</div>
      </div>

      <div class="counter-section">
        <div class="glow-circle" :class="{ 'is-running': state?.status === 'RUNNING' }">
          <div class="inner-circle">
            <span class="rep-label">REPS</span>
            <span class="rep-count">{{ state?.repDisplay ?? 0 }}</span>
          </div>
        </div>
        <div class="status-indicator">
          <div class="dot" :class="state?.status === 'RUNNING' ? 'dot-active' : ''"></div>
          <span>{{ state?.status }}</span>
        </div>
      </div>

      <div class="msg-card" :class="getMessageClass(state?.stats.lastMessage)">
        {{ state?.stats.lastMessage || 'READY TO START' }}
      </div>

      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <div class="stat-glass ok-border">
              <div class="stat-n">{{ state?.stats.repsOk ?? 0 }}</div>
              <div class="stat-t">CORRECT</div>
            </div>
          </ion-col>
          <ion-col size="6">
            <div class="stat-glass bad-border">
              <div class="stat-n">{{ state?.stats.repsBad ?? 0 }}</div>
              <div class="stat-t">FAILED</div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="ion-margin-top ion-padding-horizontal">
        <ion-button v-if="state?.status !== 'RUNNING'" expand="block" class="btn-blue" @click="handleStart">
          <ion-icon slot="start" :icon="playOutline"></ion-icon>
          START WORKOUT
        </ion-button>
        <ion-button v-else expand="block" color="danger" fill="outline" class="btn-stop" @click="handleStop">
          <ion-icon slot="start" :icon="stopOutline"></ion-icon>
          STOP
        </ion-button>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border dark-footer">
      <div class="footer-text">LAB 09 - SENSORS & ACCELEROMETER</div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { playOutline, stopOutline } from 'ionicons/icons';
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptic = new HapticsService();

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;
    if (s.stats.lastMessage) {
      tts.speak(s.stats.lastMessage);
      if (s.stats.lastMessage === "ดีมาก" || !isNaN(Number(s.stats.lastMessage))) {
        haptic.success();
      } else if (s.status === 'RUNNING') {
        haptic.warning();
      }
    }
  });
});

async function handleStart() {
  await tts.speak("เริ่มกายบริหารแขน ถือโทรศัพท์แนวตั้ง แล้วยกขึ้นลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function handleStop() {
  await motion.stop();
  engine.stop();
  const finalScore = state.value?.stats.score ?? 0;
  await tts.speak(`จบการทำงาน คะแนนรวมของคุณคือ ${finalScore} คะแนน`);
}

onUnmounted(() => {
  motion.stop();
  engine.stop();
});

const getMessageClass = (msg?: string) => {
  if (!msg) return '';
  if (msg === 'ดีมาก' || !isNaN(Number(msg))) return 'msg-success';
  return 'msg-error';
};
</script>

<style scoped>
/* พื้นหลังดำสนิท */
.dark-content {
  --background: #000000;
  color: white;
}

/* การ์ดชื่อนักศึกษา */
.student-card-dark {
  background: #1a1a1a;
  border-left: 4px solid #3880ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.info-label { color: #3880ff; font-size: 0.7rem; font-weight: bold; }
.info-name { font-size: 1.1rem; font-weight: bold; }

/* วงกลมคะแนนสีน้ำเงินเรืองแสง */
.counter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.glow-circle {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1a1a1a;
  transition: 0.5s;
}

.is-running {
  border: 2px solid #3880ff;
  box-shadow: 0 0 30px rgba(56, 128, 255, 0.4);
}

.inner-circle {
  text-align: center;
}

.rep-label { display: block; color: #3880ff; font-weight: bold; }
.rep-count { font-size: 6rem; font-weight: 800; color: #fff; line-height: 1; }

/* สถานะจุดไฟ */
.status-indicator { display: flex; align-items: center; gap: 8px; margin-top: 15px; font-size: 0.8rem; }
.dot { width: 8px; height: 8px; background: #333; border-radius: 50%; }
.dot-active { background: #2dd36f; box-shadow: 0 0 10px #2dd36f; }

/* การ์ดข้อความ */
.msg-card {
  background: #1a1a1a;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.3rem;
  margin: 15px 0;
  border: 1px solid #333;
}
.msg-success { color: #2dd36f; border-color: #2dd36f; }
.msg-error { color: #eb445a; border-color: #eb445a; }

/* สถิติแบบใส */
.stat-glass {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid #333;
}
.ok-border { border-bottom: 3px solid #2dd36f; }
.bad-border { border-bottom: 3px solid #eb445a; }
.stat-n { font-size: 1.8rem; font-weight: bold; }
.stat-t { font-size: 0.7rem; color: #888; }

/* ปุ่มน้ำเงิน */
.btn-blue {
  --background: #3880ff;
  --color: white;
  margin-bottom: 10px;
  font-weight: bold;
}

.dark-footer {
  --background: #000;
  color: #444;
  font-size: 0.7rem;
  padding: 10px;
}
</style>