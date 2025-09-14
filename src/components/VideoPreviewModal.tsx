import {
  Box,
  CloseButton,
  Dialog,
  DialogOpenChangeDetails,
  Portal,
} from '@chakra-ui/react';

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
              {videoUrl ? (
                <video width='100%' controls>
                  <source src={videoUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Box>No video URL available.</Box>
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
