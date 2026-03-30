import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import { ColorArray, CompValues } from '../types';

export const useInitialCompLoad = (
  comps: CompValues[],
  setBackgroundIndex: (index: number) => void,
  setBalance: (balance: number) => void,
  setDiff: (diff: number) => void,
  setPalette: (palette: ColorArray) => void,
  setCompId: (id: string[]) => void,
  onChangeComp: (index: number) => void,
) => {
  const [hasLoadedInitialComp, setHasLoadedInitialComp] = useState(false);
  const [authUser] = useAuthState(auth);

  useEffect(() => {
    if (!authUser) {
      if (hasLoadedInitialComp) setHasLoadedInitialComp(false);
      return;
    }

    if (!hasLoadedInitialComp && comps.length > 0) {
      setHasLoadedInitialComp(true);
      const newBalance = comps[0].balance ?? 0;
      const newDiff = comps[0].diff ?? 0;
      const newPalette = comps[0].palette ?? Array(5).fill('#fff');
      const newBgIndex = comps[0].backgroundIndex ?? 0;

      setBackgroundIndex(newBgIndex);
      setBalance(newBalance);
      setDiff(newDiff);
      setPalette(newPalette);
      setCompId([comps[0].id]);
      onChangeComp(0);
    }
  }, [
    authUser,
    comps,
    hasLoadedInitialComp,
    setBackgroundIndex,
    setBalance,
    setDiff,
    setPalette,
    onChangeComp,
    setCompId,
  ]);
};
