import { HStack, Link, Text } from '@chakra-ui/react';
import { FaHandSparkles } from 'react-icons/fa6';

const MY_LINK = 'https://www.linkedin.com/in/shawnjdesign';

const Tagline = () => (
  <HStack w='100%' bg='#e0e0e0' px={4} py={3} gap={1}>
    <FaHandSparkles color='black' />
    <Text textStyle='sm'>
      <Link
        _hover={{ opacity: 0.8, color: '#000' }}
        _focus={{ outlineWidth: 1, outlineColor: 'rgb(255,255,255,0.25)' }}
        variant='plain'
        href={MY_LINK}
        opacity={0.625}
        target='_blank'
        color='#000'
        transition={'opacity 0.2s ease-in-out'}
      >
        shawn jackson made this
      </Link>
    </Text>
  </HStack>
);

export default Tagline;
