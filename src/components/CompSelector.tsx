import { useMemo } from 'react';

import { Portal, Select, createListCollection } from '@chakra-ui/react';

import { useControls } from '../hooks/useControls';

const CompSelector = ({
  numComps,
  onChangeComp,
  setCompName,
  compName,
}: {
  numComps: number;
  onChangeComp: (index: number) => void;
  setCompName: (value: string[]) => void;
  compName: string[];
}) => {
  const { comps } = useControls();

  const compList = useMemo(() => {
    const items = comps.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.name,
    }));

    return createListCollection({
      items,
    });
  }, [comps]);

  const handleValueChange = (e: { value: string[] }) => {
    const index = compList.items.findIndex((item) => item.value === e.value[0]);
    setCompName(e.value);
    onChangeComp(index);
  };

  return (
    <Select.Root
      collection={compList}
      size='xs'
      width='full'
      value={compName}
      onValueChange={handleValueChange}
      disabled={numComps === 0}
    >
      <Select.HiddenSelect />
      <Select.Label>Saved Compositions</Select.Label>
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
