class Fan {
  constructor(_pts) {
    this.fanBlades = [];
    this.nullElements = [];

    // Initialize null elements
    for (let j = 0; j < _pts.length; j++) {
      this.nullElements.push(new NullElement(_pts[j], j));
    }

    for (let j = 0; j < this.nullElements.length - 1; j++) {
      const points = {
        pt0: { x: 0, y: 0 },
        pt1: { x: 0, y: 0 },
        pt2: { x: 0, y: 0 },
        pt3: { x: 0, y: 0 },
      };
      const fb = new FanBlade(points, j);
      this.fanBlades.push(fb);
    };
  }

  update(currentCycleFrame) {
    // Update all positions of our references
    this.nullElements.forEach(nE => {
      nE.update(currentCycleFrame);
    });

    for (let j = 0; j < this.nullElements.length - 1; j++) {
      const thisRef = this.nullElements[j];
      const nextRef = this.nullElements[j + 1];

      const px0 = thisRef.point0.x + thisRef.x;
      const py0 = thisRef.point0.y + thisRef.y;
      const px1 = thisRef.point1.x + thisRef.x;
      const py1 = thisRef.point1.y + thisRef.y;
      const px2 = nextRef.point1.x + nextRef.x;
      const py2 = nextRef.point1.y + nextRef.y;
      const px3 = nextRef.point0.x + nextRef.x;
      const py3 = nextRef.point0.y + nextRef.y;

      // const co = color(lerpColor(color(239), white, values[i]), 223);
      // const co = color(255, 239);
      // const fb = fanBladesArr[j];
      const pv0 = { x: px0, y: py0 };
      const pv1 = { x: px1, y: py1 };
      const pv2 = { x: px2, y: py2 };
      const pv3 = { x: px3, y: py3 };

      this.fanBlades[j].update(pv0, pv1, pv2, pv3);
    }
  }

  render() {
    const canv = document.getElementById("canv");

    if (canv.getContext) {
      const ctx = canv.getContext('2d');
      this.fanBlades.forEach(fb => {
        fb.render(ctx);
      });
    }
  }
}