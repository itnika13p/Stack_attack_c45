import type { Direction } from '../game/GameState';
const left=['ArrowLeft','KeyA','Numpad4'],right=['ArrowRight','KeyD','Numpad6'],jump=['ArrowUp','KeyW','Space','Numpad8'];
export class KeyboardInput {
  private held=new Set<string>();private jumping=false;
  down(code:string,repeat=false){this.held.add(code);if(jump.includes(code)&&!repeat)this.jumping=true;}
  up(code:string){this.held.delete(code);}
  get direction():Direction{const l=left.some(k=>this.held.has(k)),r=right.some(k=>this.held.has(k));return l===r?0:l?-1:1;}
  takeJump(){const value=this.jumping;this.jumping=false;return value;}
  clear(){this.held.clear();this.jumping=false;}
  static handles(code:string){return [...left,...right,...jump,'Enter','Escape','ArrowDown','KeyS','KeyF','KeyM'].includes(code);}
}
