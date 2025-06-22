import { Box, HStack, Popover, Portal } from '@chakra-ui/react';
import { ColorArray } from '../types';
import { useState } from 'react';

const BOX_SIZE = 8;

const BgColorSelect = ({
  palette,
  pickColor,
  selectedIndex,
}: {
  palette: ColorArray;
  pickColor: (index: number) => void;
  selectedIndex: number;
}) => {
  const [open, setOpen] = useState(false);

  if (palette.length === 0) {
    return null;
  }

  return (
    <Popover.Root
      open={open}
      positioning={{ placement: 'right' }}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <Box
          w={BOX_SIZE}
          h={BOX_SIZE}
          bg={palette[selectedIndex]}
          border='1px solid black'
          borderRadius='sm'
          cursor='pointer'
        />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width='auto'>
            <Popover.Arrow />
            <Popover.Body>
              <HStack gap='2px'>
                {palette.map((co, j) => {
                  return (
                    <Box
                      key={`${j}-${co}`}
                      w={BOX_SIZE}
                      h={BOX_SIZE}
                      bg={co}
                      border='1px solid transparent'
                      borderColor={
                        j === selectedIndex ? 'black' : 'transparent'
                      }
                      borderRadius={4}
                      cursor='pointer'
                      onClick={() => pickColor(j)}
                    />
                  );
                })}
              </HStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default BgColorSelect;
