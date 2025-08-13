import { Dialog, Button, Portal, CloseButton } from '@chakra-ui/react';
import { FaFilm } from 'react-icons/fa6';
import AuthForm from './AuthForm';

const AuthDialog = () => {
  return (
    <Dialog.Root placement='center' size='sm'>
      <Dialog.Trigger asChild>
        <Button aria-label='' size='xs' variant='outline'>
          <FaFilm /> Render
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sign in to render video</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <AuthForm />
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
