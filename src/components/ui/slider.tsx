import { Slider as ChakraSlider } from "@chakra-ui/react"

type SliderProps = {
    defaultValue?: number,
    label?: string,
    size?: 'sm' | 'md' | 'lg',
    wd?: number
}

const Slider = ({ defaultValue = 50, label, size = 'md', wd = 100 }: SliderProps) => {
    return (
        <ChakraSlider.Root width={`${wd}px`} defaultValue={[defaultValue]} size={size}>
            {!!label && <ChakraSlider.Label>{label}</ChakraSlider.Label>}
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