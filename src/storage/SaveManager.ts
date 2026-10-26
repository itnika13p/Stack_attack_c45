import type { Sensitivity } from '../input/SwipeInput';
export interface Save { highScore:number; sound:boolean; sensitivity:Sensitivity; keypad:boolean }
export class SaveManager {
  data:Save={highScore:0,sound:true,sensitivity:'normal',keypad:false};
  constructor(private storage:Pick<Storage,'getItem'|'setItem'>|undefined){
    try{const value=JSON.parse(storage?.getItem('stack-attack-c45:v1')??'null');
      if(value&&typeof value==='object'){
        if(Number.isSafeInteger(value.highScore)&&value.highScore>=0)this.data.highScore=value.highScore;
        if(typeof value.sound==='boolean')this.data.sound=value.sound;
        if(typeof value.keypad==='boolean')this.data.keypad=value.keypad;
        if(['low','normal','high'].includes(value.sensitivity))this.data.sensitivity=value.sensitivity;
      }
    }catch{/* Private mode, invalid or unavailable storage: keep the game playable. */}
  }
  persist(){try{this.storage?.setItem('stack-attack-c45:v1',JSON.stringify(this.data));}catch{/* Best effort. */}}
  record(score:number){this.data.highScore=Math.max(this.data.highScore,score);this.persist();}
}
