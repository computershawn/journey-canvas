class BeziCurve {
  constructor(curveSetPoints = {}) {
    let a211, a212, a222, c211, c212, c222;
    if (curveSetPoints !== null && Object.keys(curveSetPoints).length) {
      const {
        pt1, pt2, pt3, pt4, pt5, pt6
      } = curveSetPoints;
      c211 = new Point({x: pt4.x, y: pt4.y}, null);
      c212 = new Point({x: pt5.x, y: pt5.y}, null);
      c222 = new Point({x: pt6.x, y: pt6.y}, null);
      a211 = new Point({x: pt1.x, y: pt1.y}, c211);
      a212 = new Point({x: pt2.x, y: pt2.y}, c212);
      a222 = new Point({x: pt3.x, y: pt3.y}, c222);
    } else {
      const rMin = 48;
      const rMax = 96;
      const angle1 = random(TWO_PI);
      const radius1 = random(rMin, rMax);
      const angle2 = random(TWO_PI);
      const radius2 = random(rMin, rMax);
      const angle3 = random(TWO_PI);
      const radius3 = random(rMin, rMax);
      this.lastDragState = false;
  
      const x01 = cX - wd / 3;
      const y01 = cY + (random(1) > 0.5 ? 1 : -1) * random(0.5 * cY);
      const x02 = cX;
      const y02 = cY + (random(1) > 0.5 ? 1 : -1) * random(0.5 * cY);
      const x03 = cX + wd / 3;
      const y03 = cY + (random(1) > 0.5 ? 1 : -1) * random(0.5 * cY);
  
      const x04 = x01 + radius1 * cos(angle1);
      const y04 = y01 + radius1 * sin(angle1);
      const x05 = x02 + radius2 * cos(angle2);
      const y05 = y02 + radius2 * sin(angle2);
      const x06 = x03 + radius3 * cos(angle3);
      const y06 = y03 + radius3 * sin(angle3);
  
      c211 = new Point({x: x04, y: y04}, null);
      c212 = new Point({x: x05, y: y05}, null);
      c222 = new Point({x: x06, y: y06}, null);
      a211 = new Point({x: x01, y: y01}, c211);
      a212 = new Point({x: x02, y: y02}, c212);
      a222 = new Point({x: x03, y: y03}, c222);
    }

    this.cs = new CurveSet([c211, c212, c222, a211, a212, a222]);
  }

  render() {
    this.cs.render();
    this.lastDragState = dragging;
  }

  getPoints() {
    return this.cs.getPoints();
  }
}

class CurveSet {
  constructor(_points) {
    this.ctrl11 = _points[0];
    this.ctrl12 = _points[1];
    this.ctrl22 = _points[2];
    this.anchor11 = _points[3];
    this.anchor12 = _points[4];
    this.anchor22 = _points[5];
    this.ctrl21 = new Point({x: 0, y: 0}, null);
  }

  drawLines() {
    const {
      anchor11,
      anchor22,
      ctrl11,
      ctrl12,
      ctrl21,
      ctrl22,
    } = this;
    noFill();
    stroke(255, 0, 0, 127);
    line(anchor11.c.x, anchor11.c.y, ctrl11.c.x, ctrl11.c.y);
    line(ctrl12.c.x, ctrl12.c.y, ctrl21.c.x, ctrl21.c.y);
    line(anchor22.c.x, anchor22.c.y, ctrl22.c.x, ctrl22.c.y);
  }

  drawCircles() {
    const {
      anchor11,
      anchor12,
      anchor22,
      ctrl11,
      ctrl12,
      ctrl22,
    } = this;
    noFill();
    stroke(0, 71);

    const diam1 = this.getRadius(anchor11.c, ctrl11.c);
    const diam2 = this.getRadius(anchor12.c, ctrl12.c);
    const diam3 = this.getRadius(anchor22.c, ctrl22.c);

    circle(anchor11.c.x, anchor11.c.y, diam1);
    circle(anchor12.c.x, anchor12.c.y, diam2);
    circle(anchor22.c.x, anchor22.c.y, diam3);
  }

  getRadius(p0, p1) {
    const yDiff = p0.y - p1.y;
    const xDiff = p0.x - p1.x;

    return 2 * sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  getPoints() {
    const {
      ctrl11,
      ctrl12,
      ctrl21,
      ctrl22,
      anchor11,
      anchor12,
      anchor22,
    } = this;
    const temp = [];
    ctrl21.c.x = 2 * anchor12.c.x - ctrl12.c.x;
    ctrl21.c.y = 2 * anchor12.c.y - ctrl12.c.y;
    const half = numLoops / 2;

    for (let i = 0; i <= half; i++) {
      const t = i / half;
      const x = bezierPoint(anchor11.c.x, ctrl11.c.x, ctrl12.c.x, anchor12.c.x, t);
      const y = bezierPoint(anchor11.c.y, ctrl11.c.y, ctrl12.c.y, anchor12.c.y, t);
      temp.push({x, y});
    }

    for (let i = 1; i <= half; i++) {
      const t = i / half;
      const x = bezierPoint(anchor12.c.x, ctrl21.c.x, ctrl22.c.x, anchor22.c.x, t);
      const y = bezierPoint(anchor12.c.y, ctrl21.c.y, ctrl22.c.y, anchor22.c.y, t);
      temp.push({x, y});
    }

    return temp;
  }
  
  render() {
    const {
      anchor11,
      anchor12,
      anchor22,
      ctrl11,
      ctrl12,
      ctrl21,
      ctrl22,
    } = this;
    noFill();
    stroke(255, 0, 0);
    ctrl21.c.x = 2 * anchor12.c.x - ctrl12.c.x;
    ctrl21.c.y = 2 * anchor12.c.y - ctrl12.c.y;
    beginShape();
    vertex(anchor11.c.x, anchor11.c.y);
    bezierVertex(ctrl11.c.x, ctrl11.c.y, ctrl12.c.x, ctrl12.c.y, anchor12.c.x, anchor12.c.y);
    bezierVertex(ctrl21.c.x, ctrl21.c.y, ctrl22.c.x, ctrl22.c.y, anchor22.c.x, anchor22.c.y);
    endShape();

    // Show points
    noStroke();
    fill(0, 0, 0, 95);
    anchor11.render();
    anchor12.render();
    anchor22.render();
    ctrl11.render();
    ctrl12.render();
    ctrl22.render();

    // Show handles
    this.drawLines();
    this.drawCircles();
  }
}

class Point {
  constructor(_coords, _childPoint) {
    this.c = _coords;
    this.active = false;
    this.diam = 4;
    this.childPoint = _childPoint;
  }

  isHover() {
    if (dist(mouseX, mouseY, this.c.x, this.c.y) < 8 * this.diam) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { c, childPoint, diam, isHover } = this;
    stroke(0);
    fill(0, 0, 0, 95);
    circle(c.x, c.y, diam);
    noFill();
    if (this.isHover()) {
      stroke(0, 127, 255);
      fill(0, 127, 255, 95);
      circle(c.x, c.y, diam * 8);
      noStroke();

      if (dragging) {
        c.x = mouseX;
        c.y = mouseY;

        if (childPoint !== null) {
          if (!lastDragState) {
            mouseDX = childPoint.c.x - c.x;
            mouseDY = childPoint.c.y - c.y;
          }
          childPoint.c.x = c.x + mouseDX;
          childPoint.c.y = c.y + mouseDY;
        }
      }
    }
  }
}