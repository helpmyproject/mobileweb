import type { AccelSample, WorkoutState } from "./types";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";
  private peak = 0;
  private valley = 0;
  private lastRepTime = 0;

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      lastMessage: ""
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.state.status = "RUNNING";
    this.state.repDisplay = 0;
    this.state.stats = { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0, lastMessage: "เริ่มได้!" };
    this.phase = "WAIT_UP";
    this.lastRepTime = Date.now(); // เริ่มนับเวลาตั้งแต่วินาทีที่กด Start [cite: 195, 223]
    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

    const y = sample.ay;
    const side = Math.abs(sample.ax) + Math.abs(sample.az);

    // ค่า Threshold แนะนำสำหรับทดสอบ (ปรับตามความเหมาะสมของอุปกรณ์) [cite: 247, 248, 249]
    const UP_TH = 2.0; 
    const DOWN_TH = -1.5;
    const MIN_ROM = 3.0;
    const MIN_MS = 700;
    const MAX_MS = 3500;

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
      }
    } else {
      this.valley = Math.min(this.valley, y);

      if (y < DOWN_TH) {
        const now = Date.now();
        const repMs = now - this.lastRepTime;
        this.lastRepTime = now;

        this.state.stats.repsTotal++;
        const rom = this.peak - this.valley;

        let ok = true;
        let msg = "ดีมาก";

        // ตรวจสอบเงื่อนไขตาม Algorithm แบบ Rule-based [cite: 46, 183]
        if (rom < MIN_ROM) {
          ok = false;
          msg = "ยกแขนต่ำเกินไป"; // [cite: 52, 271]
        } else if (repMs < MIN_MS) {
          ok = false;
          msg = "เร็วเกินไป"; // [cite: 52, 275]
        } else if (repMs > MAX_MS) {
          ok = false;
          msg = "ช้าเกินไป"; // [cite: 52, 281]
        } else if (side > 5) {
          ok = false;
          msg = "กรุณายกแนวตั้ง"; // [cite: 53, 284]
        }

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score++;
          msg = this.state.repDisplay.toString(); // ถ้าทำถูก ให้พูดเลขรอบ [cite: 44, 287]
        } else {
          this.state.stats.repsBad++;
        }

        this.state.stats.lastMessage = msg;
        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;
        this.emit();
      }
    }
  }
}