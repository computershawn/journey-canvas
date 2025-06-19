import { useState, ReactNode } from 'react';
import { ControlsContext } from './ControlsContext';
import { getAllComps, getComp } from '../utils/helpers';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const comps = getAllComps();
  const isComp = comps.length > 0;

  let storedBalance = 50;
  let storedCycleFrame = 1;
  let storedDiff = 50;

  if (isComp) {
    const currentComp = getComp(comps[0]);
    storedBalance = parseInt(currentComp.storedBalance);
    storedCycleFrame = parseInt(currentComp.storedCycleFrame);
    storedDiff = parseInt(currentComp.storedDiff);
  }

  const [balance, setBalance] = useState(storedBalance);
  const [cycleFrame, setCycleFrame] = useState(storedCycleFrame);
  const [diff, setDiff] = useState(storedDiff);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  return (
    <ControlsContext.Provider
      value={{
        balance,
        cycleFrame,
        diff,
        geomChecked,
        pathsChecked,
        setBalance,
        setCycleFrame,
        setDiff,
        setGeomChecked,
        setPathsChecked,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
}
