import { MAX_TICKS } from '../constants';
import { ColorArray, Pt, Quad } from '../types';
import { mapTo } from '../utils/helpers';

const packCoordinate = (val: number) => Math.round(val * 100);

class FanBlade {
  center: Pt;
  index: number;
  isOpaque: boolean;
  topEdge: boolean;
  points: Quad;
  co: string;
  altColorIndex: number;
  altColorOpacity: string;
  tickSpacing: number;
  colorStartIndex: number;

  constructor(
    _pts: Quad,
    _index: number,
    numColors: number,
    tickSpacing: number,
  ) {
    this.center = { x: 0, y: 0 };
    this.index = _index;
    this.isOpaque = Math.random() > 0.3;
    this.topEdge = Math.random() > 0.5 ? true : false;
    this.points = _pts;
    this.co = this.isOpaque ? '#ffffff' : '#00000080';
    this.altColorIndex = Math.floor(Math.random() * numColors);
    const n0 = 143;
    const n1 = 247;
    this.altColorOpacity = Math.round(n0 + Math.random() * (n1 - n0)).toString(
      16,
    );
    this.tickSpacing = tickSpacing;
    this.colorStartIndex = Math.floor(Math.random() * MAX_TICKS);
  }

  update(pt0: Pt, pt1: Pt, pt2: Pt, pt3: Pt) {
    this.points.pt0 = pt0;
    this.points.pt1 = pt1;
    this.points.pt2 = pt2;
    this.points.pt3 = pt3;
    this.center.x = 0.5 * (pt0.x + pt2.x);
    this.center.y = 0.5 * (pt0.y + pt2.y);
  }

  // getHeading() {
  //   const {
  //     center,
  //     points: { pt0, pt1, pt2, pt3 },
  //   } = this;
  //   const vec = this.topEdge
  //     ? {x: (pt3.x + pt0.x) / 2, y: (pt3.y + pt0.y) / 2}
  //     : {x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2};
  //   const trajVec = {x: center.x - vec.x, y: center.y - vec.y};

  //   return trajVec.heading();
  // }

  renderPolygon(
    ctx: CanvasRenderingContext2D,
    palette: ColorArray,
    showColor: boolean,
  ) {
    const {
      altColorIndex,
      altColorOpacity,
      isOpaque,
      co,
      points: { pt0, pt1, pt2, pt3 },
    } = this;

    // Shadow effect
    // strokeCap(SQUARE);
    // strokeWeight(3);
    // stroke(0, 55);
    // line(pt0.x, pt0.y, pt1.x, pt1.y);
    // line(pt3.x, pt3.y, pt0.x, pt0.y);
    // line(pt3.x, pt3.y, pt0.x, pt0.y);
    // strokeWeight(1);
    // stroke(0, 63);

    const coco =
      showColor && !isOpaque && palette.length
        ? `${palette[altColorIndex]}${altColorOpacity}`
        : co;
    ctx.fillStyle = coco;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(pt0.x, pt0.y);
    ctx.lineTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.lineTo(pt3.x, pt3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  drawTickMarks(ctx: CanvasRenderingContext2D, palette: ColorArray) {
    const { pt0, pt1, pt2, pt3 } = this.points;
    const dx1 = pt0.x - pt1.x;
    const dy1 = pt0.y - pt1.y;
    const dx2 = pt2.x - pt3.x;
    const dy2 = pt2.y - pt3.y;
    const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const longSide = Math.max(dist1, dist2);
    let len = longSide;
    if (longSide < 1) {
      len = 1;
    } else if (longSide > 200) {
      len = 200;
    }

    const numTicks = Math.round(mapTo(len, 1, 200, 1, MAX_TICKS));

    ctx.strokeStyle = `${palette[this.altColorIndex]}${this.altColorOpacity}`;
    for (let j = 1; j < numTicks; j++) {
      const b = j / numTicks;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        pt0.x + b * this.tickSpacing * (pt1.x - pt0.x),
        pt0.y + b * this.tickSpacing * (pt1.y - pt0.y),
      );
      ctx.lineTo(
        pt3.x + b * this.tickSpacing * (pt2.x - pt3.x),
        pt3.y + b * this.tickSpacing * (pt2.y - pt3.y),
      );
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    palette: ColorArray,
    showColor: boolean,
  ) {
    // Render the polygon
    this.renderPolygon(ctx, palette, showColor);

    // Render tick marks
    if (this.isOpaque && showColor) {
      this.drawTickMarks(ctx, palette);
    }
  }

  getColor(palette: ColorArray, showColor: boolean) {
    const { altColorIndex, altColorOpacity, co, isOpaque } = this;
    const coco =
      showColor && !isOpaque && palette.length
        ? `${palette[altColorIndex]}${altColorOpacity}`
        : co;

    return coco;
  }

  get details() {
    return [
      packCoordinate(this.points.pt0.x),
      packCoordinate(this.points.pt0.y),
      packCoordinate(this.points.pt1.x),
      packCoordinate(this.points.pt1.y),
      packCoordinate(this.points.pt2.x),
      packCoordinate(this.points.pt2.y),
      packCoordinate(this.points.pt3.x),
      packCoordinate(this.points.pt3.y),
    ];
  }
}

export default FanBlade;
