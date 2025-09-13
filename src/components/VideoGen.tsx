import { Button, Flex, IconButton, Link, Text } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { FaFilm } from 'react-icons/fa6';

import { auth } from '../firebase';
import { useLogout } from '../hooks/useLogout';
import AuthDialog from './AuthDialog';
import { toaster } from './Toastier';

const pad = 4;
const gap = 8;

interface VideoGenProps {
  isRendering: boolean;
  renderVideo: () => void;
  percentUploaded: number;
  videoUrl: string;
}

const onErrorCallback = (errMsg: string) => {
  toaster.create({
    description: errMsg,
    type: 'error',
  });
};

const VideoGen = ({
  isRendering,
  renderVideo,
  percentUploaded,
  videoUrl,
}: VideoGenProps) => {
  const [authUser] = useAuthState(auth);
  const { handleLogout, isLoggingOut } = useLogout(onErrorCallback);

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
          <IconButton
            aria-label=''
            size='xs'
            variant='outline'
            onClick={renderVideo}
            disabled={isRendering}
          >
            <FaFilm />
          </IconButton>
          {isRendering && (
            <Text textStyle='sm' color='white'>
              Uploading {`${percentUploaded}%`}
            </Text>
          )}
          <Button
            size='xs'
            variant='outline'
            loading={isLoggingOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
          {videoUrl && <Link href={videoUrl}>link to your video</Link>}
        </>
      ) : (
        <AuthDialog />
      )}
    </Flex>
  );
};

export default VideoGen;
