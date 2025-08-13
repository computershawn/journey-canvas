import { useState } from 'react';

import { useLogin } from '../../hooks/useLogin';
import { toaster } from '../Toastier';
import { Alert, Button, Input } from '@chakra-ui/react';

const onErrorCallback = (errMsg: string) => {
  toaster.create({
    description: errMsg,
    type: 'error',
  });
};

const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const { error, login } = useLogin();

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
        placeholder='Password'
        type='password'
        size='sm'
        value={inputs.password}
        onChange={(e) => {
          setInputs({ ...inputs, password: e.target.value });
        }}
      />

      {error && (
        <Alert.Root size='sm' status='error' title='Something went wrong'>
          <Alert.Indicator />
          <Alert.Title>Something went wrong</Alert.Title>
        </Alert.Root>
      )}

      <Button w='full' size='sm' onClick={() => login(inputs, onErrorCallback)} variant="outline">
        Log in
      </Button>
    </>
  );
};

export default Login;
