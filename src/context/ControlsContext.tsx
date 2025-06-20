import { createContext } from 'react';
import { ControlsContextType } from '../types';

export const ControlsContext = createContext<ControlsContextType>({
  balance: 0,
  setBalance: () => {},
  diff: 0,
  setDiff: () => {},
  geomChecked: true,
  setGeomChecked: () => {},
  pathsChecked: true,
  setPathsChecked: () => {},
  comps: [],
});
