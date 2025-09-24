import { useState } from 'react';
import { FaClapperboard, FaFileVideo, FaFilm } from 'react-icons/fa6';

import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuOpenChangeDetails,
  Portal,
} from '@chakra-ui/react';

import { MAGENTA } from '../constants';

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
  const [isMenuActive, setIsMenuActive] = useState(false);

  const isUploadingOrRendering = isRendering || isUploading;

  return (
    <Flex h={10} w={10} outline='1px solid #404040' p={1} borderRadius='sm'>
      <Menu.Root
        onOpenChange={(e: MenuOpenChangeDetails) => {
          setIsMenuActive(e.open);
        }}
      >
        <Menu.Trigger asChild>
          <IconButton
            aria-label='Video options'
            color={isMenuActive ? MAGENTA : '#4a4a4a'}
            _hover={{ color: MAGENTA, transition: 'color .3s ease' }}
            disabled={isUploadingOrRendering}
            size='xs'
            variant='outline'
          >
            <FaClapperboard />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value={'View your recent render'}
                disabled={!videoUrl}
                onClick={videoUrl ? openPreviewModal : undefined}
              >
                <FaFileVideo />
                <Box flex='1'>View your recent video</Box>
              </Menu.Item>
              <Menu.Item
                value={'Render this animation'}
                onClick={exportToVideo}
              >
                <FaFilm />
                <Box flex='1'>Render this animation</Box>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
};

export default VideoGen;
