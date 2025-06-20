import { useState, ReactNode } from 'react';
import { ControlsContext } from './ControlsContext';
import { getAllComps, getComp } from '../utils/helpers';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const comps = getAllComps();
  const firstComp = comps.length > 0 ? getComp(comps[0]) : null;
  const storedBalance = firstComp ? parseInt(firstComp.balance) : 50;
  const storedDiff = firstComp ? parseInt(firstComp.diff) : 50;

  const [balance, setBalance] = useState(storedBalance);
  const [diff, setDiff] = useState(storedDiff);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  return (
    <ControlsContext.Provider
      value={{
        balance,
        comps,
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
