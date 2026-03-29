import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  IconButton,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCircleInfo, FaCircleUser, FaClapperboard } from 'react-icons/fa6';
import Login from './Login';
import Signup from './Signup';

const AuthDialog = ({ plainTextTrigger }: { plainTextTrigger?: boolean }) => {
  const [isLogin, setIsLogin] = useState(true);
  const title = isLogin
    ? 'Log in to render video'
    : 'Create an account to render video';

  return (
    <Dialog.Root placement='center' size='sm'>
      <Dialog.Trigger asChild>
        {plainTextTrigger ? (
          <Flex h='2.5rem' align='center' gap={1}>
            <FaCircleUser color='#008caf' />
            <Text color='#008caf' fontWeight='medium' cursor='pointer'>
              Log in or Sign up
            </Text>
          </Flex>
        ) : (
          <Flex
            h='2.5rem'
            w='2.5rem'
            outline='1px solid #404040'
            p={1}
            borderRadius='sm'
          >
            <IconButton
              aria-label='Create video file'
              color='#4a4a4a'
              _hover={{ color: '#252525', transition: 'color .3s ease' }}
              size='xs'
              variant='outline'
            >
              <FaClapperboard />
            </IconButton>
          </Flex>
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop bg='blackAlpha.700' />
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
              <VStack gap={4}>{isLogin ? <Login /> : <Signup />}</VStack>
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
