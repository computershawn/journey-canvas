import { useEffect, useRef } from 'react';

const Artboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef?.current !== null) {
      const ctx = canvasRef.current.getContext('2d');
      const wd = canvasRef.current.width;
      const ht = canvasRef.current.height;
      const num = 40;
      if (ctx !== null) {
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

  // return (
  //     <>
  //         <Box w={1280} h={720}>hello there</Box>
  //     </>
  // )
  return (
    <canvas
      id='myCanvas'
      width='1280'
      height='720'
      ref={canvasRef}
      //   style={{'border:1px solid #d3d3d3'}}
    >
      Your browser does not support the HTML canvas tag.
    </canvas>
  );
};

export default Artboard;
