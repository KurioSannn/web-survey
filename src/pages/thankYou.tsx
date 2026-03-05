import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import confetti from "canvas-confetti";

export default function ThankYou() {

const navigate = useNavigate();
const [result,setResult] = useState<any>(null);
const [show,setShow] = useState(false);

const [particles] = useState(() =>
  Array.from({ length: 30 }).map(() => ({
    size: Math.random() * 6 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 10
  }))
);

const particleColors = ["#00ffcc","#00ff66","#00eaff","#ffffff","#ffff00"];

const interpret = (val:number)=>{

if(val <= 1.5) return "Rendah";
if(val <= 2.5) return "Sedang";
return "Tinggi";

};

useEffect(()=>{

const fetchResult = async ()=>{

const {data} = await supabase.rpc("get_survey_result");

if(data){
setResult(data);
}

};

fetchResult();

setTimeout(()=>setShow(true),200);


// 🎉 SUPER CONFETTI
const duration = 3000;
const end = Date.now() + duration;

(function frame() {

confetti({
particleCount:8,
angle:60,
spread:70,
origin:{ x:0 },
colors:particleColors
});

confetti({
particleCount:8,
angle:120,
spread:70,
origin:{ x:1 },
colors:particleColors
});

if(Date.now() < end){
requestAnimationFrame(frame);
}

})();

},[]);

return(

<div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-green-700 via-green-800 to-green-950 relative overflow-hidden">

{/* PARTICLE BACKGROUND */}
{particles.map((p,i)=>{

return(

<div
key={i}
className="particle"
style={{
width:p.size,
height:p.size,
left:`${p.left}%`,
top:`${p.top}%`,
animationDelay:`${p.delay}s`,
boxShadow:`0 0 8px #00ffcc,0 0 20px #00ffcc,0 0 40px #00ffcc`
}}
/>

);

})}

{/* CARD */}
<div className={`relative bg-white/95 backdrop-blur p-10 rounded-3xl shadow-2xl text-center space-y-5 max-w-md transform transition-all duration-700
${show ? "opacity-100 scale-100" : "opacity-0 scale-90"}
`}>

<div className="text-6xl animate-bounce">
🎉
</div>

<h1 className="text-3xl font-bold text-green-600">
Terima Kasih 🙌
</h1>

<p className="text-slate-600 text-sm leading-relaxed">
Partisipasi Anda sangat membantu dalam meningkatkan
kualitas sistem akademik kampus di masa depan.
</p>

{result && (

<div className="mt-4 space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl shadow-xl">

<p>
Pain Point Level:
<b className="text-green-600"> {interpret(Number(result.phase1))}</b>
</p>

<p>
Feature Need Level:
<b className="text-green-600"> {interpret(Number(result.phase2))}</b>
</p>

<p>
UI Preference Strength:
<b className="text-green-600"> {interpret(Number(result.phase3))}</b>
</p>

</div>

)}

<button
onClick={()=>navigate("/")}

className="mt-6 bg-[#009C48] text-white px-7 py-3 rounded-xl
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