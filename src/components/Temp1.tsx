import { useRef, useState } from 'react';

import { Button, Flex } from '@chakra-ui/react';

// Browser attempts 60fps but for our case let's just say we only need 24fps
const fps = 60;
const targetFps = 24;

// Positioning of things
const wd = 200;
const s = 20;
const y0 = 0.5 * (wd - s);
const x0 = 0.5 * (wd - s);

// We want our animation loop to last 16 seconds
const targetDuration = 4000; // 16000;

// step is the amount to increment for each tick
const step = targetFps / fps;
const targetTicks = step * targetDuration;

const useAnimationFrame = (
  cb: (dt: number) => void,
  requestRef: React.RefObject<number>
) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  // const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      cb(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  // useEffect(() => {
  //   requestRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(requestRef.current);
  // }, []); // Make sure the effect runs only once

  const play = () => {
    requestRef.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    cancelAnimationFrame(requestRef.current);
  };

  return { play, pause };
};

const Wuuuut = () => {
  const [count, setCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const requestRef = useRef<number>(0);

  const { play, pause } = useAnimationFrame((deltaTime: number) => {
    const nextCount = (prevCount: number) =>
      (prevCount + deltaTime * step) % targetTicks;
    setCount(nextCount);
  }, requestRef);

  const toggle = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
    setPlaying((prev) => !prev);
  };

  let val = count / targetTicks;
  val = Math.sin(2 * Math.PI * val);

  const amt = playing ? val : 0;

  return (
    <>
      <Button variant='outline' onClick={toggle}>
        {playing ? 'pause' : 'play'}
      </Button>
      <Flex w='400px' h='400px' display='flex' align='center' justify='center'>
        <svg className='yeah' width='200' height='200' viewBox='0 0 200 200'>
          <rect
            fill='white'
            x={x0 + x0 * amt}
            y={y0}
            width={s}
            height={s}
            rx='4'
          />
        </svg>
      </Flex>
    </>
  );
};

// export default function Temp() {
//   const [playing, setPlaying] = useState(true);

//   const toggle = () => {
//     setPlaying((prev) => !prev);
//   };

//   return (
//     <>
//       <Button variant='outline' onClick={toggle}>
//         {playing ? 'pause' : 'play'}
//       </Button>
//       <Flex w='400px' h='400px' display='flex' align='center' justify='center'>
//         <Wuuuut playing={playing} />
//         {/* <svg className='yeah' width='200' height='200' viewBox='0 0 200 200'>
//           <Wuuuut playing={playing} />
//         </svg> */}
//       </Flex>
//     </>
//   );
// }

export default function Temp1() {
  // const [playing, setPlaying] = useState(true);

  // const toggle = () => {
  //   setPlaying((prev) => !prev);
  // };

  return (
    <>
      {/* <Button variant='outline' onClick={toggle}>
        {playing ? 'pause' : 'play'}
      </Button>
      <Flex w='400px' h='400px' display='flex' align='center' justify='center'> */}
      <Wuuuut />
      {/* </Flex> */}
    </>
  );
}
