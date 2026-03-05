import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/upn.png";

export default function Landing() {

  const navigate = useNavigate();

  const [showCard,setShowCard] = useState(false);
  const [name,setName] = useState("");
  const [faculty,setFaculty] = useState("");
  const [status,setStatus] = useState("");

  const illustration = "/survey-illustration.png";

useEffect(()=>{

  const saved = localStorage.getItem("respondent");

  if(saved){
    const data = JSON.parse(saved);
    setName(data.name || "");
    setFaculty(data.faculty || "");
    setStatus(data.status || "");
  }

  setTimeout(()=>{
    setShowCard(true);
  },100);

},[]);


const handleContinue = ()=>{

  if(!name || !faculty || !status){
    alert("Isi data dulu ya!");
    return;
  }

  if(status==="Dosen" || status==="Staff"){
    alert("Fitur survei untuk Dosen dan Staff masih tidak tersedia. Saat ini survei diperuntukkan bagi Mahasiswa saja.");
    return;
  }

  localStorage.setItem("respondent",JSON.stringify({
    name,
    faculty,
    status
  }));

  navigate("/survey");

};

return(

<div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-green-700 via-green-800 to-green-950 relative overflow-hidden">

{/* BACKGROUND BLOBS */}
<div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] bg-green-400 opacity-20 blur-3xl rounded-full -top-20 -left-20 animate-blob"></div>

<div className="absolute w-[260px] sm:w-[350px] h-[260px] sm:h-[350px] bg-green-300 opacity-20 blur-3xl rounded-full bottom-0 right-0 animate-blob animation-delay-2000"></div>


{/* CARD */}
<div
className={`relative bg-white/95 backdrop-blur rounded-3xl shadow-2xl w-full max-w-6xl p-6 sm:p-10 grid md:grid-cols-2 gap-8 sm:gap-12
transition-all duration-700 ease-out
${showCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
`}
>

{/* LEFT */}
<div className="flex flex-col justify-center">

{logo &&(
<img
src={logo}
alt="logo"
className="w-32 sm:w-44 mb-3 sm:mb-4"
onError={(e:any)=> e.currentTarget.style.display="none"}
/>
)}

<h1 className="text-2xl sm:text-4xl font-bold text-slate-800 leading-tight mb-3 sm:mb-4">
Survei Evaluasi <br/> UI/UX Edu Kampus
</h1>

<p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-md">
Bantu kami meningkatkan kualitas sistem Edu Kampus dengan
memberikan pengalaman penggunaan Anda melalui survei singkat ini.
</p>

<p className="text-xs text-slate-400 mt-2">
*Saat ini survei hanya tersedia untuk mahasiswa.
Survei untuk dosen dan staff akan segera hadir.
</p>

{illustration &&(
<img
src={illustration}
alt="illustration"
className="w-48 sm:w-72 mt-4 sm:mt-6"
onError={(e:any)=> e.currentTarget.style.display="none"}
/>
)}

</div>


{/* RIGHT */}
<div className="bg-slate-50 rounded-2xl p-6 sm:p-8 shadow-inner flex flex-col justify-center space-y-4 sm:space-y-5">

<h2 className="text-lg sm:text-xl font-semibold text-slate-700">
Informasi Responden
</h2>

<input
type="text"
placeholder="Nama (boleh anonim / samaran)"
className="border border-slate-200 p-3 rounded-lg w-full
focus:outline-none
focus:ring-2
focus:ring-green-500
transition"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
type="text"
placeholder="Fakultas / Prodi"
className="border border-slate-200 p-3 rounded-lg w-full
focus:outline-none
focus:ring-2
focus:ring-green-500
transition"
value={faculty}
onChange={(e)=>setFaculty(e.target.value)}
/>

<select
className="border border-slate-200 p-3 rounded-lg w-full
focus:outline-none
focus:ring-2
focus:ring-green-500
transition"
value={status}
onChange={(e)=>setStatus(e.target.value)}
>
<option value="">Pilih Status</option>
<option value="Mahasiswa">Mahasiswa</option>
<option value="Dosen">Dosen (Coming Soon)</option>
<option value="Staff">Staff (Coming Soon)</option>
</select>

<p className="text-xs text-slate-400">
Saat ini survei difokuskan untuk responden mahasiswa.
</p>

<button
onClick={handleContinue}
className="bg-[#009C48] text-white py-3 rounded-xl
font-medium
hover:bg-[#025C1E]
active:scale-95
transition-all duration-200"
>
Lanjutkan
</button>

</div>

</div>

</div>

);
}