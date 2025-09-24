import { Input, Button, InputGroup, Box, Alert } from '@chakra-ui/react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useState } from 'react';

import { useSignup } from '../../hooks/useSignup';
import { toaster } from '../Toastier';

// @ts-expect-error Parameter 'errMsg' implicitly has an 'any' type
const onErrorCallback = (errMsg) => {
  toaster.create({
    description: errMsg,
    type: 'error',
  });
};

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signUp } = useSignup();

  const doSignUp = async () => {
    await signUp(inputs);
    if (error) {
      onErrorCallback('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Input
        placeholder='Email'
        type='email'
        size='sm'
        value={inputs.email}
        onChange={(e) => {
          setInputs({ ...inputs, email: e.target.value });
        }}
      />
      <Input
        placeholder='Username'
        type='text'
        size='sm'
        value={inputs.username}
        onChange={(e) => {
          setInputs({ ...inputs, username: e.target.value });
        }}
      />
      <Input
        placeholder='Full Name'
        type='text'
        size='sm'
        value={inputs.fullName}
        onChange={(e) => {
          setInputs({ ...inputs, fullName: e.target.value });
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
          placeholder='password'
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
        loading={loading}
        onClick={doSignUp}
        variant='outline'
      >
        Sign up
      </Button>
    </>
  );
};

export default Signup;
