import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { phase1, phase2, phase3 } from "../data/questions";
import { supabase } from "../lib/supabaseClient";
import { getSurveyStatus } from "../hook/useSurveyStatus";
import MusicPlayer from "../components/musicPlayer";

export default function Survey() {
  const isStepAnswered = (index:number)=>{

    const q = allQuestions[index];

    const main = answers[q.id];
    const other = answers[`${q.id}_other`];

    if(q.type==="checkbox"){
      return (
        Array.isArray(main) && main.length>0
      ) || (
        typeof other==="string" && other.trim()!==""
      );
    }

    return (
      main !== undefined &&
      main !== null &&
      main !== ""
    ) || (
      typeof other==="string" &&
      other.trim()!==""
    );
  };

const navigate = useNavigate();

const allQuestions = [
  ...phase1.map(q => ({...q, phase:1})),
  ...phase2.map(q => ({...q, phase:2})),
  ...phase3.map(q => ({...q, phase:3}))
];

const [step,setStep] = useState(()=>{
  const saved = localStorage.getItem("surveyStep");
  return saved ? Number(saved) : 0;
});

const [maxStep,setMaxStep] = useState(()=>{
  const saved = localStorage.getItem("surveyMaxStep");
  return saved ? Number(saved) : 0;
});

const current = allQuestions[step];
const total = allQuestions.length;

const [answers,setAnswers] = useState<Record<string,any>>({});


// ====== SAFE ANSWER CHECK ======
const isAnswered = () => {

  const main = answers[current.id];
  const other = answers[`${current.id}_other`];

  if(current.type==="checkbox"){
    return (
      Array.isArray(main) && main.length > 0
    ) || (
      typeof other === "string" && other.trim() !== ""
    );
  }

  return (
    main !== undefined &&
    main !== null &&
    main !== ""
  ) || (
    typeof other === "string" &&
    other.trim() !== ""
  );
};


// ====== VALIDATE ALL ======
const validateAllAnswers = ()=>{

  for(const q of allQuestions){

    const main = answers[q.id];
    const other = answers[`${q.id}_other`];

    if(q.type==="checkbox"){

      const valid =
        (Array.isArray(main) && main.length > 0) ||
        (typeof other==="string" && other.trim()!=="");

      if(!valid) return false;

    }else{

      const valid =
        (main !== undefined && main !== null && main !== "") ||
        (typeof other==="string" && other.trim()!=="");

      if(!valid) return false;

    }

  }

  return true;

};


// ====== CLEAN JSON ======
const cleanAnswers = (data:Record<string,any>)=>{

  return Object.fromEntries(
    Object.entries(data).filter(([_,v])=>
      v !== undefined &&
      v !== null &&
      v !== "" &&
      !(Array.isArray(v) && v.length===0)
    )
  );

};

// ====== STATUS CHECK SAFE ======
useEffect(() => {

  let mounted = true;

  const checkStatus = async () => {
    const status = await getSurveyStatus();
    if (mounted && status === "closed"){
      navigate("/closed");
    }
  };

  checkStatus();

  return ()=>{
    mounted = false;
  }

}, [navigate]);


// ====== GUARD RESPONDENT ======
useEffect(()=>{
  const respondent = localStorage.getItem("respondent");
  if(!respondent) navigate("/");
},[navigate]);


// ====== LOAD DRAFT ======
useEffect(()=>{
  const saved = localStorage.getItem("surveyAnswers");
  if(saved){
    try{
      setAnswers(JSON.parse(saved));
    }catch{
      setAnswers({});
    }
  }
},[]);


// ====== AUTOSAVE ======
useEffect(()=>{
  localStorage.setItem("surveyAnswers",JSON.stringify(answers));
},[answers]);

useEffect(()=>{
  localStorage.setItem("surveyStep",String(step));
},[step]);

useEffect(()=>{
  localStorage.setItem("surveyMaxStep",String(maxStep));
},[maxStep]);

useEffect(()=>{

  let lastValid = -1;

  for(let i=0;i<allQuestions.length;i++){

    const q = allQuestions[i];

    const main = answers[q.id];
    const other = answers[`${q.id}_other`];

    let valid=false;

    if(q.type==="checkbox"){
      valid =
      (Array.isArray(main) && main.length>0)
      || (typeof other==="string" && other.trim()!=="");
    }else{
      valid =
      (main !== undefined && main !== null && main !== "")
      || (typeof other==="string" && other.trim()!=="");
    }

    if(valid){
      lastValid=i;
    }else{
      break;
    }

  }

  // 🔒 lock ulang maxStep
  setMaxStep(lastValid+1);

  // 🚨 kalau user lagi di step yg sekarang illegal
  if(step > lastValid+1){
    setStep(lastValid+1);
  }

},[answers]);

// ====== HANDLE SELECT ======
const handleSelect = (opt: string) => {

  if (current.type === "checkbox") {

    const arr = answers[current.id] ?? [];

    const updated = arr.includes(opt)
      ? arr.filter((o: string) => o !== opt)
      : [...arr, opt];

    setAnswers(prev => ({
      ...prev,
      [current.id]: updated
    }));

  } else {

  setAnswers(prev => {

    if(prev[current.id] === opt){
      // 🔥 batal jawaban
      const copy = {...prev};
      delete copy[current.id];
      return copy;
    }

    return {
      ...prev,
      [current.id]: opt
    };

  });

}

};

// ====== OTHER ======
const handleOther = (value:string)=>{
  setAnswers(prev=>({
    ...prev,
    [`${current.id}_other`]:value
  }));
};


// ====== NEXT SAFE ======
const nextStep = ()=>{

  if(!isAnswered()) return;

  if(step < total-1){

    setStep(prev=>{
      const next = prev+1;

      setMaxStep(prevMax=>{
        if(next>prevMax){
          return next;
        }
        return prevMax;
      });

      return next;
    });

  }

};

// ====== PREV ======
const prevStep = ()=>{
  if(step>0) setStep(step-1);
};


// ====== SUBMIT SAFE ======
const handleSubmit = async () => {

  if(!validateAllAnswers()){
    alert("Masih ada pertanyaan yang belum diisi!");
    return;
  }

  localStorage.removeItem("surveyStep");
  localStorage.removeItem("surveyMaxStep");

  const respondent = localStorage.getItem("respondent");

  if (!respondent) {
    alert("Data responden tidak ada!");
    return;
  }

  const user = JSON.parse(respondent);

  const cleaned = cleanAnswers(answers);

  const { error } = await supabase
    .from("responses")
    .insert([
      {
        name: user.name,
        faculty: user.faculty,
        status: user.status,
        answers: cleaned
      }
    ]);

  if (error) {
    console.log(error);
    alert("Gagal mengirim data!");
  } else {

    localStorage.removeItem("surveyAnswers");
    localStorage.removeItem("respondent");

    navigate("/thankyou");
  }

};

return(

<div className="min-h-screen bg-slate-100 flex flex-col">

  {/* HEADER */}
  <div className="w-full max-w-xl mx-auto pt-4">
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex w-max min-w-full justify-center items-center gap-2 py-2 px-2">

        {/* STEP 1 */}
        <button
        onClick={()=>{
        if(0 <= maxStep){
        setStep(0);
        }
        }}
        className={`min-w-[32px] h-8 rounded-full text-xs shrink-0
        ${step===0
        ? "bg-green-600 text-white scale-110"
        : "bg-slate-300 text-black"
        }`}
        >
        1
        </button>

        {step > 3 && <span className="px-1 text-slate-400">...</span>}

        {allQuestions.map((_,i)=>{

        if(i===0 || i===total-1) return null;
        if(Math.abs(i-step) > 2) return null;

        let canGo = true;
        for(let j=0;j<i;j++){
          if(!isStepAnswered(j)){
            canGo=false;
            break;
          }
        }

        return(
        <button
        key={i}
        onClick={()=>{
          if(canGo){
            setStep(i);
          }
        }}
        className={`min-w-[32px] h-8 rounded-full text-xs shrink-0 transition
        ${i===step
        ? "bg-green-600 text-white scale-110"
        : "bg-slate-300 text-black"}
        ${!canGo
        ? " opacity-30 cursor-not-allowed"
        : ""}
        `}
        >
        {i+1}
        </button>
        );

        })}

        {step < total-4 && <span className="px-1 text-slate-400">...</span>}

        <button
        onClick={()=>{
        if(total-1 <= maxStep){
        setStep(total-1);
        }
        }}
        className={`min-w-[32px] h-8 rounded-full text-xs shrink-0
        ${step===total-1
        ? "bg-green-600 text-white scale-110"
        : "bg-slate-300 text-black"
        }`}
        >
        {total}
        </button>

      </div>
    </div>
  </div>


  {/* SCROLL AREA */}
  <div className="flex-1 overflow-y-auto">
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-28">

      <div
      key={step}
      className="bg-white p-5 rounded-2xl shadow space-y-5
      animate-[fadeUp_0.35s_ease]"
      >

        <p className="text-xs text-green-600 font-medium">
        {current.phase===1 && "Keluhan Sistem"}
        {current.phase===2 && "Kebutuhan Fitur"}
        {current.phase===3 && "Preferensi Tampilan"}
        </p>

        <h2 className="text-base font-semibold">
        {current.question}
        </h2>

        {current.type==="checkbox" && (
        <p className="text-xs text-slate-400">
        Bisa pilih lebih dari satu
        </p>
        )}

        <div className="space-y-3">

        {current.options.map((opt:string,idx:number)=>{

        const selected =
        current.type==="checkbox"
        ? answers[current.id]?.includes(opt)
        : answers[current.id]===opt;

        return(
        <div
        key={opt}
        onClick={()=>handleSelect(opt)}
        className={`p-4 border rounded-xl text-sm cursor-pointer transition
        ${selected
        ? "bg-green-100 border-green-500"
        : "bg-white border-slate-300"
        }`}
        >

        {current.images && (
        <img
        src={current.images[idx]}
        alt={opt}
        className="w-full h-auto object-contain rounded-xl mb-2"
        />
        )}

        <span>
        {current.phase===3 ? `Opsi ${opt}` : opt}
        </span>

        </div>
        );

        })}

        {current.hasOther &&(
        <div>
        <p className="text-xs text-slate-500 mb-1">
        Lainnya (opsional)
        </p>
        <input
        type="text"
        value={answers[`${current.id}_other`] || ""}
        onChange={(e)=>handleOther(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 text-sm"
        />
        </div>
        )}

        </div>

      </div>

    </div>
  </div>


  {/* ✅ FULL WIDTH FOOTER */}
  <div className="w-full sticky bottom-0 left-0 right-0 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">

    <div className="max-w-xl mx-auto px-5 py-4 grid grid-cols-3 items-center">

    {/* KIRI */}
    <div className="flex justify-start">
      <button
        onClick={prevStep}
        disabled={step===0}
        className="px-4 py-2 text-sm rounded-xl bg-green-600 text-white
          hover:bg-green-700
          active:scale-95
          active:bg-green-800
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Kembali
      </button>
    </div>

    {/* TENGAH */}
    <div className="flex justify-center">
      <MusicPlayer />
    </div>

    {/* KANAN */}
    <div className="flex justify-end">
      {step===total-1
      ?(
        <button
          onClick={handleSubmit}
          disabled={!isAnswered()}
            className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white
            hover:bg-blue-700
            active:bg-blue-700
            active:scale-95
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      )
      :(
        <button
          onClick={nextStep}
          disabled={!isAnswered()}
            className="px-4 py-2 text-sm rounded-xl bg-green-600 text-white
            hover:bg-green-700
            active:bg-green-700
            active:scale-95
            transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lanjut
        </button>
      )
      }
    </div>

  </div>

  </div>

</div>

);
}