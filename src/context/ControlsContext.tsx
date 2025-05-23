import { createContext } from 'react';
import { ControlsContextType } from '../types';

export const ControlsContext = createContext<ControlsContextType | undefined>(
  undefined
);
