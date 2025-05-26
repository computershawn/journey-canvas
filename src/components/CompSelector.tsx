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
  const frameworks = useMemo(() => {
    const items = Array(numComps)
      .fill(0)
      .map((_, i) => ({ label: `comp ${i + 1}`, value: `comp ${i + 1}` }));

    return createListCollection({
      items,
    });
  }, [numComps]);

  const handleValueChange = (e) => {
    const index = frameworks.items.findIndex(
      (item) => item.value === e.value[0]
    );
    setValue(e.value);
    onChangeComp(index);
  };

  return (
    <Select.Root
      collection={frameworks}
      size='xs'
      width='200px'
      value={value}
      onValueChange={handleValueChange}
    >
      <Select.HiddenSelect />
      <Select.Label>Saved Comps</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder='Select framework' />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
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
