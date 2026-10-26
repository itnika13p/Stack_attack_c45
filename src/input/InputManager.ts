import { KeyboardInput } from './KeyboardInput';
import { SwipeInput } from './SwipeInput';
import type { Game } from '../game/Game';
import type { Direction, Input } from '../game/GameState';
export class InputManager {
  keyboard=new KeyboardInput();swipe=new SwipeInput();keypad:Direction=0;keypadJump=false;
  sample(game:Game):Input {
    // Consume only when a grid step can start, or immediately on a reversal.
    const reverse=game.player.target!==null&&this.swipe.direction!==0&&Math.sign(game.player.target-game.player.x)!==this.swipe.direction;
    const direction=this.keyboard.direction||this.keypad||((game.player.target===null||reverse)?this.swipe.takeDirection():0);
    const jump=this.keyboard.takeJump()||this.swipe.takeJump()||this.keypadJump;this.keypadJump=false;
    return {direction,jump};
  }
  clear(){this.keyboard.clear();this.swipe.cancel();this.keypad=0;this.keypadJump=false;}
}
