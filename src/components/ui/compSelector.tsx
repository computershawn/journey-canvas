import { Portal, Select, createListCollection } from '@chakra-ui/react';
import { useMemo } from 'react';

const CompSelector = () => {
  const frameworks = useMemo(() => {
    return createListCollection({
      items: [
        { label: 'comp 1', value: 'comp 1' },
        { label: 'comp 2', value: 'comp 2' },
      ],
    });
  }, []);

  return (
    <Select.Root collection={frameworks} size='sm' width='200px'>
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
