import { expect,test } from 'vitest';
import { KeyboardInput } from '../src/input/KeyboardInput';
import { InputManager } from '../src/input/InputManager';
import { empty } from './helpers';
test('keyboard aliases move independently and opposing keys cancel',()=>{const k=new KeyboardInput();k.down('KeyA');expect(k.direction).toBe(-1);k.down('ArrowRight');expect(k.direction).toBe(0);k.up('KeyA');expect(k.direction).toBe(1);k.clear();expect(k.direction).toBe(0);});
test('held jump key does not autojump from browser repeats',()=>{const k=new KeyboardInput();k.down('Space');expect(k.takeJump()).toBe(true);k.down('Space',true);expect(k.takeJump()).toBe(false);});
test('touch cancellation does not release keyboard input',()=>{const manager=new InputManager();manager.keyboard.down('KeyD');manager.swipe.cancel();expect(manager.sample(empty()).direction).toBe(1);});
