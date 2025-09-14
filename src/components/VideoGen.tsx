import { Flex, IconButton, Link, Spinner, Text } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { FaVideo } from 'react-icons/fa6';

import { auth } from '../firebase';
import AuthDialog from './AuthDialog';
import { Tooltip } from './ui/tooltip';

const pad = 4;
const gap = 8;

interface VideoGenProps {
  exportToVideo: () => void;
  isRendering: boolean;
  isUploading: boolean;
  videoUrl: string;
}

const VideoGen = ({
  exportToVideo,
  isRendering,
  isUploading,
  videoUrl,
}: VideoGenProps) => {
  const [authUser] = useAuthState(auth);

  const isUploadingOrRendering = isRendering || isUploading;
  const videoProcessStatus = isUploading
    ? 'Uploading frames...'
    : 'Rendering video...';

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
      {authUser ? (
        <>
          <Tooltip content="Create video file" openDelay={500} closeDelay={200}>
            <IconButton
              aria-label='Create video file'
              size='xs'
              variant='outline'
              onClick={exportToVideo}
              disabled={isUploadingOrRendering}
            >
              <FaVideo />
            </IconButton>
          </Tooltip>
          {isUploadingOrRendering && (
            <Flex gap={2} align='center'>
              <Text textStyle='sm' color='white'>
                {videoProcessStatus}
              </Text>
              <Spinner color='white' />
            </Flex>
          )}
          {videoUrl && <Link href={videoUrl}>link to your video</Link>}
        </>
      ) : (
        <AuthDialog />
      )}
    </Flex>
  );
};

export default VideoGen;
