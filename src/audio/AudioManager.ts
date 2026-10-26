import type { SoundEvent } from '../game/GameState';
// Synthesized approximations based on secondary frequency measurements, not recordings.
const notes:Record<SoundEvent,number[]>={menu:[1750],jump:[1960,1750,1657],land:[1960],push:[1865],clear:[1750,1960,1569],over:[1866,1663,1969,1865,1761,1750]};
export class AudioManager {
  enabled=true;private context:AudioContext|undefined;
  unlock(){
    if(!this.enabled)return;
    try{this.context??=new AudioContext();if(this.context.state==='suspended')void this.context.resume().catch(()=>{});}catch{/* Audio is optional. */}
  }
  play(event:SoundEvent){
    if(!this.enabled||!this.context||this.context.state!=='running')return;
    const context=this.context;
    notes[event].forEach((frequency,i)=>{
      const start=context.currentTime+i*0.075;
      const osc=context.createOscillator(),gain=context.createGain();
      osc.type='square';osc.frequency.value=frequency;
      gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(0.025,start+0.004);gain.gain.exponentialRampToValueAtTime(0.0001,start+0.065);
      osc.connect(gain);gain.connect(context.destination);osc.start(start);osc.stop(start+0.07);
      osc.onended=()=>{osc.disconnect();gain.disconnect();};
    });
  }
  suspend(){void this.context?.suspend().catch(()=>{});}
}
