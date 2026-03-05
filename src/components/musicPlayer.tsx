import { useRef, useState } from "react";
import Draggable from "react-draggable";

export default function MusicPlayer(){

const audioRef = useRef<HTMLAudioElement>(null);
const dragRef = useRef<HTMLDivElement>(null);

const [playing,setPlaying] = useState(false);
const [minimized,setMinimized] = useState(false);

const toggleMusic = () => {

if(!audioRef.current) return;

if(playing){
audioRef.current.pause();
}else{
audioRef.current.play();
}

setPlaying(!playing);

};

return(

<Draggable nodeRef={dragRef}>

<div ref={dragRef} className="fixed bottom-24 right-4 md:right-8 z-50">

<div className="relative">

{!minimized && (

<button
onClick={toggleMusic}
className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg"
>
{playing ? "🔊" : "🎵"}
</button>

)}

<button
onClick={()=>setMinimized(!minimized)}
className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 shadow"
>
{minimized ? "+" : "✕"}
</button>

</div>

<audio ref={audioRef} loop>
<source src="/music/jos.mp3" type="audio/mpeg" />
</audio>

</div>

</Draggable>

);

}