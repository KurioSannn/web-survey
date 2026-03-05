export type Question = {
  id:string;
  type:"checkbox"|"radio";
  question:string;
  options:string[];
  hasOther?:boolean;
  images?:string[];   // 🔥 TAMBAH INI
}

export const UI_TEST = {
  overall:{
    A:"/mockup/overall/a.png",
    B:"/mockup/overall/b.png",
    C:"/mockup/overall/c.png"
  }
};

export const phase1: Question[] = [

{
id:"p1_q1",
type:"checkbox",
question:"Apa kendala utama saat menggunakan sistem akademik kampus?",
options:[
"Sulit mencari informasi",
"Harus membuka banyak website",
"Navigasi membingungkan",
"Loading lama",
"Sering error"
],
hasOther:true
},

{
id:"p1_q2",
type:"checkbox",
question:"Informasi apa yang paling sulit Anda temukan?",
options:[
"Jadwal kuliah",
"Deadline tugas",
"Nilai / KHS",
"Kehadiran",
"Kalender akademik"
],
hasOther:true
},

{
id:"p1_q3",
type:"checkbox",
question:"Apa kendala saat periode KRS?",
options:[
"Sulit melihat kuota kelas",
"Konflik jadwal tidak terdeteksi",
"Website lambat",
"Navigasi membingungkan"
],
hasOther:true
},

{
id:"p1_q4",
type:"checkbox",
question:"Apa kendala dalam mengelola tugas kuliah?",
options:[
"Tidak ada pengingat",
"Lupa deadline",
"Sulit melihat status tugas",
"Informasi tersebar"
],
hasOther:true
},

{
id:"p1_q5",
type:"radio",
question:"Bagaimana pengalaman Anda menggunakan sistem akademik saat ini?",
options:[
"Sangat tidak nyaman",
"Tidak nyaman",
"Cukup",
"Nyaman",
"Sangat nyaman"
]
}

];

export const phase2: Question[] = [

{
id:"p2_q1",
type:"checkbox",
question:"Fitur apa yang paling Anda butuhkan dalam aplikasi akademik?",
options:[
"Jadwal kuliah",
"Deadline tugas",
"Nilai / KHS",
"Kehadiran",
"Kalender akademik"
],
hasOther:true
},

{
id:"p2_q2",
type:"checkbox",
question:"Pengingat (reminder) apa yang Anda butuhkan?",
options:[
"Deadline tugas",
"Jadwal kuliah",
"Periode KRS",
"Pembayaran UKT"
],
hasOther:true
},

{
id:"p2_q3",
type:"radio",
question:"Seberapa penting notifikasi akademik?",
options:[
"Sangat tidak penting",
"Tidak penting",
"Cukup penting",
"Penting",
"Sangat penting"
]
},

{
id:"p2_q4",
type:"radio",
question:"Apakah Anda membutuhkan dashboard ringkasan akademik (IPK, SKS)?",
options:["Ya","Tidak"]
},

{
id:"p2_q5",
type:"radio",
question:"Apakah tampilan jadwal kuliah harian/mingguan diperlukan?",
options:["Ya","Tidak"]
},

{
id:"p2_q6",
type:"radio",
question:"Apakah fitur status tugas (terkumpul/belum) diperlukan?",
options:["Ya","Tidak"]
},

{
id:"p2_q7",
type:"radio",
question:"Apakah informasi kuota kelas KRS diperlukan?",
options:["Ya","Tidak"]
},

{
id:"p2_q8",
type:"radio",
question:"Apakah rekap kehadiran diperlukan dalam aplikasi?",
options:["Ya","Tidak"]
},

{
id:"p2_q9",
type:"radio",
question:"Apakah riwayat pembayaran UKT diperlukan?",
options:["Ya","Tidak"]
}

];

export const phase3: Question[] = [

{
id:"p3_q1",
type:"radio",
question:"Dari tampilan berikut, mana yang paling nyaman digunakan?",
options:["A","B","C"],
images:[
UI_TEST.overall.A,
UI_TEST.overall.B,
UI_TEST.overall.C
]
}

];