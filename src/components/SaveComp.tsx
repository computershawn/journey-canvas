// import { useState } from 'react';
// import {
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   FormControl,
//   FormLabel,
//   Input,
//   useDisclosure,
// } from '@chakra-ui/react';

// const SaveComp = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [inputValue, setInputValue] = useState('');

//   const handleSubmit = () => {
//     // Handle submission of inputValue (e.g., send it to an API)
//     console.log('Submitted value:', inputValue);
//     onClose(); // Close the modal after submission
//   };

//   return (
//     <>
//       <Button onClick={onOpen}>Open Dialog with Input</Button>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Enter Information</ModalHeader>
//           <ModalBody>
//             <FormControl>
//               <FormLabel>Your Input</FormLabel>
//               <Input
//                 placeholder='Enter text here'
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//               />
//             </FormControl>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant='ghost' onClick={onClose}>
//               Cancel
//             </Button>
//             <Button colorScheme='blue' ml={3} onClick={handleSubmit}>
//               Submit
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }

import { useState } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from '@chakra-ui/react';
import { FaFloppyDisk } from 'react-icons/fa6';

const SaveComp = ({ onClickSave }: { onClickSave: (name: string) => void }) => {
  const [compName, setCompName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant='outline'
          w='full'
          mt='auto'
          aria-label='Save composition'
          onClick={() => onClickSave(compName)}
        >
          <FaFloppyDisk color='black' /> Save Composition
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Save Composition</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Field.Root invalid>
                <Field.Label>Email</Field.Label>
                <Input placeholder='Enter a name for this composition' />
                <Field.ErrorText>This field is required</Field.ErrorText>
                {/* <Field.HelperText>We'll never share your email.</Field.HelperText> */}
              </Field.Root>
              {/* <FormControl>
                <FormLabel>Your Input</FormLabel>
                <Input
                  placeholder='Enter text here'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </FormControl> */}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' aria-label='Cancel'>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant='outline'
                aria-label='Save composition'
                onClick={() => onClickSave(compName)}
              >
                <FaFloppyDisk color='black' /> Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton variant='outline' size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default SaveComp;
