import { TextToSpeech } from "@capacitor-community/text-to-speech";

export class TtsService {
  async speak(text: string) {
    await TextToSpeech.speak({
      text: text,
      lang: "th-TH",
      rate: 1.0, // ความเร็วเสียง [cite: 168]
    });
  }

  async stop() {
    await TextToSpeech.stop();
  }
}