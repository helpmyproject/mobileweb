// src/models/Student.ts
export interface Student {  // <--- ต้องมีคำว่า export ตรงนี้ สำคัญมาก!
    id: string;
    title_name: string;
    first_name: string;
    last_name: string;
    email: string;
    year: number;
    major: string;
}