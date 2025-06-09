import { useState, useRef, useEffect } from 'react';

export function useAnimationLoop(duration: number) {
  const [t, setT] = useState(0);
  const animationFrameId = useRef<null | number>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const animate = () => {
    setT((prevT) => {
      if (prevT >= duration) return 0;

      return prevT + 1;
    });

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const play = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      animate();
    }
  };

  const pause = () => {
    if (isPlaying && typeof animationFrameId.current === 'number') {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (typeof animationFrameId.current === 'number') {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return {
    t,
    isPlaying,
    play,
    pause,
  };
}
