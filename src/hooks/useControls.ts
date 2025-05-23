import { useContext } from 'react';

import { ControlsContext } from '../context/ControlsContext';

export function useControls() {
  const context = useContext(ControlsContext);
  if (context === undefined) {
    throw new Error('useControls must be used within a ControlsProvider');
  }

  return context;
}