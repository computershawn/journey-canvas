import { useEffect, useMemo, useRef } from 'react';

const numPoints = 49;
const hoverRadius = 24;
const pointRadius = 3;

type ControlPoint = {
  x: number;
  y: number;
  child: number[] | null;
};

const BeziControlsOLD = ({ curveSetPoints }) => {
  const uiCanvRef = useRef<HTMLCanvasElement | null>(null);
  const { pt1, pt2, pt3, pt4, pt5, pt6 } = curveSetPoints;

  const beziCtrlPts: ControlPoint[] = useMemo(
    () => [
      { x: pt1.x, y: pt1.y, child: [1] },
      { x: pt2.x, y: pt2.y, child: null },
      { x: pt3.x, y: pt3.y, child: null },
      { x: pt4.x, y: pt4.y, child: [2, -1] },
      { x: pt5.x, y: pt5.y, child: null },
      { x: pt6.x, y: pt6.y, child: [4] },
    ],
    [pt1, pt2, pt3, pt4, pt5, pt6]
  );

  useEffect(() => {
    const uiCanv = uiCanvRef?.current;
    if (uiCanv !== null) {
      const uiCtx = uiCanv.getContext('2d');
      if (uiCtx !== null) {
        uiCtx.strokeStyle = 'blue';
        beziCtrlPts.forEach((ctrl, i) => {
          const currentHoverIndex = 0; // <- Temporary
          if (i === currentHoverIndex) {
            uiCtx.strokeStyle = '#00ffff';
            uiCtx.fillStyle = '#00ffff10';
            uiCtx.beginPath();
            uiCtx.arc(ctrl.x, ctrl.y, hoverRadius, 0, 2 * Math.PI);
            uiCtx.stroke();
            uiCtx.fill();
          }

          // Circle around anchors and control points
          uiCtx.strokeStyle = '#00ffff';
          uiCtx.fillStyle = '#00ffffff';
          uiCtx.beginPath();
          uiCtx.arc(ctrl.x, ctrl.y, pointRadius, 0, 2 * Math.PI);
          uiCtx.stroke();
          if (ctrl.child) {
            uiCtx.fill();
          }

          if (ctrl.child !== null) {
            // Circle from anchor to control point
            const childIndex = ctrl.child[0];
            const px = beziCtrlPts[i].x;
            const py = beziCtrlPts[i].y;
            const child0x = beziCtrlPts[childIndex].x;
            const child0y = beziCtrlPts[childIndex].y;
            const dx = px - child0x;
            const dy = py - child0y;
            const r = Math.sqrt(dx * dx + dy * dy);
            uiCtx.strokeStyle = '#00000020';
            uiCtx.beginPath();
            uiCtx.arc(px, py, r, 0, 2 * Math.PI);
            uiCtx.stroke();

            // Line from anchor to control point
            uiCtx.beginPath();
            uiCtx.strokeStyle = '#ff00ff';
            uiCtx.moveTo(px, py);
            uiCtx.lineTo(child0x, child0y);
            uiCtx.stroke();

            if (ctrl.child.length > 1) {
              // Line from anchor to unused control point
              const child1x = 2 * px - child0x;
              const child1y = 2 * py - child0y;
              uiCtx.beginPath();
              uiCtx.strokeStyle = '#ff00ff80';
              uiCtx.moveTo(beziCtrlPts[i].x, beziCtrlPts[i].y);
              uiCtx.lineTo(child1x, child1y);
              uiCtx.stroke();

              // Circle around unused control point
              uiCtx.strokeStyle = '#ff00ff70';
              uiCtx.beginPath();
              uiCtx.arc(child1x, child1y, pointRadius, 0, 2 * Math.PI);
              uiCtx.stroke();
            }
          }
        });
      }
    }
  }, [beziCtrlPts]);

  return (
    <canvas
      width='1280'
      height='720'
      ref={uiCanvRef}
      style={{ position: 'absolute', top: 0, left: 300 }}
    >
      Your browser does not support the HTML canvas tag.
    </canvas>
  );
};

export default BeziControlsOLD;

