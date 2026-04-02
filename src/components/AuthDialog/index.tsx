import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import Login from './Login';
import Signup from './Signup';

const AuthDialog = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const title = isLogin ? 'Log in' : 'Create an account';

  return (
    <Dialog.Root
      placement='center'
      size='sm'
      onExitComplete={() => setIsLogin(true)}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
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
              <>{isLogin ? <Login /> : <Signup />}</>
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
                  {isLogin ? 'Sign up here.' : 'Log in here.'}
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
