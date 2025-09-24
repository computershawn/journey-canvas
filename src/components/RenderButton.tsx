import { FaClapperboard } from 'react-icons/fa6';
import { Tooltip } from './ui/tooltip';
import { IconButton } from '@chakra-ui/react';

const RenderButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void | Promise<void>;
}) => {
  return (
    <Tooltip content='Create video file' openDelay={500} closeDelay={200}>
      <IconButton
        aria-label='Create video file'
        color='#4a4a4a'
        _hover={{ color: '#ff008cff', transition: 'color .3s ease' }}
        disabled={disabled}
        onClick={onClick}
        size='xs'
        variant='outline'
      >
        <FaClapperboard />
      </IconButton>
    </Tooltip>
  );
};

export default RenderButton;
