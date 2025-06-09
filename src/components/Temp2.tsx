import { Box, Button } from '@chakra-ui/react';
import { useAnimationLoop } from '../hooks/useAnimationLoop';

function Temp2() {
  const { t, isPlaying, play, pause } = useAnimationLoop(200);

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
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
