import { useState } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from '@chakra-ui/react';
import { FaFloppyDisk } from 'react-icons/fa6';

const SaveComp = ({ onClickSave }: { onClickSave: (name: string) => void }) => {
  const [compName, setCompName] = useState('');
  const [open, setOpen] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCompName(e.target.value);
  };

  const isValidCompName = compName.trim().length >= 3;

  const handleSave = () => {
    setOpen(false);
    onClickSave(compName);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isValidCompName) {
      handleSave();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button
          variant='outline'
          w='full'
          mt='auto'
          aria-label='Save composition'
        >
          <FaFloppyDisk color='black' /> Save Composition
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Save Composition</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={onSubmitForm}>
                <Field.Root>
                  <Input
                    placeholder='Enter a name for this composition'
                    onChange={onChange}
                  />
                  <Field.HelperText>
                    Comp name should have at least 3 letters
                  </Field.HelperText>
                </Field.Root>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' aria-label='Cancel'>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant='outline'
                aria-label='Save composition'
                onClick={handleSave}
                disabled={!isValidCompName}
              >
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton variant='outline' size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default SaveComp;
