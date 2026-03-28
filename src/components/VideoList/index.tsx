import { Spinner, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useUserVideos } from '../../hooks/useUserVideos';
import VideoListItem from './VideoListItem';

const VideoList = () => {
  const { videoIDs, loading } = useUserVideos();
  const [authUser] = useAuthState(auth);
  const [videoIdToDelete, setVideoIdToDelete] = useState<string | null>(null);

  if (!authUser) return null;

  return (
    <VStack width='full' align='flex-start' gap={2} mt={4}>
      <Text textStyle='sm'>My Videos</Text>

      {loading ? (
        <Spinner size='sm' color='black' />
      ) : videoIDs.length > 0 ? (
        videoIDs.map((id) => (
          <VideoListItem
            videoId={id}
            key={id}
            uid={authUser.uid}
            videoIdToDelete={videoIdToDelete}
            setVideoIdToDelete={setVideoIdToDelete}
          />
        ))
      ) : (
        <Text fontSize='sm' color='gray.600'>
          No videos to show
        </Text>
      )}
    </VStack>
  );
};

export default VideoList;
