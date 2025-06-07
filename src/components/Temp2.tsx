import { Box, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';

function Temp2() {
  const [t, setT] = useState(0);
  const animationFrameId = useRef<null | number>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const animate = () => {
    setT((prevT) => {
      if (prevT > 200) return 0;

      return prevT + 1;
    });

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    if (typeof animationFrameId.current === 'number') {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      animate();
    }

    setIsPlaying((prev) => !prev);
    // console.log('isPlaying', !isPlaying);
  };

  return (
    <Box w={800} h={400}>
      <Ting t={t} />
      <Button variant='outline' onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </Box>
  );
}

export default Temp2;

const Ting = ({ t }: { t: number }) => {
  return (
    <Box m={4} w='32px' h='32px' bg='red' transform={`translateX(${t}px)`} />
  );
};
