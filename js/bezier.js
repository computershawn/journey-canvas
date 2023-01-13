const beziCanv = document.getElementById("bezier-geom");
const bezictx = beziCanv.getContext("2d");

const uiCanv = document.getElementById('bezier-ctrl');
const uictx = uiCanv.getContext("2d");


const numPoints = 65;
const n = (numPoints - 1) / 2;
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
        uictx.lineWidth = 1;
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
      uictx.strokeStyle = shape.child ? '#00ffff' : '#00ff80';
      uictx.lineWidth = shape.child ? 2 : 1;
      uictx.beginPath();
      uictx.arc(shape.x, shape.y, dragRadius, 0, 2 * Math.PI);
      uictx.stroke();
    });
  }
};

const getBezierPoints = (p0, p1, p2, p3, num) => {
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
    bezictx.fillStyle = '#ff0000';
    pts.forEach((pt) => {
      bezictx.beginPath();
      bezictx.arc(pt.x, pt.y, 1.5, 0, 2 * Math.PI);
      bezictx.fill();
    });
  }
};

const getOffsets = () => {
  const offsets = uiCanv.getBoundingClientRect();
  offsetX = offsets.left;
  offsetY = offsets.top;
};

getOffsets();
window.onscroll = () => {
  getOffsets();
};
window.onresize = () => {
  getOffsets();
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

  // drawGuides();
  startPoints.x = mouseX;
  startPoints.y = mouseY;
  
  render();
}

uiCanv.onmousedown = handleMouseDown;
uiCanv.onmouseup = handleMouseUp;
uiCanv.onmouseout = handleMouseOut;
uiCanv.addEventListener('mousemove', throttle(handleMouseMove, 50));

const render = () => {
  const [p0, p1, p2, p3, p5, p6] = beziCtrl;
  const p4 = { x: 2 * p3.x - p2.x, y: 2 * p3.y - p2.y };
  const bezierPoints1 = getBezierPoints(p0, p1, p2, p3, n);
  const bezierPoints2 = getBezierPoints(p3, p4, p5, p6, n);
  const omitIndex = bezierPoints1.length;
  const bezierPoints = [...bezierPoints1, ...bezierPoints2].filter(
    (_item, index) => index !== omitIndex
  );

  clearCanvas();
  drawBezier(bezierPoints, omitIndex);
  drawGuides();
};

function throttle(callback, interval) {
  let enableCall = true;

  return function(...args) {
    if (!enableCall) return;

    enableCall = false;
    callback.apply(this, args);
    setTimeout(() => enableCall = true, interval);
  }
}

render();
