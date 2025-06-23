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
  Flex,
} from '@chakra-ui/react';
import { FaCheck, FaPen, FaTrash, FaXmark } from 'react-icons/fa6';
import { useControls } from '../hooks/useControls';
import { CompValues } from '../types';

const EditComp = () => {
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteList, setDeleteList] = useState<string[]>([]);

  const { comps, setComps } = useControls();

  const deleteComps = () => {
    const updated = comps.filter(item => !deleteList.includes(item.id));
    // console.log('comps', comps);
    // console.log('updated', updated);
    setComps(updated);
    setDeleteList([]);
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      if(deleteList.length > 0) {
        deleteComps();
      }
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
          <FaPen />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Comps</Dialog.Title>
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
                          {idToDelete === comp.id ? (
                            <HStack>
                              <Text color='red'>Delete?</Text>
                              <IconButton
                                aria-label='Confirm'
                                rounded='full'
                                size='xs'
                                onClick={deleteQueuedComp}
                              >
                                <FaCheck />
                              </IconButton>
                              <IconButton
                                aria-label='Cancel'
                                rounded='full'
                                size='xs'
                                onClick={() => setIdToDelete(null)}
                              >
                                <FaXmark />
                              </IconButton>
                            </HStack>
                          ) : (
                            <IconButton
                              aria-label='Delete comps'
                              rounded='full'
                              size='xs'
                              onClick={() => setIdToDelete(comp.id)}
                              disabled={idToDelete === comp.id}
                            >
                              <FaTrash />
                            </IconButton>
                          )}
                        </ButtonGroup>
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' aria-label='Done'>
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

export default EditComp;
