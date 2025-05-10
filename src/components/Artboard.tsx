import { useState } from 'react';
import BeziControls from './BeziControls';
import { CtrlPoint } from '../types';
import Composition from './Composition';

const Artboard = ({ compIndex }: { compIndex: number }) => {
  // const compRef = useRef<HTMLCanvasElement | null>(null);
  const [beziCtrlPts, setBeziCtrlPts] = useState<CtrlPoint[]>([]);

  return (
    <>
      {/* Composition */}
      {/* <canvas
        width='1280'
        height='720'
        ref={compRef}
        style={{ position: 'absolute', top: 0, left: 300 }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas> */}

      {/* <Tings /> */}
      <Composition beziCtrlPts={beziCtrlPts} wd={1280} ht={720} />
      <BeziControls
        compIndex={compIndex}
        points={beziCtrlPts}
        setBeziCtrlPts={setBeziCtrlPts}
        wd={1280}
        ht={720}
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
