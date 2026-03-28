import {
  Box,
  DownloadTrigger,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaCheck, FaDownload, FaPlay, FaTrash, FaXmark } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, firestore } from '../firebase';
import { useUserVideos } from '../hooks/useUserVideos';

const placeholderThumbnail = './image-not-found.png';

const VideoListItem = ({
  videoId,
  uid,
  videoIdToDelete,
  setVideoIdToDelete,
}: {
  videoId: string;
  uid: string;
  videoIdToDelete: string | null;
  setVideoIdToDelete: (val: string | null) => void;
}) => {
  const [thumbUrl, setThumbUrl] = useState<string>(placeholderThumbnail);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const deleteQueuedVideo = async (id: string) => {
    try {
      // 1. Remove from Firestore array
      const userDocRef = doc(firestore, 'users', uid);
      await updateDoc(userDocRef, {
        videoIDs: arrayRemove(id),
      });

      // 2. Delete the specific files from Storage
      const thumbRef = ref(storage, `users/${uid}/thumbnails/th-${id}.png`);
      const vRef = ref(storage, `users/${uid}/videos/video-${id}.mp4`);

      await Promise.all([
        deleteObject(thumbRef).catch((e) =>
          console.error('Thumbnail delete error:', e),
        ),
        deleteObject(vRef).catch((e) =>
          console.error('Video delete error:', e),
        ),
      ]);

      console.log('Successfully deleted video', id);
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setVideoIdToDelete(null);
    }
  };

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

      {/* Download button */}
      <HStack h='45px' gap={1} justify='center'>
        {videoIdToDelete !== videoId && (
          <DownloadTrigger
            data={async () => await fetch(videoUrl).then((r) => r.blob())}
            fileName={`video-${videoId}.mp4`}
            mimeType='video/mp4'
            asChild
          >
            <IconButton
              aria-label='Download video'
              bg='#eee'
              color='#222'
              disabled={!videoUrl}
              rounded='full'
              size='xs'
            >
              <FaDownload />
            </IconButton>
          </DownloadTrigger>
        )}

        {/* Delete button */}
        {videoIdToDelete === videoId ? (
          <HStack gap={1}>
            <Text color='red' mr={1}>
              Delete?
            </Text>
            <IconButton
              aria-label='Confirm'
              bg='#222'
              color='#eee'
              onClick={() => deleteQueuedVideo(videoId)}
              rounded='full'
              size='xs'
            >
              <FaCheck />
            </IconButton>
            <IconButton
              aria-label='Cancel'
              bg='#222'
              color='#eee'
              onClick={() => setVideoIdToDelete(null)}
              rounded='full'
              size='xs'
            >
              <FaXmark />
            </IconButton>
          </HStack>
        ) : (
          <IconButton
            aria-label='Delete video'
            bg='#eee'
            color='#222'
            disabled={!videoUrl}
            onClick={() => {
              if (videoUrl) {
                setVideoIdToDelete(videoId);
              }
            }}
            rounded='full'
            size='xs'
          >
            <FaTrash />
          </IconButton>
        )}
      </HStack>
    </HStack>
  );
};

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
