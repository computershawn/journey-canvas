import { Box, IconButton, Menu, Portal } from '@chakra-ui/react';
import { FaBars, FaFileCirclePlus, FaFloppyDisk, FaPen } from 'react-icons/fa6';

const OptionsMenu = ({
  onCreateComp,
  onEditComps,
  onUpdateExistingComp,
}: {
  onCreateComp: () => void;
  onEditComps: () => void;
  onUpdateExistingComp: () => void;
}) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label='Delete comps'
          rounded='full'
          variant='outline'
          size='xs'
        >
          <FaBars />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content width={180}>
            <Menu.Item value={'newComp'} onClick={onCreateComp}>
              <FaFileCirclePlus />
              <Box flex='1'>New Comp…</Box>
            </Menu.Item>
            <Menu.Item value={'update'} onClick={onUpdateExistingComp}>
              <FaFloppyDisk />
              <Box flex='1'>Update Current</Box>
            </Menu.Item>
            <Menu.Item value={'edit'} onClick={onEditComps}>
              <FaPen />
              <Box flex='1'>Manage Comps…</Box>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default OptionsMenu;
