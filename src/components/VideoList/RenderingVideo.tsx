import { Center, HStack, Spinner, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const RenderingVideo = () => {
  const [authUser] = useAuthState(auth);

  if (!authUser) return null;

  return (
    <HStack w='full' background='#e0e0e0'>
      <Center w='80px' h='45px' bg='#444' borderRadius='xs'>
        <Spinner size='md' color='white' />
      </Center>
      <Text textStyle='sm'>Rendering your video</Text>
    </HStack>
  );
};

export default RenderingVideo;
