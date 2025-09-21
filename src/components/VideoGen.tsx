import { Box, Flex, IconButton, Menu, Portal } from '@chakra-ui/react';
import { FaClapperboard, FaFileVideo, FaFilm } from 'react-icons/fa6';

interface VideoGenProps {
  exportToVideo: () => Promise<void>;
  isRendering: boolean;
  isUploading: boolean;
  openPreviewModal: () => void;
  videoUrl: string;
}

const VideoGen = ({
  exportToVideo,
  isRendering,
  isUploading,
  openPreviewModal,
  videoUrl,
}: VideoGenProps) => {
  const isUploadingOrRendering = isRendering || isUploading;

  return (
    <Flex
      h='2.5rem'
      w='2.5rem'
      outline='1px solid #404040'
      p={1}
      borderRadius='sm'
    >
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            aria-label='Video options'
            color='#4a4a4a'
            _hover={{ color: '#ff008c', transition: 'color .3s ease' }}
            disabled={isUploadingOrRendering}
            size='xs'
            variant='outline'
          >
            <FaClapperboard />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content width={180}>
              <Menu.Item
                value={'View recent render'}
                onClick={openPreviewModal}
                disabled={!videoUrl}
              >
                <FaFileVideo />
                <Box flex='1'>View recent render</Box>
              </Menu.Item>
              <Menu.Item value={'Render animation'} onClick={exportToVideo}>
                <FaFilm />
                <Box flex='1'>Render animation</Box>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
};

export default VideoGen;
