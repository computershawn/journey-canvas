import { useMemo, useState } from 'react';

import { CtrlPoint } from '../types';
import BeziControls from './BeziControls';
import Composition from './Composition';

const NUM_POINTS = 325; // THIS IS DUPLICATED IN BeziControls

const Artboard = ({ compIndex }: { compIndex: number }) => {
  // const compRef = useRef<HTMLCanvasElement | null>(null);
  const [beziCtrlPts, setBeziCtrlPts] = useState<CtrlPoint[]>([]);

  const bezierSplinePoints = useMemo(() => {
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
      const n = (NUM_POINTS - 1) / 2;
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
      const bezierPoints2 = tempSet.slice(1);
      return [...bezierPoints1, ...bezierPoints2];
    };

    if (beziCtrlPts.length) {
      return getBezierSplinePoints(beziCtrlPts);
    }

    return [];
  }, [beziCtrlPts]);

  return (
    <>
      <Composition
        bezierSplinePoints={bezierSplinePoints}
      />
      <BeziControls
        compIndex={compIndex}
        points={beziCtrlPts}
        setBeziCtrlPts={setBeziCtrlPts}
      />
      {/* <BeziControls wd={1280} ht={720} /> */}
    </>
  );
};

// const Tings = () => {
//   const bezierGeomRef = useRef<HTMLCanvasElement | null>(null);
//   const bezierCtrlRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     // if (bezierGeomRef?.current !== null) {
//     //   const ctx = bezierGeomRef.current.getContext('2d');
//     //   const wd = bezierGeomRef.current.width;
//     //   const ht = bezierGeomRef.current.height;
//     //   const num = 40;
//     //   if (ctx !== null) {
//     //     ctx.strokeStyle = 'darkblue';
//     //     for (let i = 0; i < num; i++) {
//     //       const x = Math.round(Math.random() * wd);
//     //       const y = Math.round(Math.random() * ht);
//     //       const r = 8 + Math.round(Math.random() * 32);
//     //       ctx.beginPath();
//     //       ctx.arc(x, y, r, 0, 2 * Math.PI);
//     //       ctx.stroke();
//     //     }
//     //   }
//     // }

//     if (bezierCtrlRef?.current !== null) {
//       const ctx = bezierCtrlRef.current.getContext('2d');
//       const wd = bezierCtrlRef.current.width;
//       const ht = bezierCtrlRef.current.height;
//       const num = 40;
//       if (ctx !== null) {
//         ctx.strokeStyle = 'blue';
//         for (let i = 0; i < num; i++) {
//           const x = Math.round(Math.random() * wd);
//           const y = Math.round(Math.random() * ht);
//           const r = 8 + Math.round(Math.random() * 32);
//           ctx.beginPath();
//           ctx.arc(x, y, r, 0, 2 * Math.PI);
//           ctx.stroke();
//         }
//       }
//     }
//   }, []);

//   return (
//     <>
//       {/* Bezier geometry */}
//       <canvas
//         width='1280'
//         height='720'
//         ref={bezierGeomRef}
//         style={{ position: 'absolute', top: 0, left: 300 }}
//       >
//         Your browser does not support the HTML canvas tag.
//       </canvas>

//       {/* Bezier controls */}
//       <canvas
//         width='1280'
//         height='720'
//         ref={bezierCtrlRef}
//         style={{ position: 'absolute', top: 0, left: 300 }}
//       >
//         Your browser does not support the HTML canvas tag.
//       </canvas>
//     </>
//   );
// };

export default Artboard;
