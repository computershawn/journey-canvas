import {
  Slider as ChakraSlider,
  SliderValueChangeDetails,
} from '@chakra-ui/react';
import { MINTY } from '../../constants';

type SliderProps = {
  defaultValue?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  onValueChange?: (details: SliderValueChangeDetails) => void;
  showValueText?: boolean;
  isAnimProgressBar?: boolean;
};

const Slider = ({
  defaultValue = 50,
  label,
  size = 'md',
  min,
  max,
  onValueChange,
  showValueText = true,
  isAnimProgressBar = false,
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
      {showValueText && <ChakraSlider.ValueText />}
      <ChakraSlider.Control>
        <ChakraSlider.Track>
          <ChakraSlider.Track bg={isAnimProgressBar ? '#111' : undefined}>
            <ChakraSlider.Range bg={isAnimProgressBar ? MINTY : undefined} />
          </ChakraSlider.Track>
        </ChakraSlider.Track>
        <ChakraSlider.Thumbs />
      </ChakraSlider.Control>
    </ChakraSlider.Root>
  );
};

export default Slider;
