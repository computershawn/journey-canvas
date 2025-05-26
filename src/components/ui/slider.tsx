import {
  Slider as ChakraSlider,
  SliderValueChangeDetails,
} from '@chakra-ui/react';

type SliderProps = {
  defaultValue?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  onValueChange?: (details: SliderValueChangeDetails) => void;
};

const Slider = ({
  defaultValue = 50,
  label,
  size = 'md',
  onValueChange,
  min,
  max,
}: SliderProps) => {
  const minValue = min || 0;
  const maxValue = max || 100;

  return (
    <ChakraSlider.Root
      width='100%'
      defaultValue={[defaultValue]}
      min={minValue}
      max={maxValue}
      size={size}
      onValueChange={onValueChange}
    >
      {!!label && <ChakraSlider.Label>{label}</ChakraSlider.Label>}
      <ChakraSlider.ValueText />
      <ChakraSlider.Control>
        <ChakraSlider.Track>
          <ChakraSlider.Range />
        </ChakraSlider.Track>
        <ChakraSlider.Thumbs />
      </ChakraSlider.Control>
    </ChakraSlider.Root>
  );
};

export default Slider;
