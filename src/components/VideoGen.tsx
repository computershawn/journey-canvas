import { Button, Flex, Text } from '@chakra-ui/react';
import { FaFilm } from 'react-icons/fa6';

const pad = 4;
const gap = 8;

interface VideoGenProps {
  isRendering: boolean;
  renderVideo: () => void;
  percentUploaded: number;
}

const VideoGen = ({
  isRendering,
  renderVideo,
  percentUploaded,
}: VideoGenProps) => {
  return (
    <Flex
      h='2.5rem'
      bg='#292929'
      outline='1px solid transparent'
      p={`${pad}px`}
      alignItems='center'
      gap={`${gap}px`}
      borderRadius='sm'
      position='relative'
    >
      <Button
        aria-label=''
        size='xs'
        variant='outline'
        onClick={renderVideo}
        disabled={isRendering}
      >
        <FaFilm /> Render
      </Button>
      {isRendering && (
        <Text textStyle='sm' color='white'>
          Uploading {`${percentUploaded}%`}
        </Text>
      )}
    </Flex>
  );
};

export default VideoGen;
