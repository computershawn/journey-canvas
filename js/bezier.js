class BeziSpline {
  constructor(_curveSetPoints = {}, _onChangeBezier = () => {}) {
    console.log('_curveSetPoints', _curveSetPoints);
    this.beziCanv = document.getElementById("bezier-geom");
    this.bezictx = this.beziCanv.getContext("2d");
    
    this.uiCanv = document.getElementById('bezier-ctrl');
    this.uictx = this.uiCanv.getContext("2d");

    this.numPoints = 49;
    this.dragRadius = 12;
    const temp = [];
    temp.push({ x: 60, y: 360, child: [1] });
    temp.push({ x: 300, y: 520, child: null });
    temp.push({ x: 440, y: 240, child: null });
    temp.push({ x: 640, y: 440, child: [2, -1] });
    temp.push({ x: 840, y: 480, child: null });
    temp.push({ x: 1220, y: 360, child: [4] });
    this.beziCtrl = temp;

    this.dragging = false;
    this.startPoints = { x: 0, y: 0 };

    // THE offsets.top VALUE DOESN'T TAKE INTO ACCOUNT THE 'load comp' BUTTON,
    // WHICH IS 32px HIGH. THIS IS PROBABLY BECAUSE THAT BUTTON IS ADDED TO THE
    // DOM PROGRAMMATICALLY. ONE JANKY OPTION IS TO ADD 32px TO offsetY.
    const offsets = this.uiCanv.getBoundingClientRect();
    // const loadCompBtnHeight = 32;
    this.offsetX = offsets.left;
    this.offsetY = offsets.top; //  + loadCompBtnHeight;
    this.onChangeBezier = _onChangeBezier;
    console.log(this.onChangeBezier);

    this.uiCanv.addEventListener('mousedown', (evt) => {
      const {
        beziCtrl,
        offsetX,
        offsetY,
        startPoints,
      } = this;

      evt.preventDefault();
      startPoints.x = parseInt(evt.clientX - offsetX);
      startPoints.y = parseInt(evt.clientY - offsetY);
    
      for (let i = beziCtrl.length - 1; i >= 0; i--) {
        const shape = beziCtrl[i];
        const {dragRadius} = this;
        const areaLeft = shape.x - dragRadius;
        const areaRight = shape.x + dragRadius;
        const areaTop = shape.y - dragRadius;
        const areaBottom = shape.y + dragRadius;

        if (
          startPoints.x > areaLeft &&
          startPoints.x < areaRight &&
          startPoints.y > areaTop &&
          startPoints.y < areaBottom
        ) {
          this.currentHandleIndex = i;
          this.dragging = true;
          return;
        }
      };
    });

    this.uiCanv.addEventListener('mouseup', (evt) => {
      let {
        currentHandleIndex,
        dragging,
      } = this;

      const {
        onChangeBezier,
      } = this;


      evt.preventDefault();
      if (!dragging) {
        return;
      }
      this.dragging = false;
      this.currentHandleIndex = null;

      const temp = this.getBezierSplinePoints(numFanBlades);
      onChangeBezier(temp);
      // Run callback onChangeBezier whenever the spline is modified
    });
    
    this.uiCanv.addEventListener('mouseout', (evt) => {
      evt.preventDefault();
      let { dragging } = this;
      if (!dragging) {
        return;
      }
      dragging = false;
    });
    
    this.uiCanv.addEventListener('mousemove', throttle((evt) => {
      const {
        beziCtrl,
        currentHandleIndex,
        dragging,
        offsetX,
        offsetY,
        startPoints,
      } = this;
      evt.preventDefault();
    
      if (!dragging) {
        return;
      }
    
      const mouseX = parseInt(evt.clientX - offsetX);
      const mouseY = parseInt(evt.clientY - offsetY);
    
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
        if (ctrl.child !== null) {
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
  
          uictx.beginPath();
          uictx.strokeStyle = "#ff00ff";
          uictx.moveTo(px, py);
          uictx.lineTo(child0x, child0y);
          uictx.stroke();
  
          if (ctrl.child.length > 1) {
            const child1x = 2 * px - child0x;
            const child1y = 2 * py - child0y;
            uictx.beginPath();
            uictx.strokeStyle = "#ff00ff80";
            uictx.moveTo(beziCtrl[i].x, beziCtrl[i].y);
            uictx.lineTo(child1x, child1y);
            uictx.stroke();
  
            uictx.strokeStyle = '#ffff0070';
            uictx.beginPath();
            uictx.arc(child1x, child1y, this.dragRadius, 0, 2 * PI);
            uictx.stroke();
          }
        }
      })
  
      beziCtrl.forEach(shape => {
        uictx.strokeStyle = '#00ffff';
        uictx.fillStyle = '#00ffff20';
        uictx.beginPath();
        uictx.arc(shape.x, shape.y, this.dragRadius, 0, 2 * PI);
        uictx.stroke();
        if (shape.child) {
          uictx.fill();
        }
      });
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

  clearCanvas() {
    this.uictx.clearRect(0, 0, wd, ht);
    this.bezictx.clearRect(0, 0, wd, ht);
  };
  
  drawBezier(pts) {
    const {beziCanv, bezictx} = this;
    if (beziCanv.getContext) {
      bezictx.beginPath();
      bezictx.strokeStyle = '#ff0000';
      bezictx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length; j++) {
        bezictx.lineTo(pts[j].x, pts[j].y);
      }
      bezictx.stroke();
    }
  };

  render() {
    const bezierPoints = this.getBezierSplinePoints(this.numPoints);
  
    this.clearCanvas();
    this.drawBezier(bezierPoints);
    this.drawGuides();
  };
}
