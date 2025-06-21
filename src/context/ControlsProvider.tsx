import { useState, ReactNode, useEffect } from 'react';

import { ControlsContext } from './ControlsContext';
import { getAllComps } from '../utils/helpers';
import { CompValues } from '../types';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const [comps, setComps] = useState<CompValues[]>([]);
  const [balance, setBalance] = useState(50);
  const [diff, setDiff] = useState(50);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  useEffect(() => {
    const storedComps = getAllComps();
    const firstComp = storedComps.length > 0 ? storedComps[0] : null;
    if (firstComp) {
      setBalance(firstComp.balance);
      setComps(storedComps);
      setDiff(firstComp.diff);
    }
  }, []);

  return (
    <ControlsContext.Provider
      value={{
        balance,
        comps,
        diff,
        geomChecked,
        pathsChecked,
        setBalance,
        setComps,
        setDiff,
        setGeomChecked,
        setPathsChecked,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
}
