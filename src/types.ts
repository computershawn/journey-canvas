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

export type Pt = {
  x: number;
  y: number;
}

export type Quad = {
  pt0: Pt,
  pt1: Pt,
  pt2: Pt,
  pt3: Pt,
};