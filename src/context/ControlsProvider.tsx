import { useState, ReactNode, useEffect } from 'react';

import { ControlsContext } from './ControlsContext';
import { CompValues } from '../types';
import { useCompositions } from '../hooks/useCompositions';
import VideoPreviewModal from '../components/VideoPreviewModal';

export function ControlsProvider({ children }: { children: ReactNode }) {
  const [comps, setComps] = useState<CompValues[]>([]);
  const [balance, setBalance] = useState(50);
  const [diff, setDiff] = useState(50);
  const [geomChecked, setGeomChecked] = useState(true);
  const [pathsChecked, setPathsChecked] = useState(true);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const { dbComps, loadingComps } = useCompositions();

  useEffect(() => {
    if (!loadingComps && dbComps.length > 0) {
      setComps(dbComps);
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
        // Keep loadingComps true until comps is actually synced from dbComps,
        // preventing a one-render gap where loadingComps=false but comps=[].
        loadingComps: loadingComps || (dbComps.length > 0 && comps.length === 0),
        previewVideoUrl,
        setPreviewVideoUrl,
      }}
    >
      {children}
      <VideoPreviewModal
        open={!!previewVideoUrl}
        setOpen={(open) => {
          if (!open) setPreviewVideoUrl(null);
        }}
        videoUrl={previewVideoUrl || undefined}
      />
    </ControlsContext.Provider>
  );
}
