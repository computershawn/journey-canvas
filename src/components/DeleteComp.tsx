import { useState } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  DialogOpenChangeDetails,
  Portal,
  IconButton,
  VStack,
  HStack,
  Text,
  ButtonGroup,
  Box,
  Flex,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa6';
import { useControls } from '../hooks/useControls';
import { CompValues } from '../types';

const DeleteComp = () => {
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteList, setDeleteList] = useState<string[]>([]);

  const { comps } = useControls();

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      // UPDATE COMPS ARRAY HERE
      console.log('update comps array based on deleteList');
      setDeleteList([]);
    }
    setOpen(details.open);
  };

  const deleteQueuedComp = () => {
    if (idToDelete === null) return;

    setDeleteList([...deleteList, idToDelete]);
    setIdToDelete(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <IconButton
          aria-label='Delete comps'
          rounded='full'
          variant='outline'
          size='xs'
        >
          <FaTrash />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Composition</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {deleteList.length === comps.length ? (
                <Flex h={8} align='center'>
                  <Text textStyle='md'>
                    You deleted all of your comps (╯°□°)╯︵ ┻━┻
                  </Text>
                </Flex>
              ) : (
                <VStack gap={2} align='flex-start'>
                  {comps.map((comp: CompValues) => {
                    if (deleteList.includes(comp.id)) return null;

                    return (
                      <HStack key={comp.id} justify='space-between' w='full'>
                        <Text textStyle='md' fontWeight='medium'>
                          {comp.name}
                        </Text>
                        <ButtonGroup variant='outline' size='xs'>
                          {idToDelete === comp.id && (
                            <Box>
                              <Button
                                size='xs'
                                onClick={() => setIdToDelete(null)}
                              >
                                Cancel
                              </Button>
                              <Button size='xs' onClick={deleteQueuedComp}>
                                Delete
                              </Button>
                            </Box>
                          )}
                          <IconButton
                            aria-label='Delete comps'
                            rounded='full'
                            size='xs'
                            onClick={() => setIdToDelete(comp.id)}
                            disabled={idToDelete === comp.id}
                          >
                            <FaTrash />
                          </IconButton>
                        </ButtonGroup>
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' aria-label='Cancel'>
                  Done
                </Button>
              </Dialog.ActionTrigger>
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

export default DeleteComp;
