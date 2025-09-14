import {
  Dialog,
  Portal,
  CloseButton,
  IconButton,
  Flex,
  Text,
  Box,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCircleInfo, FaVideo } from 'react-icons/fa6';
import Login from './Login';
import Signup from './Signup';

const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Dialog.Root placement='center' size='sm'>
      <Dialog.Trigger asChild>
        <IconButton
          aria-label='Export animation to video'
          size='xs'
          variant='outline'
        >
          <FaVideo />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sign in to render video</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex align='center' gap='0.25rem' mb={2}>
                <FaCircleInfo />
                <Text fontSize='sm'>
                  You&apos;ll need to sign in to render your animation as a
                  video
                </Text>
              </Flex>
              <Box>
                <VStack gap={4}>{isLogin ? <Login /> : <Signup />}</VStack>
              </Box>
              <Flex mt={2} align='center'>
                {/* <Center> */}
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
                {/* </Center> */}
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
