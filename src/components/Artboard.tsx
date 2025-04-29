import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

const Artboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef?.current !== null) {
      // var c = document.getElementById("myCanvas");
      const ctx = canvasRef.current.getContext('2d');
      if (ctx !== null) {
        //   ctx.getContext('2d');
        ctx.beginPath();
        ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx.stroke();
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
      width='200'
      height='100'
      ref={canvasRef}
      //   style={{'border:1px solid #d3d3d3'}}
    >
      Your browser does not support the HTML canvas tag.
    </canvas>
  );
};

export default Artboard;
