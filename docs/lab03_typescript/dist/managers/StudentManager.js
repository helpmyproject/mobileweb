export class StudentManager {
    constructor() {
        this.students = [];
        // โหลดข้อมูลทันทีเมื่อเริ่ม Class
        this.loadFromLocalStorage();
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudents() {
        return this.students;
    }
    findStudentByID(id) {
        return this.students.find(s => s.id === id);
    }
    // --- จุดที่แก้ไข 1: ค้นหาจาก ชื่อจริง หรือ นามสกุล ---
    findStudentsByName(keyword) {
        // ใช้ || (OR) เพื่อบอกว่า เจอในชื่อหน้า หรือ เจอในนามสกุล ก็ให้นับว่าเจอ
        return this.students.filter(s => s.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            s.last_name.toLowerCase().includes(keyword.toLowerCase()));
    }
    findStudentsByMajor(major) {
        return this.students.filter(s => s.major.toLowerCase().includes(major.toLowerCase()));
    }
    // --- จุดที่เพิ่มใหม่ 2: ค้นหาด้วย Email ---
    findStudentByEmail(emailKeyword) {
        return this.students.filter(s => s.email.toLowerCase().includes(emailKeyword.toLowerCase()));
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data) {
            this.students = JSON.parse(data);
        }
    }
}
