import { Box, HStack, VStack } from '@chakra-ui/react';
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
      {palette.map((co, j) => {
        if (j === selectedIndex) {
          return (
            <VStack gap='2px' key={co}>
              <Box
                w={2}
                h={5}
                bg={co}
                border='1px solid black'
                borderRadius={4}
              />
              <Box key={co} w={2} h='1px' bg='black' border='1px solid black' />
            </VStack>
          );
        }
        return (
          <Box
            key={co}
            w={2}
            h={6}
            bg={co}
            border='1px solid black'
            borderRadius={4}
          />
        );
      })}
    </HStack>
  );
};

export default Chips;
