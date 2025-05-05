import { Portal, Select, createListCollection } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

const items = [
  { label: 'comp 1', value: 'comp 1' },
  { label: 'comp 2', value: 'comp 2' },
];

const CompSelector = ({
  onChangeComp,
}: {
  onChangeComp: (index: number) => void;
}) => {
  const [value, setValue] = useState<string[]>([items[0].value]);
  const frameworks = useMemo(() => {
    return createListCollection({
      items,
    });
  }, []);

  const handleValueChange = (e) => {
    const index = items.findIndex((item) => item.value === e.value[0]);
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
      <Select.Label>Compositions</Select.Label>
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
