// Canvas Capture with Web Worker
import { Button, Flex, Text } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { loggy } from '../utils/helpers';

const workerScript = `
let offscreenCanvas;
let context;

// Listen for messages from the main thread
onmessage = async (event) => {
  const { type, offscreenCanvas: receivedCanvas, width, height } = event.data;
  
  if (type === 'start') {
    offscreenCanvas = receivedCanvas;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    context = offscreenCanvas.getContext('2d');
    
    const totalFrames = 384;
    const capturedFrames = [];

    // The main thread is not blocked by this loop
    for (let i = 0; i < totalFrames; i++) {
      // 1. Drawing the next frame (simulated)
      context.clearRect(0, 0, width, height);
      context.fillStyle = \`hsl(\${(i * 360) / totalFrames}, 100%, 50%)\`;
      context.fillRect(0, 0, width, height);

      // 2. Convert the frame to a Blob
      const blob = await offscreenCanvas.convertToBlob({
        type: 'image/jpeg',
        quality: 0.8
      });
      capturedFrames.push(blob);
      
      // 3. Send progress back to the main thread
      postMessage({
        status: 'progress',
        payload: { currentFrame: i + 1, totalFrames }
      });
    }

    // 4. Send the complete frames back
    postMessage({
      status: 'complete',
      payload: capturedFrames
    });
  }
};
`;

const CanvasCaptureWithWorker = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Create a Blob from the worker script string and get a URL
    const workerBlob = new Blob([workerScript], {
      type: 'application/javascript',
    });
    const workerUrl = URL.createObjectURL(workerBlob);

    // Create the Web Worker instance
    const newWorker = new Worker(workerUrl);
    setWorker(newWorker);

    // Listen for messages from the worker
    newWorker.onmessage = (event) => {
      const { status, payload } = event.data;
      if (status === 'complete') {
        setMessage('Capture complete! Frames are ready for upload.');
        setIsCapturing(false);
        loggy.info('Received frames from worker:', payload);
      } else if (status === 'progress') {
        setMessage(
          `Capturing frame ${payload.currentFrame} of ${payload.totalFrames}...`
        );
      }
    };

    // Clean up the worker on component unmount
    return () => {
      newWorker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const startCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas || !worker) return;

    setMessage('Starting capture...');
    setIsCapturing(true);

    // Create an OffscreenCanvas and transfer it to the worker
    if ('transferControlToOffscreen' in canvas) {
      const offscreenCanvas = canvas.transferControlToOffscreen();

      // Send the canvas and capture parameters to the worker
      worker.postMessage(
        {
          type: 'start',
          offscreenCanvas,
          width: canvas.width,
          height: canvas.height,
        },
        [offscreenCanvas]
      ); // Pass the canvas as a transferable object
    } else {
      setMessage('Your browser does not support OffscreenCanvas.');
      setIsCapturing(false);
    }
  };

  return (
    <Flex
      direction='column'
      alignItems='center'
      padding='1rem'
      backgroundColor='#f3f4f6'
      minHeight='100vh'
    >
      <Text fontSize='1.5rem' fontWeight='bold' marginBottom='1rem'>
        Worker-assisted Canvas Capture
      </Text>
      <canvas
        ref={canvasRef}
        width='640'
        height='360'
        style={{ display: 'none' }}
      />
      <Button onClick={startCapture} disabled={isCapturing}>
        {isCapturing ? 'Capturing...' : 'Start Capture'}
      </Button>
      <Text marginTop='1rem' fontSize='1.125rem' fontWeight='500'>
        {message}
      </Text>
    </Flex>
  );
};

export default CanvasCaptureWithWorker;
