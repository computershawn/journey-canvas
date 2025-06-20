import { CompValues } from '../types';

// EASING FUNCTIONS
// export const easeInCubic = (t: number) => {
//   return t * t * t;
// };

// export const easeInQuad = (t: number) => {
//   return t * t;
// };

// TAKE A VALUE AND OUTPUT A RANDOM NEW VALUE WITHIN +/- RANGE
export const wobble = (val: number, range: number) => {
  const dir = Math.random() > 0.5 ? 1 : -1;
  const variance = 1.0 + dir * Math.random() * range;
  const wob = variance * val;
  if (wob < 0 || wob > 1.0) {
    return val;
  }

  return wob;
};

// CALCULATE THE X/Y COORDINATES ALONG AN ARC
export const getArcPoints = (
  arcAngle: number,
  numPoints: number,
  r: number,
  cx = 0,
  cy = 0
) => {
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
// export const goToFrameNumber = (frameNum: number) => {
//   if (animationMode === 1) {
//     currentCycleFrame = frameNum % durationFrames;
//   }
// };

// REMOVE COMPOSITION SETTINGS
export const removeComp = (compID: string) => {
  const temp = [...getAllComps()];
  const updatedComps = temp.filter((item) => item.id !== compID);

  window.localStorage.setItem('saved_comps', JSON.stringify(updatedComps));
};

export const getAllComps = (): CompValues[] => {
  const savedComps = window.localStorage.getItem('saved_comps') || '';
  const parsed = JSON.parse(savedComps);

  return (savedComps ? parsed : []) as CompValues[];
};

// DROPDOWN
// export const toggleDropdown = () => {
//   document.getElementById('comp-select').classList.toggle('show');
// };

// CLOSE THE DROPDOWN IF THE USER CLICKS OUTSIDE OF IT
// window.onclick = function (event) {
//   if (!event.target.matches('.dropbtn')) {
//     const dropdowns = document.getElementsByClassName('dropdown-content');
//     for (let i = 0; i < dropdowns.length; i++) {
//       const openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };

// export const initPalette = async () => {
//   const allCo = await getColors();

//   return allCo;
// };

// export const pickPalette = (allColorsArray) => {
//   const randomIndex = getRandomIndex(allColorsArray.length);
//   const temp = allColorsArray[randomIndex];

//   const swatchDivs = document.querySelectorAll('.swatch');
//   swatchDivs.forEach((s, i) => {
//     s.style.backgroundColor = temp[i];
//   });

//   return temp;
// };

// export const renderFan = (fanBladesArr, nullRefs) => {
//   // Draw our lines based on the updated references
//   for (let j = 0; j < nullRefs.length - 1; j++) {
//     const thisRef = nullRefs[j];
//     const nextRef = nullRefs[j + 1];

//     const px0 = thisRef.point0.x + thisRef.x;
//     const py0 = thisRef.point0.y + thisRef.y;
//     const px1 = thisRef.point1.x + thisRef.x;
//     const py1 = thisRef.point1.y + thisRef.y;
//     const px2 = nextRef.point1.x + nextRef.x;
//     const py2 = nextRef.point1.y + nextRef.y;
//     const px3 = nextRef.point0.x + nextRef.x;
//     const py3 = nextRef.point0.y + nextRef.y;

//     const fb = fanBladesArr[j];
//     const pv0 = { x: px0, y: py0 };
//     const pv1 = { x: px1, y: py1 };
//     const pv2 = { x: px2, y: py2 };
//     const pv3 = { x: px3, y: py3 };

//     fb.update(pv0, pv1, pv2, pv3);
//     fb.render();
//   }
// };

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

// export const throttle = (callback, interval) => {
//   let enableCall = true;

//   return function (...args) {
//     if (!enableCall) return;

//     enableCall = false;
//     callback.apply(this, args);
//     setTimeout(() => (enableCall = true), interval);
//   };
// };
