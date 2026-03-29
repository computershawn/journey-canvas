import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useUserVideos } from '../../hooks/useUserVideos';
import VideoListItem from './VideoListItem';
import RenderingVideo from './RenderingVideo';

const VideoList = () => {
  const { videoIDs, loading, isRendering } = useUserVideos();
  const [authUser] = useAuthState(auth);
  const [videoIdToDelete, setVideoIdToDelete] = useState<string | null>(null);

  if (!authUser) return null;

  let content;
  switch (true) {
    case loading:
      content = <Spinner size='sm' color='black' />;
      break;
    case videoIDs.length > 0:
      content = (
        <>
          {videoIDs.map((id) => (
            <VideoListItem
              videoId={id}
              key={id}
              uid={authUser.uid}
              videoIdToDelete={videoIdToDelete}
              setVideoIdToDelete={setVideoIdToDelete}
            />
          ))}
          {isRendering && <RenderingVideo />}
        </>
      );
      break;
    case videoIDs.length === 0 && isRendering:
      content = <RenderingVideo />;
      break;
    default:
      content = (
        <Text fontSize='sm' color='gray.600'>
          No videos to show
        </Text>
      );
  }

  return (
    <VStack width='full' align='flex-start' gap={2} mt={4}>
      <Text textStyle='sm'>My Videos</Text>
      <Box w='full' maxH='13.5rem' overflowY='auto'>
        {content}
      </Box>
    </VStack>
  );
};

export default VideoList;
