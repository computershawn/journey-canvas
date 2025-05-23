import { useState, ReactNode } from 'react';
import { ControlsContext } from './ControlsContext';
import { getAllComps, getComp } from '../utils/helpers';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const comps = getAllComps();
  const currentComp = getComp(comps[0]);
  const storedBalance = parseInt(currentComp.storedBalance);
  const storedCycleFrame = parseInt(currentComp.storedCycleFrame);
  const storedDiff = parseInt(currentComp.storedDiff);

  const [balance, setBalance] = useState(storedBalance);
  const [cycleFrame, setCycleFrame] = useState(storedCycleFrame);
  const [diff, setDiff] = useState(storedDiff);

  return (
    <ControlsContext.Provider value={{ balance, setBalance, cycleFrame, setCycleFrame, diff, setDiff }}>
      {children}
    </ControlsContext.Provider>
  );
}