/*
class BeziSpline {
  constructor(_curveSetPoints = {}, _onChangeBezier = () => {}) {
    this.uiCanv = document.getElementById('bezier-ctrl');
    this.uictx = this.uiCanv.getContext("2d");

    this.numPoints = 49;
    // this.dragRadius = 12;
    const temp = [];

    const {
      pt1, pt2, pt3, pt4, pt5, pt6
    } = _curveSetPoints;

    temp.push({ x: pt1.x, y: pt1.y, child: [1] });
    temp.push({ x: pt4.x, y: pt4.y, child: null });
    temp.push({ x: pt5.x, y: pt5.y, child: null });
    temp.push({ x: pt2.x, y: pt2.y, child: [2, -1] });
    temp.push({ x: pt6.x, y: pt6.y, child: null });
    temp.push({ x: pt3.x, y: pt3.y, child: [4] });
    this.beziCtrl = temp;

    this.dragging = false;
    this.currentHandleIndex = null;
    this.currentHoverIndex = null;
    this.startPoints = { x: 0, y: 0 };
    this.pointRadius = 3;
    this.hoverRadius = 24;

    const offsets = this.uiCanv.getBoundingClientRect();
    this.xOffset = offsets.left;
    this.yOffset = offsets.top;
    this.onChangeBezier = _onChangeBezier;

    this.uiCanv.addEventListener('mousedown', (evt) => {
      const {
        beziCtrl,
        hoverRadius,
        xOffset,
        yOffset,
        startPoints,
      } = this;

      evt.preventDefault();
      startPoints.x = parseInt(evt.clientX - xOffset);
      startPoints.y = parseInt(evt.clientY - yOffset);
    
      for (let i = beziCtrl.length - 1; i >= 0; i--) {
        const shape = beziCtrl[i];
        const hoverAreaLeft = shape.x - hoverRadius;
        const hoverAreaRight = shape.x + hoverRadius;
        const hoverAreaTop = shape.y - hoverRadius;
        const hoverAreaBottom = shape.y + hoverRadius;

        if (
          startPoints.x > hoverAreaLeft &&
          startPoints.x < hoverAreaRight &&
          startPoints.y > hoverAreaTop &&
          startPoints.y < hoverAreaBottom
        ) {
          this.currentHandleIndex = i;
          this.dragging = true;
          return;
        }
      };
    });

    this.uiCanv.addEventListener('mouseup', (evt) => {
      evt.preventDefault();
      if (!this.dragging) {
        return;
      }
      this.dragging = false;
      this.currentHandleIndex = null;

      // Run callback onChangeBezier whenever the spline is modified
      const temp = this.getBezierSplinePoints(numLoops);
      this.onChangeBezier(temp);
    });
    
    this.uiCanv.addEventListener('mouseout', (evt) => {
      evt.preventDefault();
      if (!this.dragging) {
        return;
      }
      this.currentHoverIndex = null;
      this.currentHandleIndex = null;
      this.dragging = false;
    });
    
    this.uiCanv.addEventListener('mousemove', throttle((evt) => {
      const {
        beziCtrl,
        currentHandleIndex,
        dragging,
        xOffset,
        yOffset,
        startPoints,
      } = this;
      evt.preventDefault();
      this.checkHoverIndex(evt);
    
      if (!dragging) {
        return;
      }
    
      const mouseX = parseInt(evt.clientX - xOffset);
      const mouseY = parseInt(evt.clientY - yOffset);
    
      const dx = mouseX - startPoints.x;
      const dy = mouseY - startPoints.y;
    
      const currentHandle = beziCtrl[currentHandleIndex];
      currentHandle.x += dx;
      currentHandle.y += dy;
    
      // Move an anchor's control point if present
      if (currentHandle.child !== null) {
        const index = currentHandle.child[0];
        beziCtrl[index].x += dx;
        beziCtrl[index].y += dy;
      }
    
      startPoints.x = mouseX;
      startPoints.y = mouseY;
    
      this.render();
    }, 25));
  }

  // Returns x/y coordinates of a point along a bezier curve.
  cubic(p0, p1, p2, p3, t) {
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

    return { x, y };
  }

  drawGuides() {
    const {
      beziCtrl,
      uictx
    } = this;
    if (uictx) {
      beziCtrl.forEach((ctrl, i) => {
        // Circle around currently hovered point
        if (i === this.currentHoverIndex) {
          uictx.strokeStyle = '#00ffff';
          uictx.fillStyle = '#00ffff10';
          uictx.beginPath();
          uictx.arc(ctrl.x, ctrl.y, this.hoverRadius, 0, 2 * PI);
          uictx.stroke();
          uictx.fill();
        }

        // Circle around anchors and control points
        uictx.strokeStyle = '#00ffff';
        uictx.fillStyle = '#00ffffff';
        uictx.beginPath();
        uictx.arc(ctrl.x, ctrl.y, this.pointRadius, 0, 2 * PI);
        uictx.stroke();
        if (ctrl.child) {
          uictx.fill();
        }

        if (ctrl.child !== null) {
          // Circle from anchor to control point
          const childIndex = ctrl.child[0];
          const px = beziCtrl[i].x;
          const py = beziCtrl[i].y
          const child0x = beziCtrl[childIndex].x;
          const child0y = beziCtrl[childIndex].y;
          const dx = px - child0x;
          const dy = py - child0y;
          const r = Math.sqrt(dx * dx + dy * dy);
          uictx.strokeStyle = '#00000020';
          uictx.beginPath();
          uictx.arc(px, py, r, 0, 2 * PI);
          uictx.stroke();
  
          // Line from anchor to control point
          uictx.beginPath();
          uictx.strokeStyle = "#ff00ff";
          uictx.moveTo(px, py);
          uictx.lineTo(child0x, child0y);
          uictx.stroke();

          if (ctrl.child.length > 1) {
            // Line from anchor to unused control point
            const child1x = 2 * px - child0x;
            const child1y = 2 * py - child0y;
            uictx.beginPath();
            uictx.strokeStyle = "#ff00ff80";
            uictx.moveTo(beziCtrl[i].x, beziCtrl[i].y);
            uictx.lineTo(child1x, child1y);
            uictx.stroke();
  
            // Circle around unused control point
            uictx.strokeStyle = '#ff00ff70';
            uictx.beginPath();
            uictx.arc(child1x, child1y, this.pointRadius, 0, 2 * PI);
            uictx.stroke();
          }
        }
      })
    }
  };

  getBezierSegmentPoints(p0, p1, p2, p3, num) {
    const temp = [];
    for (let i = 0; i <= num; i++) {
      const t = i / num;
      const coords = this.cubic(p0, p1, p2, p3, t);
      temp.push(coords);
    }
  
    return temp;
  };

  getBezierSplinePoints(numberOfPoints) {
    const n = (numberOfPoints - 1) / 2;
    const [p0, p1, p2, p3, p5, p6] = this.beziCtrl;
    const p4 = { x: 2 * p3.x - p2.x, y: 2 * p3.y - p2.y };
    const bezierPoints1 = this.getBezierSegmentPoints(p0, p1, p2, p3, n);
    const tempSet = this.getBezierSegmentPoints(p3, p4, p5, p6, n);
    // First point in tempSet is a redundant duplicate of last point in bezierPoints2
    // We can use array destructuring to throw out the first point in tempSet
    const [_omitDuplicate, ...bezierPoints2] = tempSet;
  
    return [...bezierPoints1, ...bezierPoints2];
  };

  clearCanvas(canv = null) {
    if (canv) {
      if (Array.isArray(canv)) {
        canv.forEach(c => {
          c.clearRect(0, 0, wd, ht);
          c.clearRect(0, 0, wd, ht);
        });
      } else {
        canv.clearRect(0, 0, wd, ht);
      }
    }
  };
  
  checkHoverIndex(evt) {
    const {
      beziCtrl,
      xOffset,
      yOffset,
    } = this;

    for (let i = beziCtrl.length - 1; i >= 0; i--) {
      const mouseX = parseInt(evt.clientX - xOffset);
      const mouseY = parseInt(evt.clientY - yOffset);
  
      const shape = beziCtrl[i];
      const hoverAreaLeft = shape.x - this.hoverRadius;
      const hoverAreaRight = shape.x + this.hoverRadius;
      const hoverAreaTop = shape.y - this.hoverRadius;
      const hoverAreaBottom = shape.y + this.hoverRadius;
  
      if (
        mouseX > hoverAreaLeft &&
        mouseX < hoverAreaRight &&
        mouseY > hoverAreaTop &&
        mouseY < hoverAreaBottom
      ) {
        if (this.currentHoverIndex !== i) {
          this.currentHoverIndex = i;
          // Re-render Bezier controls
          this.clearCanvas(this.uictx);
          this.drawGuides();
        }
        return;
      }
    };

    if (this.currentHoverIndex !== null && !this.dragging) {
      this.currentHoverIndex = null;
      // Re-render Bezier controls
      this.clearCanvas(this.uictx);
      this.drawGuides();
    }
  }

  render() {
    this.clearCanvas([this.uictx]);
    this.drawGuides();
  };
}
*/
