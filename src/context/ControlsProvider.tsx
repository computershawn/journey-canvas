import { useState, ReactNode } from 'react';
import { ControlsContext } from './ControlsContext';
import { getAllComps, getComp } from '../utils/helpers';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const comps = getAllComps();

  let storedBalance = 50;
  let storedDiff = 50;

  if (comps.length > 0) {
    const currentComp = getComp(comps[0]);
    storedBalance = parseInt(currentComp.balance);
    storedDiff = parseInt(currentComp.diff);
  }

  const [balance, setBalance] = useState(storedBalance);
  const [diff, setDiff] = useState(storedDiff);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  return (
    <ControlsContext.Provider
      value={{
        balance,
        diff,
        geomChecked,
        pathsChecked,
        setBalance,
        setDiff,
        setGeomChecked,
        setPathsChecked,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
}
