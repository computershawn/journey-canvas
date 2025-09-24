import { Box, HStack } from '@chakra-ui/react';
import { ColorArray } from '../types';

const Chips = ({ palette }: { palette: ColorArray; }) => {
  if (palette.length === 0) {
    return null;
  }

  return (
    <HStack gap={0} outline='1px solid #aaa' outlineOffset={2}>
      {palette.map((co, j) => {
        return <Box key={`${j}-${co}`} w={3} h={6} bg={co} />;
      })}
    </HStack>
  );
};

export default Chips;
