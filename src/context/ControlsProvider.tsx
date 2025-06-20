import { useState, ReactNode } from 'react';
import { ControlsContext } from './ControlsContext';
import { getAllComps } from '../utils/helpers';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const storedComps = getAllComps();
  const firstComp = storedComps.length > 0 ? storedComps[0] : null;
  const storedBalance = firstComp ? firstComp.balance : 50;
  const storedDiff = firstComp ? firstComp.diff : 50;

  const [balance, setBalance] = useState(storedBalance);
  const [diff, setDiff] = useState(storedDiff);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  return (
    <ControlsContext.Provider
      value={{
        balance,
        comps: storedComps,
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
