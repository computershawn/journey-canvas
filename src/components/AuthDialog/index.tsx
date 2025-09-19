import {
  Dialog,
  Portal,
  CloseButton,
  Flex,
  Text,
  Box,
  VStack,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCircleInfo, FaClapperboard } from 'react-icons/fa6';
import Login from './Login';
import Signup from './Signup';

const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const title = isLogin
    ? 'Log in to render video'
    : 'Create an account to render video';

  return (
    <Dialog.Root placement='center' size='sm'>
      <Dialog.Trigger asChild>
        {/* <Tooltip content='Create video file' openDelay={500} closeDelay={200}> */}
        <IconButton
          aria-label='Create video file'
          color='#4a4a4a'
          _hover={{ color: '#ff008cff', transition: 'color .3s ease' }}
          size='xs'
          variant='outline'
        >
          <FaClapperboard />
        </IconButton>
        {/*</Tooltip> */}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex align='center' gap='0.25rem' mb={2}>
                <FaCircleInfo />
                <Text fontSize='sm'>
                  You&apos;ll need to log in to render your animation as a video
                </Text>
              </Flex>
              <Box>
                <VStack gap={4}>{isLogin ? <Login /> : <Signup />}</VStack>
              </Box>
              <Flex mt={2} align='center'>
                <Text fontSize='sm'>
                  {isLogin
                    ? "Don't have an account?"
                    : 'Already have an account?'}
                </Text>
                <Button
                  fontSize='var(--chakra-fontSizes-sm)'
                  onClick={() => setIsLogin(!isLogin)}
                  size='xs'
                  px={1}
                  variant='outline'
                  backgroundColor='transparent'
                  _hover={{ borderColor: 'transparent' }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AuthDialog;
