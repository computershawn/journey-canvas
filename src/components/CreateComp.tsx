import { useState } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  DialogOpenChangeDetails,
  Portal,
} from '@chakra-ui/react';
import { useControls } from '../hooks/useControls';

const MSG = {
  ERROR: 'This comp name already exists! Please type a different name.',
  HELPER: 'Comp name should have at least 3 letters.',
};

const CreateComp = ({
  onClickSave,
  open,
  setOpen,
}: {
  onClickSave: (name: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const [compName, setCompName] = useState('');
  const [nameExists, setNameExists] = useState(false);

  const { comps } = useControls();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCompName(e.target.value);
    setNameExists(false);
  };

  const isValidCompName = compName.trim().length >= 3;

  const handleSave = () => {
    const exists = comps.some((item) => item.name === compName.trim());
    if (exists) {
      setNameExists(true);
      return;
    }
    setOpen(false);
    onClickSave(compName);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isValidCompName) {
      handleSave();
    }
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      setCompName('');
      setNameExists(false);
    }
    setOpen(details.open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>New Composition</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={onSubmitForm}>
                <Field.Root invalid={nameExists}>
                  <Input
                    placeholder='Enter a name for this composition'
                    onChange={onChange}
                  />
                  <Field.HelperText>{MSG.HELPER}</Field.HelperText>
                  {nameExists && <Field.ErrorText>{MSG.ERROR}</Field.ErrorText>}
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

export default CreateComp;
