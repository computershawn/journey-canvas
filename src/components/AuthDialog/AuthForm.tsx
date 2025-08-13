import { useState } from 'react';

import { Box, Button, Center, Flex, Text, VStack } from '@chakra-ui/react';

import Login from './Login';
import Signup from './Signup';
import { FaCircleInfo } from 'react-icons/fa6';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Flex align='center' gap='0.25rem' mb={2}>
        <FaCircleInfo />
        <Text fontSize='sm'>
          You&apos;ll need to sign in to render your animation as a video
        </Text>
      </Flex>
      <Box>
        <VStack gap={4}>{isLogin ? <Login /> : <Signup />}</VStack>
      </Box>
      <Box mt={1}>
        <Center>
          <Text fontSize='sm'>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <Button
            fontSize='var(--chakra-fontSizes-sm)'
            onClick={() => setIsLogin(!isLogin)}
            size='xs'
            px={1}
            variant='outline'
            backgroundColor='transparent'
            _hover={{ borderColor: 'transparent' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Button>
        </Center>
      </Box>
    </>
  );
}
