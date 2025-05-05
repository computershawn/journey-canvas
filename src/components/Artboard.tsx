import { useEffect, useRef, useState } from 'react';
import BeziControls from './BeziControls';
import { getAllComps } from '../utils/helpers';

type CtrlPoint = Point & {
  child: number[] | null;
};

const Artboard = ({ compIndex }: { compIndex: number }) => {
  const compRef = useRef<HTMLCanvasElement | null>(null);
  const comps = getAllComps();

  // useEffect(() => {
  //   if (compRef?.current !== null) {
  //     const ctx = compRef.current.getContext('2d');
  //     const wd = compRef.current.width;
  //     const ht = compRef.current.height;
  //     const num = 40;
  //     if (ctx !== null) {
  //       ctx.strokeStyle = 'red';
  //       for (let i = 0; i < num; i++) {
  //         const x = Math.round(Math.random() * wd);
  //         const y = Math.round(Math.random() * ht);
  //         const r = 8 + Math.round(Math.random() * 32);
  //         ctx.stroke();
  //         ctx.beginPath();
  //         ctx.arc(x, y, r, 0, 2 * Math.PI);
  //         ctx.stroke();
  //       }
  //     }
  //   }
  // }, []);
  const csp = comps[compIndex].curveSetPoints;
  const [points, setPoints] = useState<CtrlPoint[]>([
    { x: csp.pt1.x, y: csp.pt1.y, child: [1] },
    { x: csp.pt4.x, y: csp.pt4.y, child: null },
    { x: csp.pt5.x, y: csp.pt5.y, child: null },
    { x: csp.pt2.x, y: csp.pt2.y, child: [2, -1] },
    { x: csp.pt6.x, y: csp.pt6.y, child: null },
    { x: csp.pt3.x, y: csp.pt3.y, child: [4] },
  ]);

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
      <BeziControls csp={csp} wd={1280} ht={720} />
      {/* <BeziControls wd={1280} ht={720} /> */}
    </>
  );
};

const Tings = () => {
  const bezierGeomRef = useRef<HTMLCanvasElement | null>(null);
  const bezierCtrlRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // if (bezierGeomRef?.current !== null) {
    //   const ctx = bezierGeomRef.current.getContext('2d');
    //   const wd = bezierGeomRef.current.width;
    //   const ht = bezierGeomRef.current.height;
    //   const num = 40;
    //   if (ctx !== null) {
    //     ctx.strokeStyle = 'darkblue';
    //     for (let i = 0; i < num; i++) {
    //       const x = Math.round(Math.random() * wd);
    //       const y = Math.round(Math.random() * ht);
    //       const r = 8 + Math.round(Math.random() * 32);
    //       ctx.beginPath();
    //       ctx.arc(x, y, r, 0, 2 * Math.PI);
    //       ctx.stroke();
    //     }
    //   }
    // }

    if (bezierCtrlRef?.current !== null) {
      const ctx = bezierCtrlRef.current.getContext('2d');
      const wd = bezierCtrlRef.current.width;
      const ht = bezierCtrlRef.current.height;
      const num = 40;
      if (ctx !== null) {
        ctx.strokeStyle = 'blue';
        for (let i = 0; i < num; i++) {
          const x = Math.round(Math.random() * wd);
          const y = Math.round(Math.random() * ht);
          const r = 8 + Math.round(Math.random() * 32);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  }, []);

  return (
    <>
      {/* Bezier geometry */}
      <canvas
        width='1280'
        height='720'
        ref={bezierGeomRef}
        style={{ position: 'absolute', top: 0, left: 300 }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>

      {/* Bezier controls */}
      <canvas
        width='1280'
        height='720'
        ref={bezierCtrlRef}
        style={{ position: 'absolute', top: 0, left: 300 }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </>
  );
};

export default Artboard;
