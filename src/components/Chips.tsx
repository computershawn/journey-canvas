import { Box, HStack } from '@chakra-ui/react';
import { ColorArray } from '../types';

const Chips = ({
  palette,
  selectedIndex,
}: {
  palette: ColorArray;
  selectedIndex: number;
}) => {
  if (palette.length === 0) {
    return null;
  }

  return (
    <HStack gap='2px'>
      {palette.map((co, j) => (
        <Box
          key={co}
          w={2}
          h={8}
          bg={co}
          border='solid black'
          borderWidth={selectedIndex === j ? '2px' : '1px'}
          borderRadius={4}
        />
      ))}
    </HStack>
  );
};

export default Chips;
