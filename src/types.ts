export type Point = {
  x: number;
  y: number;
};

export type CtrlPoint = Point & {
  child: number[] | null;
};

export type CurveSetPoints = {
  pt1: Point;
  pt2: Point;
  pt3: Point;
  pt4: Point;
  pt5: Point;
  pt6: Point;
};