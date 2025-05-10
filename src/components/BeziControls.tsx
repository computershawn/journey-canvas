import { useState, useRef, useEffect, useCallback } from 'react';
import { getAllComps, getBezierSplinePoints } from '../utils/helpers';
import { CtrlPoint, CurveSetPoints, Point } from '../types';

const rad = 16;
const pointRad = 4;
const numPoints = 49;

const BeziControls = ({
  beziCtrlPts,
  setBeziCtrlPts,
  compIndex,
  wd,
  ht,
}: {
  beziCtrlPts: CtrlPoint[];
  setBeziCtrlPts: (pts: CtrlPoint[]) => void;
  compIndex: number;
  wd: number;
  ht: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offsets, setOffsets] = useState({ x: 0, y: 0 });
  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [childDeltas, setChildDeltas] = useState({ x: 0, y: 0 });

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
    const comps = getAllComps();
    const csp: CurveSetPoints = comps[compIndex].curveSetPoints;
    const temp: CtrlPoint[] = [
      { x: csp.pt1.x, y: csp.pt1.y, child: [1] },
      { x: csp.pt4.x, y: csp.pt4.y, child: null },
      { x: csp.pt5.x, y: csp.pt5.y, child: null },
      { x: csp.pt2.x, y: csp.pt2.y, child: [2, -1] },
      { x: csp.pt6.x, y: csp.pt6.y, child: null },
      { x: csp.pt3.x, y: csp.pt3.y, child: [4] },
    ];
    setBeziCtrlPts(temp);
  }, [compIndex, setBeziCtrlPts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const drawControls = () => {
      if (ctx) {
        beziCtrlPts.forEach((pt, i) => {
          // Circle around currently hovered point
          if (i === hoverIndex) {
            ctx.strokeStyle = '#00ffff';
            ctx.fillStyle = '#00ffff10';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, rad, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
          }
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
            const child0x = beziCtrlPts[childIndex].x;
            const child0y = beziCtrlPts[childIndex].y;
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
              ctx.fillStyle = '#ff00ff70';
              ctx.beginPath();
              ctx.arc(child1x, child1y, 0.5 * pointRad, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        });
      }
    };

    if (ctx && beziCtrlPts.length) {
      eraser();
      drawControls();
      const splinePoints = getBezierSplinePoints(beziCtrlPts, numPoints);
      drawBezier(splinePoints);
    }
  }, [eraser, hoverIndex, beziCtrlPts]);

  const handleMouseDown = (ev) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ev.clientX - rect.left;
    const mouseY = ev.clientY - rect.top;

    const nearestIndex = getNearest(mouseX, mouseY, rad);
    if (nearestIndex !== -1) {
      setDragIndex(nearestIndex);
      setOffsets({
        x: mouseX - beziCtrlPts[nearestIndex].x,
        y: mouseY - beziCtrlPts[nearestIndex].y,
      });

      if (beziCtrlPts[nearestIndex].child !== null) {
        const j = beziCtrlPts[nearestIndex].child[0];
        const x1 = beziCtrlPts[nearestIndex].x;
        const x0 = beziCtrlPts[j].x;
        const y1 = beziCtrlPts[nearestIndex].y;
        const y0 = beziCtrlPts[j].y;
        setChildDeltas({ x: x1 - x0, y: y1 - y0 });
      }
    }
  };

  const getNearest = (mouseX: number, mouseY: number, boundRadius: number) => {
    if (beziCtrlPts.length === 0) return -1;

    let dx = mouseX - beziCtrlPts[0].x;
    let dy = mouseY - beziCtrlPts[0].y;
    let d = Math.sqrt(dx * dx + dy * dy);
    let index = d <= boundRadius ? 0 : -1;

    for (let i = 1; i < beziCtrlPts.length; i++) {
      dx = mouseX - beziCtrlPts[i].x;
      dy = mouseY - beziCtrlPts[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < d) {
        d = dist;
        index = i;
      }
    }

    if (d <= boundRadius) {
      return index;
    }

    return -1;
  };

  const handleMouseMove = (ev) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ev.clientX - rect.left;
    const mouseY = ev.clientY - rect.top;
    const temp = getNearest(mouseX, mouseY, rad);
    setHoverIndex(temp);

    if (dragIndex !== -1) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ev.clientX - rect.left;
      const mouseY = ev.clientY - rect.top;

      // Update coordinates of the current point
      const temp = beziCtrlPts.map((pt, i) => {
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
      const currentPoint = beziCtrlPts[dragIndex];
      if (currentPoint.child !== null) {
        const childIndex = currentPoint.child[0];
        temp[childIndex].x = currentPoint.x - childDeltas.x;
        temp[childIndex].y = currentPoint.y - childDeltas.y;
      }

      setBeziCtrlPts(temp);
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
      style={{ border: '1px solid black', display: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default BeziControls;
