import { FaClapperboard } from 'react-icons/fa6';
import { Flex, IconButton } from '@chakra-ui/react';
import { MAGENTA } from '../constants';

interface VideoGenProps {
  exportToVideo: () => Promise<void>;
  isRendering: boolean;
  isUploading: boolean;
}

const VideoGen = ({
  exportToVideo,
  isRendering,
  isUploading,
}: VideoGenProps) => {
  const isUploadingOrRendering = isRendering || isUploading;

  return (
    <Flex h={10} w={10} outline='1px solid #404040' p={1} borderRadius='sm'>
      <IconButton
        aria-label='Render video'
        color='#4a4a4a'
        _hover={{ color: MAGENTA, transition: 'color .3s ease' }}
        disabled={isUploadingOrRendering}
        onClick={exportToVideo}
        size='xs'
        variant='outline'
      >
        <FaClapperboard />
      </IconButton>
    </Flex>
  );
};

export default VideoGen;
