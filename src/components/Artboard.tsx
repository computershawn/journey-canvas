import { useMemo } from 'react';

import { NUM_POINTS } from '../constants';
import { useControls } from '../hooks/useControls';
import { ColorArray, CtrlPoint } from '../types';
import BeziControls from './BeziControls';
import Composition from './Composition';

const Artboard = ({
  backgroundIndex,
  beziCtrlPts,
  bgChecked,
  colorChecked,
  compIndex,
  isWide,
  palette,
  setBeziCtrlPts,
}: {
  backgroundIndex: number;
  beziCtrlPts: CtrlPoint[];
  bgChecked: boolean;
  colorChecked: boolean;
  compIndex: number;
  isWide: boolean;
  palette: ColorArray;
  setBeziCtrlPts: (points: CtrlPoint[]) => void;
}) => {
  const bezierSplinePoints = useMemo(() => {
    const getBezierSegmentPoints = (
      p0: CtrlPoint,
      p1: CtrlPoint,
      p2: CtrlPoint,
      p3: CtrlPoint,
      num: number
    ) => {
      const temp = [];
      for (let i = 0; i <= num; i++) {
        const t = i / num;
        const x =
          Math.pow(1 - t, 3) * p0.x +
          3 * Math.pow(1 - t, 2) * t * p1.x +
          3 * (1 - t) * t * t * p2.x +
          t * t * t * p3.x;
        const y =
          Math.pow(1 - t, 3) * p0.y +
          3 * Math.pow(1 - t, 2) * t * p1.y +
          3 * (1 - t) * t * t * p2.y +
          t * t * t * p3.y;

        temp.push({ x, y });
      }

      return temp;
    };

    const getBezierSplinePoints = (points: CtrlPoint[]) => {
      const n = (NUM_POINTS - 1) / 2;
      const [p0, p1, p2, p3, p5, p6] = points;
      const p4: CtrlPoint = {
        x: 2 * p3.x - p2.x,
        y: 2 * p3.y - p2.y,
        child: null,
      };
      const bezierPoints1 = getBezierSegmentPoints(p0, p1, p2, p3, n);
      const tempSet = getBezierSegmentPoints(p3, p4, p5, p6, n);

      // First point in tempSet is a redundant duplicate of last point in bezierPoints2
      // We can use array destructuring to throw out the first point in tempSet
      const bezierPoints2 = tempSet.slice(1);
      return [...bezierPoints1, ...bezierPoints2];
    };

    if (beziCtrlPts.length) {
      return getBezierSplinePoints(beziCtrlPts);
    }

    return [];
  }, [beziCtrlPts]);

  const { comps } = useControls();
  const comp = comps.length > 0 ? comps[compIndex] : null;

  return (
    <>
      <Composition
        backgroundIndex={backgroundIndex}
        renderColors={colorChecked}
        showBackground={bgChecked}
        bezierSplinePoints={bezierSplinePoints}
        palette={palette}
      />
      <BeziControls
        comp={comp}
        isWide={isWide}
        points={beziCtrlPts}
        setBeziCtrlPts={setBeziCtrlPts}
      />
    </>
  );
};

export default Artboard;
