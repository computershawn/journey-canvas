import { useState } from 'react';

import {
  Center,
  CloseButton,
  Dialog,
  DialogOpenChangeDetails,
  Portal,
  Text,
} from '@chakra-ui/react';

import { PREVIEW_VIDEO_DIMS } from '../constants';
import { loggy } from '../utils/helpers';

const VideoPreviewModal = ({
  open,
  setOpen,
  videoUrl,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  videoUrl?: string;
}) => {
  const onOpenChange = (details: DialogOpenChangeDetails) => {
    setOpen(details.open);
  };

  const [hasVideoLoadError, setHasVideoLoadError] = useState(false);
  const handleVideoError = () => {
    loggy.error('Video failed to load or play.');
    setHasVideoLoadError(true);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      placement='center'
      size='lg'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Video Preview</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {hasVideoLoadError ? (
                <Center background='black' h={`${PREVIEW_VIDEO_DIMS.HT}px`}>
                  <Text color='white'>
                    Oopsies… This video is not available
                  </Text>
                </Center>
              ) : (
                <video
                  width={`${PREVIEW_VIDEO_DIMS.WD}px`}
                  height={`${PREVIEW_VIDEO_DIMS.HT}px`}
                  onError={handleVideoError}
                  controls
                >
                  <source src={videoUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              )}
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton variant='outline' size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default VideoPreviewModal;
