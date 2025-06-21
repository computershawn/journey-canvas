import { createContext } from 'react';
import { ControlsContextType } from '../types';

export const ControlsContext = createContext<ControlsContextType>({
  balance: 0,
  setBalance: () => {},
  comps: [],
  setComps: () => {},
  diff: 0,
  setDiff: () => {},
  geomChecked: true,
  setGeomChecked: () => {},
  pathsChecked: true,
  setPathsChecked: () => {},
});
