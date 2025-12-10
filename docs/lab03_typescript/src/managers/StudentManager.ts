import { Student } from "../models/Student.js";

export class StudentManager {
  private students: Student[] = [];

  constructor() {
    // โหลดข้อมูลทันทีเมื่อเริ่ม Class
    this.loadFromLocalStorage();
  }

  addStudent(student: Student): void {
    this.students.push(student);
    this.saveToLocalStorage();
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  findStudentByID(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  // --- จุดที่แก้ไข 1: ค้นหาจาก ชื่อจริง หรือ นามสกุล ---
  findStudentsByName(keyword: string): Student[] {
    // ใช้ || (OR) เพื่อบอกว่า เจอในชื่อหน้า หรือ เจอในนามสกุล ก็ให้นับว่าเจอ
    return this.students.filter(s =>
      s.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
      s.last_name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  findStudentsByMajor(major: string): Student[] {
    return this.students.filter(s =>
      s.major.toLowerCase().includes(major.toLowerCase())
    );
  }

  // --- จุดที่เพิ่มใหม่ 2: ค้นหาด้วย Email ---
  findStudentByEmail(emailKeyword: string): Student[] {
    return this.students.filter(s =>
      s.email.toLowerCase().includes(emailKeyword.toLowerCase())
    );
  }

  saveToLocalStorage(): void {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem("students");
    if (data) {
      this.students = JSON.parse(data);
    }
  }
}