import { Slider as ChakraSlider, SliderValueChangeDetails } from "@chakra-ui/react"

type SliderProps = {
    defaultValue?: number,
    label?: string,
    size?: 'sm' | 'md' | 'lg',
    wd?: number,
    onValueChange?: (details: SliderValueChangeDetails) => void,
}

const Slider = ({ defaultValue = 50, label, size = 'md', wd = 100, onValueChange }: SliderProps) => {
    return (
        <ChakraSlider.Root width={`${wd}px`} defaultValue={[defaultValue]} size={size} onValueChange={onValueChange}>
            {!!label && <ChakraSlider.Label>{label}</ChakraSlider.Label>}
            <ChakraSlider.ValueText />
            <ChakraSlider.Control>
                <ChakraSlider.Track>
                    <ChakraSlider.Range />
                </ChakraSlider.Track>
                <ChakraSlider.Thumbs />
            </ChakraSlider.Control>
        </ChakraSlider.Root>
    )
}

export default Slider;