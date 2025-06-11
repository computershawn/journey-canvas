import { useState, useRef, useEffect } from 'react';

export function useTimeLoop(duration: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(0);
  const animationFrameId = useRef<null | number>(null);
  const zero = useRef(0);
  const lastValue = useRef(0); // Track the last value

  const pause = () => {
    if (isPlaying && typeof animationFrameId.current === 'number') {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
      lastValue.current = value; // Save the current value when paused
    }
  };

  const play = () => {
    if (!isPlaying) {
      requestAnimationFrame((timestamp) => {
        zero.current = timestamp - lastValue.current * duration; // Adjust zero based on last value
        animate(timestamp);
      });
      setIsPlaying(true);
    }
  };

  function animate(timestamp: number) {
    const elapsed = timestamp - zero.current;
    const val = (elapsed % duration) / duration;
    setValue(val);
    animationFrameId.current = requestAnimationFrame((t) => animate(t));
  }

  useEffect(() => {
    return () => {
      if (typeof animationFrameId.current === 'number') {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return {
    value,
    isPlaying,
    play,
    pause,
  };
}
