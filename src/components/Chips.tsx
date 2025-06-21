import { Box, HStack } from '@chakra-ui/react';
import { ColorArray } from '../types';

const Chips = ({ palette }: { palette: ColorArray }) => {
  if (palette.length === 0) {
    return null;
  }

  return (
    <HStack gap={0} outline='1px solid black' outlineOffset={1}>
      {palette.map((co, j) => {
        return (
          <Box
            key={co}
            w={4}
            h={6}
            bg={co}
            borderRight={j < palette.length - 1 ? "1px solid black" : 'none'}
          />
        );
      })}
    </HStack>
  );
};

export default Chips;
