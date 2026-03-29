import { FaArrowRightFromBracket, FaUserAstronaut } from 'react-icons/fa6';

import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useLogout } from '../hooks/useLogout';
import { toaster } from './ui/toaster';
import { Tooltip } from './ui/tooltip';

const onErrorCallback = (errMsg: string) => {
  toaster.create({
    description: errMsg,
    type: 'error',
  });
};

const UserInfo = ({ userEmail }: { userEmail: string }) => {
  const { handleLogout, isLoggingOut } = useLogout(onErrorCallback);

  return (
    <Flex w='100%' h={8} align='center' justify='space-between'>
      <Flex gap={1} align='center'>
        <FaUserAstronaut />
        <Text textStyle='sm'>{userEmail}</Text>
      </Flex>
      <Tooltip content='Sign out of account' openDelay={500} closeDelay={200}>
        <IconButton
          size='xs'
          aria-label='Sign out of account'
          onClick={handleLogout}
          color='black'
          loading={isLoggingOut}
          disabled={isLoggingOut}
        >
          <FaArrowRightFromBracket color='black' />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export default UserInfo;
