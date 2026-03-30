import { useMemo } from 'react';

import {
  createListCollection,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';
import { FaArrowsRotate, FaFileCirclePlus, FaPen } from 'react-icons/fa6';
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

  // If user doesn't have any compositions, show a blurb
  // and a button to create a new composition
  if (numComps === 0) {
    return (
      <VStack w='full' align='flex-start' gap={1.5}>
        <Flex w='full' align='center' justify='space-between'>
          <Text textStyle='sm' fontWeight='medium'>
            Compositions
          </Text>
          <Tooltip content='Create a new composition'>
            <IconButton
              size='xs'
              aria-label='Create a new composition'
              onClick={openCreateModal}
            >
              <FaFileCirclePlus color='black' />
            </IconButton>
          </Tooltip>
        </Flex>
        <Text textStyle='sm' fontStyle='italic' color='gray.500'>
          Your saved compositions will appear here.
        </Text>
      </VStack>
    );
  }

  return (
    <Select.Root
      collection={compList}
      size='xs'
      width='full'
      value={compId}
      onValueChange={handleValueChange}
    >
      <Select.HiddenSelect />
      <HStack justify='space-between' width='full'>
        <Select.Label>Compositions</Select.Label>
        <ButtonGroup size='xs' gap={0} ml='auto'>
          <FunButton
            content='Create a new composition'
            icon={<FaFileCirclePlus />}
            onClick={openCreateModal}
          />
          <FunButton
            content='Update current composition'
            icon={<FaArrowsRotate />}
            onClick={handleClickUpdate}
          />
          <FunButton
            content='Manage existing compositions'
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
    <Tooltip content={content}>
      <IconButton onClick={onClick} bg='#eee' color='black'>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
