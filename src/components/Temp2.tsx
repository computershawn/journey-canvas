import { Box, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';

function Temp2() {
  const [t, setT] = useState(0);
  const animationFrameId = useRef<null | number>(null);
  const isPlayingRef = useRef<boolean>(false);

  const animate = () => {
    setT((prevT) => {
      if (prevT > 200) return 0;

      return prevT + 1;
    });
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const play = () => {
    animate();
  };

  const pause = () => {
    if (typeof animationFrameId.current === 'number') {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleClick = () => {
    if (isPlayingRef.current) {
      pause();
    } else {
      play();
    }
    isPlayingRef.current = !isPlayingRef.current;
  };

  console.log('isPlayingRef.current', isPlayingRef.current);

  return (
    <Box w={800} h={400}>
      <Box m={4} w='32px' h='32px' bg='red' transform={`translateX(${t}px)`} />
      <Button variant='outline' onClick={handleClick}>
        do it
      </Button>
    </Box>
  );
}

export default Temp2;
