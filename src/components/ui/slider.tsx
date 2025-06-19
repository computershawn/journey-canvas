import {
  Slider as ChakraSlider,
  SliderValueChangeDetails,
} from '@chakra-ui/react';
import { MINTY } from '../../constants';

type SliderProps = {
  defaultValue?: number;
  isAnimProgressBar?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onValueChange?: (details: SliderValueChangeDetails) => void;
  onValueChangeEnd?: (details: SliderValueChangeDetails) => void;
  showValueText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  value?: number;
};

const Slider = ({
  defaultValue = 50,
  isAnimProgressBar = false,
  label,
  max,
  min,
  onValueChange,
  onValueChangeEnd,
  showValueText = true,
  size = 'md',
  value,
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
      value={value ? [value] : undefined}
      onValueChange={onValueChange}
      onValueChangeEnd={onValueChangeEnd}
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
