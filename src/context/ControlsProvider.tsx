import { useState, ReactNode, useEffect } from 'react';

import { ControlsContext } from './ControlsContext';
import { CompValues } from '../types';
import { useCompositions } from '../hooks/useCompositions';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const [comps, setComps] = useState<CompValues[]>([]);
  const [balance, setBalance] = useState(50);
  const [diff, setDiff] = useState(50);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);

  const { dbComps, loadingComps } = useCompositions();

  useEffect(() => {
    if (!loadingComps && dbComps.length > 0) {
      const firstComp = dbComps[0];
      setBalance(firstComp.balance);
      setComps(dbComps);
      setDiff(firstComp.diff);
    } else if (!loadingComps && dbComps.length === 0) {
      setComps([]);
    }
  }, [dbComps, loadingComps]);

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
