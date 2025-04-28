import { Button, HStack, VStack } from '@chakra-ui/react';

import Slider from './ui/slider';

const Controls = () => {
  return (
    <>
      <VStack bg="#eee" p={2} gap={2} align="flex-start">
        <Slider defaultValue={0} label='frame' wd={240} />
        <Slider defaultValue={0} label='balance' wd={240} />
        <Slider defaultValue={0} label='diff' wd={240} />
        <Button variant="subtle">Play</Button>
      </VStack>
      <HStack bg="#eee" p={2} gap={2} align="flex-start">
        <Button variant="subtle">Path</Button>
        <Button variant="subtle">Geom</Button>
        <Button variant="subtle">Particles</Button>
        <Button variant="subtle">Colors</Button>
        <Button variant="subtle">🎨</Button>
        <Button variant="subtle">Background</Button>
        <Button variant="subtle">&rsaquo;</Button>
        <Button variant="subtle">Save</Button>
        <Button variant="subtle">💾</Button>
      </HStack>
    </>
  )
}

export default Controls;