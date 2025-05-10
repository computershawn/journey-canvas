class Particle {
  constructor(_pos, _heading) {
    this.x0 = _pos.x;
    this.y0 = _pos.y;
    this.pos = _pos;
    this.diam = round(random(4, 6));
    this.travel = this.pos.x + this.diam;
    this.lifespan = 200 + round(random(200));
    this.currentFrame = floor(random(this.lifespan));
    this.opacity = 0;
    this.xStretch = 0;
    this.heading = _heading;
    this.speed = random(0.8, 1.2);
    this.spinSpeed = round(random(32, 64));
    this.fadeTime = 24;
  }

  reset(newPoint, newHeading) {
    this.currentFrame = 0;
    this.lifespan = 200 + round(random(200));
    this.x0 = newPoint.x;
    this.y0 = newPoint.y;
    this.pos = createVector(newPoint.x, newPoint.y);
    this.travel = this.pos.x + this.diam;
    this.heading = newHeading;
  }

  isOutside() {
    const { pos: { x, y }, diam } = this;
    return x < -1 * diam ||
      x > wd + diam ||
      y < -1 * diam ||
      y > ht + diam;
  }

  update() {
    let {currentFrame, pos, spinSpeed} = this;
    const {x0, y0, speed, heading, fadeTime} = this;
    const a = TWO_PI * (currentFrame % spinSpeed) / spinSpeed;
    this.xStretch = sin(a);
    if (this.currentFrame < fadeTime) {
      this.opacity = round(159 * currentFrame / fadeTime);
    } else {
      this.opacity = 159;
    }
    // const amt = easeInQuad(currentFrame / lifespan);
    // pos.x = x0 - amt * travel;
    pos.x = x0 + currentFrame * speed * cos(heading);
    pos.y = y0 + currentFrame * speed * sin(heading);
    this.currentFrame += 1;
  }

  render() {
    const {
      opacity, pos, xStretch, diam, co, heading,
    } = this;
    stroke(47, opacity);
    // fill(co, opacity);
    fill(255, 223);
    push();
    translate(pos.x, pos.y);
    rotate(heading)
    ellipse(0, 0, xStretch * diam, diam);
    pop();
  }
}