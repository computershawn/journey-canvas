import { useState } from 'react';

import { useLogin } from '../../hooks/useLogin';
import { Alert, Button, Input } from '@chakra-ui/react';

const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const { loading, error, login } = useLogin();
  const doLogin = async () => {
    await login(inputs);
  };

  // TODO: Getting this warning: Password field is not contained in a form: (More info: https://goo.gl/9p2vKq)
  //       Maybe the input elements should be wrapped in a form element

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

      <Button
        w='full'
        size='sm'
        loading={loading}
        onClick={doLogin}
        variant='outline'
      >
        Log in
      </Button>
    </>
  );
};

export default Login;
