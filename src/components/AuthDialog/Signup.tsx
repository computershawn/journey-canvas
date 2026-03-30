import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

import {
  Alert,
  Button,
  Input,
  InputGroup,
  Box,
  VStack,
} from '@chakra-ui/react';

import { useSignup } from '../../hooks/useSignup';

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signUp } = useSignup();

  const doSignUp = async () => {
    await signUp(inputs);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        doSignUp();
      }}
    >
      <VStack gap={4}>
        <Input
          placeholder='Email'
          type='email'
          size='sm'
          value={inputs.email}
          onChange={(e) => {
            setInputs({ ...inputs, email: e.target.value });
          }}
        />
        <InputGroup
          endElement={
            <Box onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <LuEye /> : <LuEyeOff />}
            </Box>
          }
        >
          <Input
            placeholder='Password'
            type={showPassword ? 'text' : 'password'}
            size='sm'
            value={inputs.password}
            onChange={(e) => {
              setInputs({ ...inputs, password: e.target.value });
            }}
          />
        </InputGroup>

        {error && (
          <Alert.Root size='sm' status='error' title='Something went wrong'>
            <Alert.Indicator />
            <Alert.Title>Something went wrong</Alert.Title>
          </Alert.Root>
        )}

        <Button
          w='full'
          size='sm'
          type='submit'
          loading={loading}
          variant='outline'
        >
          Sign up
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
