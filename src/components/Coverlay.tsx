import { Flex, Text, Spinner, Center } from '@chakra-ui/react';

import { CANV_HT, CANV_WD, MINTY } from '../constants';

const Coverlay = ({
  isUploading,
  isRendering,
}: {
  isUploading: boolean;
  isRendering: boolean;
}) => {
  const isUploadingOrRendering = isRendering || isUploading;
  const videoProcessStatus = isUploading
    ? 'Uploading frames...'
    : 'Rendering your video...';

  return (
    <Center
      position='absolute'
      bg='#000000d6'
      w={CANV_WD}
      h={CANV_HT}
      mt={2}
      zIndex={1}
    >
      {isUploadingOrRendering && (
        <Flex borderRadius="sm" p={6} h="3rem" gap={2} align='center' bg='black'>
          <Text textStyle='sm' color={'#e3fff9'}>
            {videoProcessStatus}
          </Text>
          <Spinner color={MINTY} />
        </Flex>
      )}
    </Center>
  );
};

export default Coverlay;
