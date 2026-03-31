import { FaCheck, FaClapperboard, FaXmark } from 'react-icons/fa6';

import {
  Flex,
  HStack,
  IconButton,
  Popover,
  Portal,
  Text,
} from '@chakra-ui/react';

import { GO_GREEN, MAGENTA, STOP_RED } from '../constants';
import { useRef } from 'react';

interface VideoGenProps {
  exportToVideo: () => Promise<void>;
  isUploadingOrRendering: boolean;
}

const VideoGen = ({ exportToVideo, isUploadingOrRendering }: VideoGenProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Flex h={10} w={10} outline='1px solid #404040' p={1} borderRadius='sm'>
      <Popover.Root
        size='xs'
        positioning={{ placement: 'top-end' }}
        initialFocusEl={() => confirmButtonRef.current}
      >
        <Popover.Trigger asChild>
          <IconButton
            aria-label='Render video'
            color='#4a4a4a'
            _hover={{ color: MAGENTA, transition: 'color .3s ease' }}
            disabled={isUploadingOrRendering}
            size='xs'
            variant='outline'
          >
            <FaClapperboard />
          </IconButton>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content width='unset'>
              <Popover.Arrow />
              <Popover.Body>
                <HStack justify='space-between'>
                  <Text>Export as a video?</Text>
                  <Flex gap={2}>
                    <Popover.CloseTrigger asChild>
                      <IconButton
                        aria-label='Cancel'
                        bg='#e8e8e8'
                        color={STOP_RED}
                        rounded='full'
                        size='xs'
                      >
                        <FaXmark />
                      </IconButton>
                    </Popover.CloseTrigger>
                    <Popover.CloseTrigger asChild>
                      <IconButton
                        aria-label='Confirm'
                        bg='#e8e8e8'
                        color={GO_GREEN}
                        onClick={exportToVideo}
                        ref={confirmButtonRef}
                        rounded='full'
                        size='xs'
                      >
                        <FaCheck />
                      </IconButton>
                    </Popover.CloseTrigger>
                  </Flex>
                </HStack>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Flex>
  );
};

export default VideoGen;
