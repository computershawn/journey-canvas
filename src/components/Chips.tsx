import { Box, HStack } from '@chakra-ui/react';
import { ColorArray } from '../types';

const Chips = ({ palette, wide }: { palette: ColorArray; wide: boolean; }) => {
  if (palette.length === 0) {
    return null;
  }

  return (
    <HStack gap={0} outline='1px solid black' outlineOffset={1} borderRadius={1}>
      {palette.map((co, j) => {
        return <Box key={`${j}-${co}`} w={wide ? 4 : 1.5} h={6} bg={co} />;
      })}
    </HStack>
  );
};

export default Chips;
