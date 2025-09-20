import { Flex, IconButton } from '@chakra-ui/react';

// import { useAuthState } from 'react-firebase-hooks/auth';
import { FaClapperboard } from 'react-icons/fa6';

// import { auth } from '../firebase';
// import { Tooltip } from './ui/tooltip';
// import RenderButton from './RenderButton';

const pad = 4;
const gap = 8;

interface VideoGenProps {
  // exportToVideo: () => void;
  exportToVideo: () => Promise<void>;
  isRendering: boolean;
  isUploading: boolean;
  // openAuthDialog: () => void;
  // videoUrl: string;
}

const VideoGen = ({
  exportToVideo,
  isRendering,
  isUploading,
  // openAuthDialog,
  // videoUrl,
}: VideoGenProps) => {
  // const [authUser] = useAuthState(auth);

  const isUploadingOrRendering = isRendering || isUploading;
  // const videoProcessStatus = isUploading
  //   ? 'Uploading frames...'
  //   : 'Rendering your video...';

  // const handleClickRenderButton = () => {
  //   if (authUser) {
  //     exportToVideo();
  //   } else {
  //     openAuthDialog();
  //     return;
  //   }
  // };

  return (
    <Flex
      h='2.5rem'
      w='2.5rem'
      bg='#292929'
      outline='1px solid #404040'
      p={`${pad}px`}
      alignItems='center'
      gap={`${gap}px`}
      borderRadius='sm'
      position='relative'
    >
      {/* <RenderButton disabled={isUploadingOrRendering} onClick={exportToVideo} /> */}
      {/* <Tooltip content='Create video file' openDelay={500} closeDelay={200}> */}
      <IconButton
        aria-label='Create video file'
        color='#4a4a4a'
        _hover={{ color: '#ff008cff', transition: 'color .3s ease' }}
        disabled={isUploadingOrRendering}
        onClick={exportToVideo}
        // onClick={() => console.log('initiate video export')}
        size='xs'
        variant='outline'
      >
        <FaClapperboard />
      </IconButton>
      {/* </Tooltip> */}
      {/* {isUploadingOrRendering && (
        <Flex gap={2} align='center'>
          <Text textStyle='sm' color='white'>
            {videoProcessStatus}
          </Text>
          <Spinner color='white' />
        </Flex>
      )} */}
      {/* {videoUrl && <Link href={videoUrl}>link to your video</Link>} */}
    </Flex>
  );
};

export default VideoGen;
