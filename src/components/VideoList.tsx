import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaDownload, FaPlay, FaTrash } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../firebase';
import { useUserVideos } from '../hooks/useUserVideos';

const placeholderThumbnail = './image-not-found.png';

const VideoListItem = ({ videoId, uid }: { videoId: string; uid: string }) => {
  const [thumbUrl, setThumbUrl] = useState<string>(placeholderThumbnail);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const thumbRef = ref(
          storage,
          `users/${uid}/thumbnails/th-${videoId}.png`,
        );
        const vRef = ref(storage, `users/${uid}/videos/video-${videoId}.mp4`);

        getDownloadURL(thumbRef)
          .then(setThumbUrl)
          .catch(() => {});
        getDownloadURL(vRef)
          .then(setVideoUrl)
          .catch(() => {});
      } catch (err) {
        console.error('Error getting URLs', err);
      }
    };
    fetchUrls();
  }, [videoId, uid]);

  return (
    <HStack
      w='full'
      justify='space-between'
      borderBottom='1px solid'
      borderBottomColor='#ccc'
      _last={{ borderBottomColor: 'transparent' }}
      pb={2}
    >
      {/* Video thumbnail */}
      <Box
        w='80px'
        h='45px'
        bg='#ccc'
        backgroundImage={`url(${thumbUrl})`}
        backgroundSize='cover'
        backgroundPosition='center'
        borderRadius='xs'
        flexShrink={0}
        cursor={videoUrl ? 'pointer' : 'default'}
        onClick={() => {
          if (videoUrl) {
            window.open(videoUrl, '_blank');
          } else {
            console.log(`Video not yet available for ${videoId}`);
          }
        }}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Flex
          bg='#0000004e'
          w={6}
          h={6}
          align='center'
          justify='center'
          borderRadius='full'
        >
          <FaPlay color='white' />
        </Flex>
      </Box>

      {/* Download and delete buttons */}
      <HStack h='45px' gap={1} justify='center'>
        <IconButton
          size='xs'
          aria-label='Download video'
          color='black'
          bg='#eee'
          disabled={!videoUrl}
          onClick={() => {
            if (videoUrl) {
              console.log('download video', videoUrl);
            }
          }}
        >
          <FaDownload />
        </IconButton>
        <IconButton
          size='xs'
          aria-label='Delete video'
          color='black'
          bg='#eee'
          disabled={!videoUrl}
          onClick={() => {
            if (videoUrl) {
              console.log('delete video', videoUrl);
            }
          }}
        >
          <FaTrash />
        </IconButton>
      </HStack>
    </HStack>
  );
};

const VideoList = () => {
  const { videoIds, loading } = useUserVideos();
  const [authUser] = useAuthState(auth);

  if (!authUser) return null;

  return (
    <VStack width='full' align='flex-start' gap={2} mt={4}>
      <Text textStyle='sm'>My Videos</Text>

      {loading ? (
        <Spinner size='sm' color='black' />
      ) : videoIds.length > 0 ? (
        videoIds.map((id) => (
          <VideoListItem videoId={id} key={id} uid={authUser.uid} />
        ))
      ) : (
        <Text fontSize='xs' color='gray.600'>
          No videos generated yet.
        </Text>
      )}
    </VStack>
  );
};

export default VideoList;
