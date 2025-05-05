import { useState, useRef, useEffect, useCallback } from 'react';

const rad = 16;
const pointRad = 4;
const numPoints = 49;

type Point = {
  x: number;
  y: number;
};

type CtrlPoint = Point & {
  child: number[] | null;
};

const getBezierSegmentPoints = (
  p0: CtrlPoint,
  p1: CtrlPoint,
  p2: CtrlPoint,
  p3: CtrlPoint,
  num: number
) => {
  const temp = [];
  for (let i = 0; i <= num; i++) {
    const t = i / num;
    const x =
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * t * t * p2.x +
      t * t * t * p3.x;
    const y =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * t * t * p2.y +
      t * t * t * p3.y;

    temp.push({ x, y });
  }

  return temp;
};

const getBezierSplinePoints = (points: CtrlPoint[]) => {
  const n = (numPoints - 1) / 2;
  const [p0, p1, p2, p3, p5, p6] = points;
  const p4: CtrlPoint = {
    x: 2 * p3.x - p2.x,
    y: 2 * p3.y - p2.y,
    child: null,
  };
  const bezierPoints1 = getBezierSegmentPoints(p0, p1, p2, p3, n);
  const tempSet = getBezierSegmentPoints(p3, p4, p5, p6, n);

  // First point in tempSet is a redundant duplicate of last point in bezierPoints2
  // We can use array destructuring to throw out the first point in tempSet
  const [_omitDuplicate, ...bezierPoints2] = tempSet;

  return [...bezierPoints1, ...bezierPoints2];
};

const BeziControlsAlt = ({ wd, ht }: { wd: number; ht: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });
  const [dragIndex, setDragIndex] = useState(-1);
  const [childDeltas, setChildDeltas] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState<CtrlPoint[]>([
    { x: 50, y: 150, child: [1] },
    { x: 60, y: 100, child: null },
    { x: 200, y: 340, child: null },
    { x: 310, y: 180, child: [2, -1] },
    { x: 550, y: 150, child: null },
    { x: 560, y: 80, child: [4] },
  ]);

  const drawBezier = (pts: Point[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = '#ff0000';
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        ctx.lineTo(pts[j].x, pts[j].y);
      }
      ctx.stroke();
    }
  };

  const eraser = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const drawControls = () => {
      if (ctx) {
        points.forEach((pt) => {
          // Circle around anchors and control points
          ctx.strokeStyle = '#00ffff';
          ctx.fillStyle = '#00ffffff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pointRad, 0, 2 * Math.PI);
          ctx.stroke();
          if (pt.child !== null) {
            ctx.fill();
          }
          if (pt.child !== null) {
            // Circle from anchor to control point
            const childIndex = pt.child[0];
            const px = pt.x;
            const py = pt.y;
            const child0x = points[childIndex].x;
            const child0y = points[childIndex].y;
            const dx = px - child0x;
            const dy = py - child0y;
            const r = Math.sqrt(dx * dx + dy * dy);
            ctx.strokeStyle = '#00000020';
            ctx.beginPath();
            ctx.arc(px, py, r, 0, 2 * Math.PI);
            ctx.stroke();

            // Line from anchor to control point
            ctx.beginPath();
            ctx.strokeStyle = '#ff00ff';
            ctx.moveTo(px, py);
            ctx.lineTo(child0x, child0y);
            ctx.stroke();

            if (pt.child.length > 1) {
              // Line from anchor to unused control point
              const child1x = 2 * px - child0x;
              const child1y = 2 * py - child0y;
              ctx.beginPath();
              ctx.strokeStyle = '#ff00ff80';
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(child1x, child1y);
              ctx.stroke();

              // Circle around unused control point
              ctx.strokeStyle = '#ff00ff70';
              ctx.beginPath();
              ctx.arc(child1x, child1y, pointRad, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }
        });
      }
    };

    if (ctx) {
      eraser();
      drawControls();
      const splinePoints = getBezierSplinePoints(points);
      drawBezier(splinePoints);
    }
  }, [dragIndex, eraser, points]);

  const handleMouseDown = (ev) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ev.clientX - rect.left;
    const mouseY = ev.clientY - rect.top;

    const nearestIndex = getNearest(mouseX, mouseY);
    if (nearestIndex !== -1) {
      setDragIndex(nearestIndex);
      setOffsets({
        x: mouseX - points[nearestIndex].x,
        y: mouseY - points[nearestIndex].y,
      });

      if (points[nearestIndex].child !== null) {
        const j = points[nearestIndex].child[0];
        const x1 = points[nearestIndex].x;
        const x0 = points[j].x;
        const y1 = points[nearestIndex].y;
        const y0 = points[j].y;
        setChildDeltas({ x: x1 - x0, y: y1 - y0 });
      }
    }
  };

  const getNearest = (mouseX: number, mouseY: number) => {
    let dx = mouseX - points[0].x;
    let dy = mouseY - points[0].y;
    let d = Math.sqrt(dx * dx + dy * dy);
    let index = d <= rad ? 0 : -1;

    for (let i = 1; i < points.length; i++) {
      dx = mouseX - points[i].x;
      dy = mouseY - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < d) {
        d = dist;
        index = i;
      }
    }

    if (d <= rad) {
      return index;
    }

    return -1;
  };

  const handleMouseMove = (ev) => {
    if (dragIndex !== -1) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const mouseY = ev.clientY - rect.top;

      // Update coordinates of the current point
      const temp = points.map((pt, i) => {
        if (i !== dragIndex) {
          return pt;
        }
        return {
          ...pt,
          x: mouseX - offsets.x,
          y: mouseY - offsets.y,
        };
      });

      // Update coordinates of the current point's child if applicable
      const currentPoint = points[dragIndex];
      if (currentPoint.child !== null) {
        const childIndex = currentPoint.child[0];
        temp[childIndex].x = currentPoint.x - childDeltas.x;
        temp[childIndex].y = currentPoint.y - childDeltas.y;
      }

      setPoints(temp);
    }
  };

  const handleMouseUp = () => {
    setDragIndex(-1);
  };

  return (
    <canvas
      ref={canvasRef}
      width={wd}
      height={ht}
      style={{ border: '1px solid black' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default BeziControlsAlt;
