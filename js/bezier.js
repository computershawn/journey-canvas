const beziCanv = document.getElementById("bezier-geom");
const bezictx = beziCanv.getContext("2d");

const uiCanv = document.getElementById('bezier-ctrl');
const uictx = uiCanv.getContext("2d");


const numPoints = 41;
const dragRadius = 12;
const beziCtrl = [];
beziCtrl.push({x: 60, y: 360, child: [1]});
beziCtrl.push({x: 300, y: 520, child: null});
beziCtrl.push({x: 440, y: 240, child: null});
beziCtrl.push({x: 640, y: 440, child: [2, -1]});
beziCtrl.push({x: 840, y: 480, child: null});
beziCtrl.push({x: 1220, y: 360, child: [4]});

// Draggy logic
let currentHandle = null;
let dragging = false;
const startPoints = {x: 0, y: 0};
let offsetX = 0;
let offsetY = 0;

// Returns x/y coordinates of a point along a bezier curve.
function cubic(p0, p1, p2, p3, t) {
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

const drawGuides = () => {
  if (uiCanv.getContext) {
    beziCtrl.forEach((ctrl, i) => {
      if (ctrl.child !== null) {
        const childIndex = ctrl.child[0];
        const px = beziCtrl[i].x;
        const py = beziCtrl[i].y
        const child0x = beziCtrl[childIndex].x;
        const child0y = beziCtrl[childIndex].y;
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
          uictx.arc(child1x, child1y, dragRadius, 0, 2 * Math.PI);
          uictx.stroke();
        }
      }
    })

    beziCtrl.forEach(shape => {
      uictx.strokeStyle = '#00ffff'; // shape.child ? '#00ffff' : '#00ff80';
      uictx.fillStyle = '#00ffff20'; // shape.child ? '#00ffff' : '#00ff80';
      uictx.beginPath();
      uictx.arc(shape.x, shape.y, dragRadius, 0, 2 * Math.PI);
      uictx.stroke();
      if (shape.child) {
        uictx.fill();
      }
    });
  }
};

const getBezierSegmentPoints = (p0, p1, p2, p3, num) => {
  const temp = [];
  for (let i = 0; i <= num; i++) {
    const t = i / num;
    const coords = cubic(p0, p1, p2, p3, t);
    temp.push(coords);
  }

  return temp;
};

const clearCanvas = () => {
  const wd = beziCanv.width;
  const ht = beziCanv.height;
  uictx.clearRect(0, 0, wd, ht);
  bezictx.clearRect(0, 0, wd, ht);
};

const drawBezier = (pts) => {
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

const getCanvasOffsets = () => {
  const offsets = uiCanv.getBoundingClientRect();
  offsetX = offsets.left;
  // THE offsets.top VALUE DOESN'T TAKE INTO ACCOUNT THE 'load comp' BUTTON,
  // WHICH IS 32px HIGH. THIS IS PROBABLY BECAUSE THAT BUTTON IS ADDED TO THE
  // DOM PROGRAMMATICALLY. ONE JANKY OPTION IS TO ADD 32px TO offsetY.
  const loadCompBtnHeight = 32;
  offsetY = offsets.top + loadCompBtnHeight;
};

getCanvasOffsets();
window.onscroll = () => {
  getCanvasOffsets();
};
window.onresize = () => {
  getCanvasOffsets();
};

const isMouseHover = (x, y, shape) => {
  const shapeLeft = shape.x - dragRadius;
  const shapeRight = shape.x + dragRadius;
  const shapeTop = shape.y - dragRadius;
  const shapeBottom = shape.y + dragRadius;
  
  if (
    x > shapeLeft &&
    x < shapeRight &&
    y > shapeTop &&
    y < shapeBottom
  ) {
    return true;
  }
  return false;
};

const render = () => {
  const bezierPoints = getBezierSplinePoints(numPoints);

  clearCanvas();
  drawBezier(bezierPoints);
  drawGuides();
};

const getBezierSplinePoints = (numberOfPoints) => {
  const n = (numberOfPoints - 1) / 2;
  const [p0, p1, p2, p3, p5, p6] = beziCtrl;
  const p4 = { x: 2 * p3.x - p2.x, y: 2 * p3.y - p2.y };
  const bezierPoints1 = getBezierSegmentPoints(p0, p1, p2, p3, n);
  const tempSet = getBezierSegmentPoints(p3, p4, p5, p6, n);
  // First point in tempSet is a redundant duplicate of last point in bezierPoints2
  // We can use array destructuring to throw out the first point in tempSet
  const [_omitDuplicate, ...bezierPoints2] = tempSet;

  return [...bezierPoints1, ...bezierPoints2];
};

const handleMouseDown = (evt) => {
  evt.preventDefault();
  startPoints.x = parseInt(evt.clientX - offsetX);
  startPoints.y= parseInt(evt.clientY - offsetY);
  
  for (let i = beziCtrl.length - 1; i >= 0; i--) {
    const shape = beziCtrl[i];
    if (isMouseHover(startPoints.x, startPoints.y, shape)) {
      currentHandleIndex = i;
      dragging = true;
      return;
    }
  };
};

const handleMouseUp = (evt) => {
  evt.preventDefault();
  if (!dragging) {
    return;
  }
  dragging = false;
  currentHandleIndex = null;

  const numFanBlades = 385;
  const temp = getBezierSplinePoints(numFanBlades);
  console.log(`${numFanBlades} Bezier spline points:`);
  // Use this array to redraw the fan whenever the spline is modified
};

const handleMouseOut = (evt) => {
  evt.preventDefault();
  if (!dragging) {
    return;
  }
  dragging = false;
};

const handleMouseMove = (evt) => {
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

  render();
}

uiCanv.onmousedown = handleMouseDown;
uiCanv.onmouseup = handleMouseUp;
uiCanv.onmouseout = handleMouseOut;
uiCanv.onmousemove = throttle(handleMouseMove, 50);

render();
