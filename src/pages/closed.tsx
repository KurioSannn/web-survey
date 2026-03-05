import { useNavigate } from "react-router-dom";

export default function Closed(){

const navigate = useNavigate();

return(

<div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-green-700 via-green-800 to-green-950 relative overflow-hidden">

{/* BACKGROUND BLOBS */}
<div className="absolute w-[420px] h-[420px] bg-green-400 opacity-20 blur-3xl rounded-full -top-20 -left-20 animate-blob"></div>

<div className="absolute w-[350px] h-[350px] bg-green-300 opacity-20 blur-3xl rounded-full bottom-0 right-0 animate-blob animation-delay-2000"></div>

{/* CARD */}
<div className="relative bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl text-center space-y-6 max-w-md animate-[fadeUp_0.6s_ease]">

<div className="text-6xl animate-pulse">
🔒
</div>

<h1 className="text-2xl font-bold text-red-500">
Survey Telah Ditutup
</h1>

<p className="text-slate-600 text-sm leading-relaxed">
Terima kasih atas antusiasme Anda dalam berpartisipasi.
Pengumpulan data survei saat ini telah berakhir.
Silakan hubungi pihak terkait apabila membutuhkan informasi lebih lanjut.
</p>

<button
onClick={()=>navigate("/")}
className="bg-[#009C48] text-white px-6 py-3 rounded-xl
font-medium
hover:bg-[#025C1E]
active:scale-95
transition-all duration-200"
>
Kembali ke Beranda
</button>

</div>

</div>

);

}