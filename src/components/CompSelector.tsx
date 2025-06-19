import { useMemo, useState } from 'react';

import { Portal, Select, createListCollection } from '@chakra-ui/react';

import { getAllComps } from '../utils/helpers';

const PREFIX = 'comp';

const CompSelector = ({
  onChangeComp,
}: {
  onChangeComp: (index: number) => void;
}) => {
  const numComps = getAllComps().length;
  const [value, setValue] = useState<string[]>([`${PREFIX} 1`]);
  const compList = useMemo(() => {
    const items = Array(numComps)
      .fill(0)
      .map((_, i) => ({ label: `comp ${i + 1}`, value: `comp ${i + 1}` }));

    return createListCollection({
      items,
    });
  }, [numComps]);

  const handleValueChange = (e: { value: string[] }) => {
    const index = compList.items.findIndex(
      (item) => item.value === e.value[0]
    );
    setValue(e.value);
    onChangeComp(index);
  };

  return (
    <Select.Root
      collection={compList}
      size='xs'
      width='full'
      value={value}
      onValueChange={handleValueChange}
      disabled={numComps === 0}
    >
      <Select.HiddenSelect />
      <Select.Label>Saved Comps</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder='Select composition' />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {compList.items.map((comp) => (
              <Select.Item item={comp} key={comp.value}>
                {comp.label}
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
