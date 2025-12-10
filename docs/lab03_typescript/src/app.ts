import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";

const manager = new StudentManager();
// manager.loadFromLocalStorage(); // ไม่ต้องเรียกแล้วถ้าใส่ใน Constructor ตามโค้ดก่อนหน้า

function renderTable(elementId: string = "studentTableBody"): void {
  const tableBody = document.getElementById(elementId)!;
  tableBody.innerHTML = "";
  const students = manager.getAllStudents();
  showList<Student>(students);
  
  students.forEach((s) => {
    tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>  // <--- (สีแดง) แก้ไข: ใส่ตัวแปร title_name
        <td>${s.first_name}</td>  // <--- (สีแดง) แก้ไข: ใส่ตัวแปร first_name
        <td>${s.last_name}</td>   // <--- (สีแดง) แก้ไข: ใส่ตัวแปร last_name
        <td>${s.email}</td>       // <--- (สีแดง) แก้ไข: ใส่ตัวแปร email
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
  });
}

(document.getElementById("addBtn") as HTMLButtonElement).onclick = () => {
  const id = (document.getElementById("id") as HTMLInputElement).value;
  
  // <--- (สีแดง) เริ่มส่วนที่เพิ่มใหม่: รับค่าจาก Input ให้ครบ
  const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
  const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
  const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  // <--- (สีแดง) จบส่วนที่เพิ่มใหม่

  const year = Number((document.getElementById("year") as HTMLInputElement).value);
  const major = (document.getElementById("major") as HTMLInputElement).value;

  // <--- (สีแดง) แก้ไข: สร้าง Object ให้ครบทุก field
  const student: Student = { 
      id, 
      title_name, 
      first_name, 
      last_name, 
      email, 
      year, 
      major 
  };
  
  manager.addStudent(student);
  renderTable();
};

(document.getElementById("searchNameBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchName") as HTMLInputElement).value;
  const results = manager.findStudentsByName(keyword);
  showList<Student>(results);
  alert(`ผลการค้นหา: ${results.length} คน`);
};

(document.getElementById("searchMajorBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
  const results = manager.findStudentsByMajor(keyword);
  showList<Student>(results);
  alert(`พบในสาขา: ${results.length} คน`);
};

// <--- (สีแดง) เพิ่มใหม่: ปุ่มค้นหาด้วย Email
(document.getElementById("searchEmailBtn") as HTMLButtonElement).onclick = () => {
  const keyword = (document.getElementById("searchEmail") as HTMLInputElement).value;
  const results = manager.findStudentByEmail(keyword);
  showList<Student>(results); // แสดงผลใน Console (Generic Function)
  alert(`พบอีเมลที่ตรงกัน: ${results.length} คน`);
};

renderTable("studentTableBody");