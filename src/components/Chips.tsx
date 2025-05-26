import { Box, HStack } from '@chakra-ui/react';
import { ColorArray } from '../types';

const Chips = ({ palette }: { palette: ColorArray }) => {
  if (palette.length === 0) {
    return null;
  }

  return (
    <HStack gap='2px'>
      {palette.map((co) => (
        <Box w={2} h={6} bg={co} border='1px solid black' borderRadius={4} />
      ))}
    </HStack>
  );
};

export default Chips;
