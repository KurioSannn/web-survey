import { useEffect,useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin(){

const [data,setData] = useState<any>(null);

const [painStats,setPainStats] = useState<any[]>([]);
const [featureStats,setFeatureStats] = useState<any[]>([]);
const [uiStats,setUiStats] = useState<any[]>([]);

const [showPain,setShowPain] = useState(false);
const [showFeature,setShowFeature] = useState(false);
const [showUI,setShowUI] = useState(false);


useEffect(()=>{

const fetchAll = async()=>{

// summary
const {data,error} = await supabase.rpc("get_dashboard_summary");
if(!error) setData(data);

// pain point
const {data:pain} = await supabase.rpc("get_option_stats",{q:"p1_q1"});
setPainStats(pain || []);

// feature
const {data:feature} = await supabase.rpc("get_feature_need_stats");
setFeatureStats(feature || []);

// ui
const {data:ui} = await supabase.rpc("get_radio_stats",{q:"p3_q1"});
setUiStats(ui || []);

};

fetchAll();

const interval = setInterval(fetchAll,15000);

return ()=>clearInterval(interval);

},[]);


const interpret = (val:number)=>{

if(val<=1.5) return "Rendah";
if(val<=2.5) return "Sedang";
return "Tinggi";

};

if(!data) return <p>Loading...</p>;

const percent = (val:number)=>{

if(!data?.total) return 0;
return Math.round((val / data.total) * 100);

};


return(

<div className="min-h-screen p-10 bg-green-50">

<h1 className="text-3xl font-bold mb-8 text-green-700">
Survey Dashboard
</h1>


{/* SUMMARY CARDS */}

<div className="grid md:grid-cols-4 gap-5">


{/* TOTAL */}
<div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
<p className="text-sm text-gray-500">Total Responden</p>
<h2 className="text-2xl font-bold text-green-700">
{data.total}
</h2>
</div>


{/* PAIN POINT */}
<div
onClick={()=>setShowPain(!showPain)}
className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
>

<p className="text-sm text-gray-500">
Pain Point
</p>

<h2 className="text-2xl font-bold">
{data.phase1}
</h2>

<p className="text-sm text-gray-400">
{interpret(data.phase1)}
</p>

<p className="text-xs text-green-600 mt-2">
Klik untuk detail {showPain ? "▲" : "▼"}
</p>

</div>


{/* FEATURE NEED */}
<div
onClick={()=>setShowFeature(!showFeature)}
className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
>

<p className="text-sm text-gray-500">
Feature Need
</p>

<h2 className="text-2xl font-bold">
{data.phase2}
</h2>

<p className="text-sm text-gray-400">
{interpret(data.phase2)}
</p>

<p className="text-xs text-green-600 mt-2">
Klik untuk detail {showFeature ? "▲" : "▼"}
</p>

</div>


{/* UI STRENGTH */}
<div
onClick={()=>setShowUI(!showUI)}
className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition"
>

<p className="text-sm text-gray-500">
UI Strength
</p>

<h2 className="text-2xl font-bold">
{data.phase3}
</h2>

<p className="text-sm text-gray-400">
{interpret(data.phase3)}
</p>

<p className="text-xs text-green-600 mt-2">
Klik untuk detail {showUI ? "▲" : "▼"}
</p>

</div>

</div>



{/* UI WINNER */}

<div className="mt-6 bg-white p-6 rounded-xl shadow border-l-4 border-green-500">

<p className="text-sm text-gray-500">
UI Winner
</p>

<h2 className="text-xl font-bold text-green-700">
Mockup {data.ui_winner}
</h2>

</div>



{/* PAIN POINT DETAIL */}

{showPain &&(

<div className="mt-6 bg-white p-6 rounded-xl shadow">

<h2 className="font-bold mb-4 text-green-700">
Pain Point Detail
</h2>

{painStats.map((item:any)=>{

const p = percent(item.total);

return(

<div key={item.option} className="mb-3">

<div className="flex justify-between text-sm mb-1">
<span>{item.option}</span>
<span>{p}%</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-green-500 h-2 rounded-full"
style={{width:`${p}%`}}
></div>

</div>

</div>

);

})}

</div>

)}



{/* FEATURE DETAIL */}

{showFeature &&(

<div className="mt-6 bg-white p-6 rounded-xl shadow">

<h2 className="font-bold mb-4 text-green-700">
Feature Need Detail
</h2>

{featureStats.map((item:any)=>{

const p = percent(item.total);

return(

<div key={item.option} className="mb-3">

<div className="flex justify-between text-sm mb-1">
<span>{item.option}</span>
<span>{p}%</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-green-500 h-2 rounded-full"
style={{width:`${p}%`}}
></div>

</div>

</div>

);

})}

</div>

)}



{/* UI DETAIL */}

{showUI &&(

<div className="mt-6 bg-white p-6 rounded-xl shadow">

<h2 className="font-bold mb-4 text-green-700">
UI Test Result
</h2>

{uiStats.map((item:any)=>{

const p = percent(item.total);

return(

<div key={item.option} className="mb-3">

<div className="flex justify-between text-sm mb-1">
<span>Mockup {item.option}</span>
<span>{p}%</span>
</div>

<div className="w-full bg-gray-200 rounded-full h-2">

<div
className="bg-green-500 h-2 rounded-full"
style={{width:`${p}%`}}
></div>

</div>

</div>

);

})}

</div>

)}

</div>

);
}