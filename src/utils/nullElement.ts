import { DURATION_FRAMES } from '../constants';
import { Pt } from '../types';
import { mapTo } from './helpers';

const radius = 80; // TODO: Consider making this variable
class NullElement {
  point0: Pt;
  point1: Pt;
  x: number;
  y: number;
  counter: number;
  angleOffset: number;

  constructor(_pos: Pt, _index: number) {
    this.x = _pos.x;
    this.y = _pos.y;
    this.counter = _index;
    this.angleOffset = (2 * Math.PI * (_index * 2)) / 360;
    this.point0 = { x: 0, y: 0 };
    this.point1 = { x: 0, y: 0 };
  }

  update(frameNum: number, balance: number, diff: number) {
    const PI = Math.PI;
    const { angleOffset, counter } = this;
    const c = frameNum + counter;
    const unitAmount = (c % DURATION_FRAMES) / DURATION_FRAMES;
    const sinAmount = Math.sin(unitAmount * 2 * PI);
    const a = (0.5 * PI + angleOffset) * sinAmount;
    const len = mapTo(sinAmount, -1, 1, radius, radius * diff);

    this.point0.x = -len * balance * Math.cos(a);
    this.point0.y = -len * balance * Math.sin(a);
    this.point1.x = len * (1.0 - balance) * Math.cos(a) * 0.5;
    this.point1.y = len * (1.0 - balance) * Math.sin(a) * 0.5;
  }
}

export default NullElement;
