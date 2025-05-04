class FanBlade {
  constructor(_pts, _index) {
    this.center = {x: 0, y: 0};
    this.index = _index;
    this.isOpaque = Math.random() > 0.1;
    this.topEdge = Math.random() > 0.5 ? true : false;
    this.points = _pts;
    this.co = this.isOpaque ? '#ffffff' : '#00000080';
    this.altColorIndex = Math.floor(Math.random() * numColors);
    const n0 = 143;
    const n1 = 247;
    this.altColorOpacity = Math.round(n0 + Math.random() * (n1 - n0));
    this.value = Math.random();
    const maxTicks = 40;
    this.colorStartIndex = Math.floor(Math.random() * maxTicks);
  }

  update(pt0, pt1, pt2, pt3) {
    this.points.pt0 = pt0;
    this.points.pt1 = pt1;
    this.points.pt2 = pt2;
    this.points.pt3 = pt3;
    this.center.x = 0.5 * (pt0.x + pt2.x);
    this.center.y = 0.5 * (pt0.y + pt2.y);
  }

  // getHeading() {
  //   const {
  //     center,
  //     points: { pt0, pt1, pt2, pt3 },
  //   } = this;
  //   const vec = this.topEdge
  //     ? {x: (pt3.x + pt0.x) / 2, y: (pt3.y + pt0.y) / 2}
  //     : {x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2};
  //   const trajVec = {x: center.x - vec.x, y: center.y - vec.y};

  //   return trajVec.heading();
  // }

  // render() {
  //   const {
  //     altColorIndex,
  //     altColorOpacity,
  //     isOpaque,
  //     co,
  //     points: { pt0, pt1, pt2, pt3 },
  //     value,
  //   } = this;

  //   // Shadow effect
  //   strokeCap(SQUARE);
  //   strokeWeight(3);
  //   stroke(0, 55);
  //   line(pt0.x, pt0.y, pt1.x, pt1.y);
  //   line(pt3.x, pt3.y, pt0.x, pt0.y);

  //   strokeWeight(1);
  //   stroke(0, 63);
  //   fill(co);
  //   if (showColor && !isOpaque && palette.length) {
  //     const c = palette[altColorIndex];
  //     const altColor = color(red(c), green(c), blue(c), altColorOpacity);
  //       fill(altColor);
  //   }
  //   beginShape();
  //   vertex(pt0.x, pt0.y);
  //   vertex(pt1.x, pt1.y);
  //   vertex(pt2.x, pt2.y);
  //   vertex(pt3.x, pt3.y);
  //   // texture(img);
  //   // vertex(point0.x, point0.y, point0.x, point0.y);
  //   // vertex(point1.x, point1.y, point1.x, point1.y);
  //   // vertex(point2.x, point2.y, point2.x, point2.y);
  //   // vertex(point3.x, point3.y, point3.x, point3.y);
  //   endShape(CLOSE);

  //   // noStroke();
  //   // fill(0, 31);
  //   // beginShape();
  //   // vertex(pt0.x, pt0.y);
  //   // vertex(pt0.x + value * (pt1.x - pt0.x), pt0.y + value * (pt1.y - pt0.y));
  //   // vertex(pt3.x + value * (pt2.x - pt3.x), pt3.y + value * (pt2.y - pt3.y));
  //   // vertex(pt3.x, pt3.y);
  //   // endShape(CLOSE);
  //   noFill();

  //   // Render tick marks
  //   if (isOpaque && showColor) {
  //     const longSide = max(dist(pt0.x, pt0.y, pt1.x, pt1.y), dist(pt2.x, pt2.y, pt3.x, pt3.y));
  //     const len = constrain(longSide, 1, 200);
  //     const numTicks = map(len, 1, 200, 1, maxTicks);
  
  //     for (let j = 1; j < numTicks; j++) {
  //       const b = j / numTicks;
  //       if (palette.length && tickSequence.length) {
  //         const tickMarkIndex = this.colorStartIndex + j - 1;
  //         const tickColor = palette[tickSequence[tickMarkIndex]];
  //         stroke(tickColor);
  //       }
  //       line(
  //         pt0.x + b * value * (pt1.x - pt0.x),
  //         pt0.y + b * value * (pt1.y - pt0.y),
  //         pt3.x + b * value * (pt2.x - pt3.x),
  //         pt3.y + b * value * (pt2.y - pt3.y)
  //       );
  //     }
  //   }
  // }

  render(context) {
    const {
      // altColorIndex,
      // altColorOpacity,
      isOpaque,
      co,
      points: { pt0, pt1, pt2, pt3 },
      value,
    } = this;

    // Shadow effect
    // strokeCap(SQUARE);
    // strokeWeight(3);
    // stroke(0, 55);
    // line(pt0.x, pt0.y, pt1.x, pt1.y);
    // line(pt3.x, pt3.y, pt0.x, pt0.y);

    // strokeWeight(1);
    // stroke(0, 63);
    // fill(co);
    // if (showColor && !isOpaque && palette.length) {
    //   const c = palette[altColorIndex];
    //   const altColor = color(red(c), green(c), blue(c), altColorOpacity);
    //     fill(altColor);
    // }

    context.fillStyle = 'white';
    context.beginPath();
    context.moveTo(pt0.x, pt0.y);
    context.lineTo(pt1.x, pt1.y);
    context.lineTo(pt2.x, pt2.y);
    context.lineTo(pt3.x, pt3.y);
    context.closePath();
    context.stroke();
    context.fill();

    // noFill();
    // Render tick marks
    if (isOpaque && showColor) {
      const dx1 = pt0.x - pt1.x;
      const dy1 = pt0.y - pt1.y;
      const dx2 = pt2.x - pt3.x;
      const dy2 = pt2.y - pt3.y;
      const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const longSide = Math.max(dist1, dist2);
      let len = longSide;
      if (longSide < 1) {
        len = 1;
      } else if (longSide > 200) {
        len = 200;
      }

      // const numTicks = Math.round(len / (200 - 1) * (maxTicks - 1));
      const numTicks = Math.round(mapTo(len, 1, 200, 1, maxTicks));
  
      for (let j = 1; j < numTicks; j++) {
        const b = j / numTicks;
        // if (palette.length && tickSequence.length) {
        //   const tickMarkIndex = this.colorStartIndex + j - 1;
        //   const tickColor = palette[tickSequence[tickMarkIndex]];
        //   stroke(tickColor);
        // }

        context.beginPath();
        context.moveTo(
          pt0.x + b * value * (pt1.x - pt0.x),
          pt0.y + b * value * (pt1.y - pt0.y)
        );
        context.lineTo(
          pt3.x + b * value * (pt2.x - pt3.x),
          pt3.y + b * value * (pt2.y - pt3.y)
        );
        // context.lineTo(pt2.x, pt2.y);
        // context.lineTo(pt3.x, pt3.y);
        // context.closePath();
        context.stroke();
        // console.log(pt3.x);
    
        // line(
        //   pt0.x + b * value * (pt1.x - pt0.x),
        //   pt0.y + b * value * (pt1.y - pt0.y),
        //   pt3.x + b * value * (pt2.x - pt3.x),
        //   pt3.y + b * value * (pt2.y - pt3.y)
        // );
      }
    }
  }
}

export default FanBlade;
