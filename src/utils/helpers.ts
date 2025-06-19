/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// EASING FUNCTIONS
export const easeInCubic = (t) => {
  return t * t * t;
};

export const easeInQuad = (t) => {
  return t * t;
};

// TAKE A VALUE AND OUTPUT A RANDOM NEW VALUE WITHIN +/- RANGE
export const wobble = (val, range) => {
  const dir = Math.random() > 0.5 ? 1 : -1;
  const variance = 1.0 + dir * Math.random() * range;
  const wob = variance * val;
  if (wob < 0 || wob > 1.0) {
    return val;
  }

  return wob;
};

// CALCULATE THE X/Y COORDINATES ALONG AN ARC
export const getArcPoints = (arcAngle, numPoints, r, cx = 0, cy = 0) => {
  const temp = [];
  for (let i = 0; i < numPoints; i++) {
    const a = ((2 * i) / numPoints) * arcAngle - arcAngle - Math.PI / 2;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a) + r;
    const vec = { x: cx + x, y: cy + y };
    temp.push(vec);
  }

  return temp;
};

// GET RANDOM INDEX OF ITEM IN ARRAY
export const getRandomIndex = (len: number) => {
  return Math.floor(Math.random() * len);
};

// JUMP TO A SPECIFIC FRAME NUMBER IN THE UNFURLY ANIMATION
export const goToFrameNumber = (frameNum) => {
  if (animationMode === 1) {
    currentCycleFrame = frameNum % durationFrames;
  }
};

// SAVE SETTINGS OF CURRENT COMPOSITION
export const saveComp = () => {
  const comps = getAllComps();

  const diffValue = document.querySelector('#diff').value;
  const balanceValue = document.querySelector('#balance').value;
  const frameValue = document.querySelector('#frame-number').value;

  const curveSetPoints = {
    pt1: { x: bezi.cs.anchor11.c.x, y: bezi.cs.anchor11.c.y },
    pt2: { x: bezi.cs.anchor12.c.x, y: bezi.cs.anchor12.c.y },
    pt3: { x: bezi.cs.anchor22.c.x, y: bezi.cs.anchor22.c.y },
    pt4: { x: bezi.cs.ctrl11.c.x, y: bezi.cs.ctrl11.c.y },
    pt5: { x: bezi.cs.ctrl12.c.x, y: bezi.cs.ctrl12.c.y },
    pt6: { x: bezi.cs.ctrl22.c.x, y: bezi.cs.ctrl22.c.y },
  };

  settings = {
    id: uniqueID(),
    balance: balanceValue,
    currentCycleFrame: frameValue,
    diff: diffValue,
    curveSetPoints,
  };

  comps.push(settings);
  window.localStorage.setItem('saved_comps', JSON.stringify(comps));

  return comps.length;
};

// REMOVE COMPOSITION SETTINGS
export const removeComp = (compID) => {
  const comps = getAllComps();
  const updatedComps = comps.filter((item) => item.id !== compID);

  window.localStorage.setItem('saved_comps', JSON.stringify(updatedComps));
};

export const getAllComps = () => {
  const savedComps = window.localStorage.getItem('saved_comps');

  if (!savedComps) {
    return [];
  }

  return JSON.parse(savedComps);
};

export const getComp = (compObj) => {
  const keys = Object.keys(compObj);
  const hasAllKeys = [
    'balance',
    'currentCycleFrame',
    'diff',
    'id',
    'curveSetPoints',
  ].every((item) => keys.includes(item));

  if (hasAllKeys) {
    return {
      storedBalance: compObj.balance,
      storedCycleFrame: compObj.currentCycleFrame,
      storedDiff: compObj.diff,
      curveSetPoints: compObj.curveSetPoints,
    };
  }

  return {};
};

// DROPDOWN
export const toggleDropdown = () => {
  document.getElementById('comp-select').classList.toggle('show');
};

// CLOSE THE DROPDOWN IF THE USER CLICKS OUTSIDE OF IT
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// CREATE UNIQUE ID
export const uniqueID = () => {
  const chars = '0123456789abcdef';
  const len = chars.length;
  let id = '';
  for (let i = 0; i < 8; i++) {
    const i = getRandomIndex(len);
    const c = chars[i];
    id += c;
  }

  return id;
};

// export const getColors = async () => {
//   const colorsUrl =
//     'https://raw.githubusercontent.com/Jam3/nice-color-palettes/master/1000.json';
//   const data = await fetch(colorsUrl).then((res) => res.json());
//   return data;
// };

export const initPalette = async () => {
  const allCo = await getColors();
  // document.getElementById("start-btn").disabled = false;

  return allCo;
};

export const pickPalette = (allColorsArray) => {
  const randomIndex = getRandomIndex(allColorsArray.length);
  const temp = allColorsArray[randomIndex];

  const swatchDivs = document.querySelectorAll('.swatch');
  swatchDivs.forEach((s, i) => {
    s.style.backgroundColor = temp[i];
  });

  return temp;
};

export const renderFan = (fanBladesArr, nullRefs) => {
  // Draw our lines based on the updated references
  for (let j = 0; j < nullRefs.length - 1; j++) {
    const thisRef = nullRefs[j];
    const nextRef = nullRefs[j + 1];

    const px0 = thisRef.point0.x + thisRef.x;
    const py0 = thisRef.point0.y + thisRef.y;
    const px1 = thisRef.point1.x + thisRef.x;
    const py1 = thisRef.point1.y + thisRef.y;
    const px2 = nextRef.point1.x + nextRef.x;
    const py2 = nextRef.point1.y + nextRef.y;
    const px3 = nextRef.point0.x + nextRef.x;
    const py3 = nextRef.point0.y + nextRef.y;

    // const co = color(lerpColor(color(239), white, values[i]), 223);
    // const co = color(255, 239);
    const fb = fanBladesArr[j];
    const pv0 = { x: px0, y: py0 };
    const pv1 = { x: px1, y: py1 };
    const pv2 = { x: px2, y: py2 };
    const pv3 = { x: px3, y: py3 };

    fb.update(pv0, pv1, pv2, pv3);
    fb.render();
    // noLoop();
  }
};

export const mapTo = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  const amount = value / (fromMax - fromMin);

  return toMin + amount * (toMax - toMin);
};

export const throttle = (callback, interval) => {
  let enableCall = true;

  return function (...args) {
    if (!enableCall) return;

    enableCall = false;
    callback.apply(this, args);
    setTimeout(() => (enableCall = true), interval);
  };
};
