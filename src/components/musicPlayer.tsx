import { useRef, useState } from "react";

export default function MusicPlayer(){

const audioRef = useRef<HTMLAudioElement>(null);
const [playing,setPlaying] = useState(false);

const toggleMusic = async () => {

if(!audioRef.current) return;

try{

if(playing){
audioRef.current.pause();
setPlaying(false);
}else{
await audioRef.current.play();
setPlaying(true);
}

}catch(err){
console.log(err);
}

};

return(

<div className="flex items-center justify-center">

<button
onClick={toggleMusic}
className={`w-12 h-12
rounded-full
bg-green-600
text-white
flex items-center justify-center
text-lg
transition
active:scale-95
`}
>
{playing ? "🔊" : "🎵"}
</button>

<audio
ref={audioRef}
loop
playsInline
preload="auto"
>
<source src="/music/jos.mp3" type="audio/mpeg" />
</audio>

</div>

);

}