import { Box, Button } from '@chakra-ui/react';

import { useTimeLoop } from '../hooks/useTimeLoop';

const pad = 16;
const wd = 32;
const containerWidth = 400;
const boxWidthPx = `${wd}px`;
// Cubic Ease In-Out function:
const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

function Temp2() {
  const { isPlaying, pause, play, value } = useTimeLoop(4000);

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const t = easeInOutCubic(value);

  return (
    <Box
      border='1px solid #ddd'
      borderRadius={8}
      m={2}
      w={containerWidth}
      h={200}
      p={`${pad}px`}
      position='relative'
      background='#111'
    >
      <Ting t={t} />
      <Button variant='outline' onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </Box>
  );
}

export default Temp2;

const Ting = ({ t }: { t: number }) => (
  <Box
    w={boxWidthPx}
    h={boxWidthPx}
    bg='red'
    borderRadius={4}
    position='absolute'
    top='4rem'
    style={{
      left: `${pad + t * (containerWidth - 2 * pad - wd)}px`,
    }}
  />
);
