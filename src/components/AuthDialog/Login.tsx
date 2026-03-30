import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

import {
  Alert,
  Box,
  Button,
  Input,
  InputGroup,
  VStack,
} from '@chakra-ui/react';

import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, login } = useLogin();
  const doLogin = async () => {
    await login(inputs);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        doLogin();
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
          <Alert.Root
            size='sm'
            status='error'
            title='Incorrect email or password'
          >
            <Alert.Indicator />
            <Alert.Title>Incorrect email or password</Alert.Title>
          </Alert.Root>
        )}

        <Button
          w='full'
          size='sm'
          type='submit'
          loading={loading}
          variant='outline'
        >
          Log in
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
