import { useMemo } from 'react';

import {
  ButtonGroup,
  HStack,
  IconButton,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';
import { FaFileCirclePlus, FaFloppyDisk, FaPen } from 'react-icons/fa6';
import { Tooltip } from './ui/tooltip';

const CompSelector = ({
  numComps,
  onChangeComp,
  setCompId,
  compId,
  openCreateModal,
  openEditModal,
  handleClickUpdate,
}: {
  numComps: number;
  onChangeComp: (index: number) => void;
  setCompId: (value: string[]) => void;
  compId: string[];
  openCreateModal: () => void;
  openEditModal: () => void;
  handleClickUpdate: () => void;
}) => {
  const { comps } = useControls();

  const compList = useMemo(() => {
    const items = comps.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.id,
    }));

    return createListCollection({
      items,
    });
  }, [comps]);

  const handleValueChange = (e: { value: string[] }) => {
    const index = compList.items.findIndex((item) => item.value === e.value[0]);
    setCompId(e.value);
    onChangeComp(index);
  };

  return (
    <Select.Root
      collection={compList}
      size='xs'
      width='full'
      value={compId}
      onValueChange={handleValueChange}
      disabled={numComps === 0}
    >
      <Select.HiddenSelect />
      <HStack justify='space-between' width='full'>
        <Select.Label>Compositions</Select.Label>
        <ButtonGroup size='xs' gap={0} ml='auto'>
          <FunButton
            content='Create a new comp'
            icon={<FaFileCirclePlus />}
            onClick={openCreateModal}
          />
          <FunButton
            content='Update current comp'
            icon={<FaFloppyDisk />}
            onClick={handleClickUpdate}
          />
          <FunButton
            content='Edit existing comp'
            icon={<FaPen />}
            onClick={openEditModal}
          />
        </ButtonGroup>
      </HStack>

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={'-'} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {compList.items.map((item) => (
              <Select.Item item={item} key={item.id}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default CompSelector;

const FunButton = ({
  content,
  onClick,
  icon,
}: {
  content: string;
  onClick: () => void;
  icon: React.ReactNode;
}) => {
  return (
    <Tooltip content={content} openDelay={500} closeDelay={200}>
      <IconButton onClick={onClick} bg='#eee' color='black'>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
