let minRadius = 50;
let maxRadius = 55;

let palette = [
  "#F13F87", "#4BABFF", "#A6C054", "#FF8A00", "#00C2A8",
  "#7A5CFF", "#FF4D4D", "#FFE500", "#00A0FF", "#FF6EC7"
];

let lastSample = 0;
let sampleInterval = 120;
let arcs = [];

let lastX = 0;
let lastY = 0;

class Arc {
  constructor(x, y) {
    this.colors = this.pickColors();

    const maxSweep = radians(245);
    this.targetSweep = random(0.01, maxSweep);
    this.start = random(0, TWO_PI - this.targetSweep);

    this.r = random(minRadius, maxRadius);

    this.cx = x - this.r * cos(this.start);
    this.cy = y - this.r * sin(this.start);

    this.progress = 0;
    this.outroProgress = 0;
    this.introDone = false;

    this.outroStart = millis() + 100;
  }

  pickColors() {
    let c1 = random(palette);
    let c2 = random(palette);
    let c3 = random(palette);
    while (c2 === c1) c2 = random(palette);
    while (c3 === c1 || c3 === c2) c3 = random(palette);
    return [c1, c2, c3];
  }

  update() {
    let now = millis();

    if (!this.introDone) {
      this.progress += 0.08;
      if (this.progress >= 1) {
        this.progress = 1;
        this.introDone = true;
      }
    }

    if (now > this.outroStart) {
      this.outroProgress += 0.05;
      if (this.outroProgress >= 1) this.outroProgress = 1;
    }
  }

  drawLayer(col, weight) {
    stroke(col);
    strokeWeight(weight);

    let visible = this.progress * (1 - this.outroProgress);
    if (visible <= 0) return;

    let sweep = this.targetSweep * visible;
    let end = this.start + sweep;

    arc(this.cx, this.cy, this.r * 2, this.r * 2, this.start, end);
  }

  draw() {
    this.drawLayer(this.colors[0], 100);
    this.drawLayer(this.colors[1], 60);
    this.drawLayer(this.colors[2], 20);
  }

  dead() {
    return this.outroProgress >= 1;
  }
}

//windowWidth and windowHeight are p5 variables that give us flexibility across different screen sizes and allow for styling
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container");

  angleMode(RADIANS);
  noFill();
}

function draw() {
  clear();

  for (let a of arcs) {
    a.update();
    a.draw();
  }

  arcs = arcs.filter(a => !a.dead());

  // movement-based interaction
  let d = dist(mouseX, mouseY, lastX, lastY);

  if (d > 8) {
    let now = millis();
    if (now - lastSample > sampleInterval) {
      arcs.push(new Arc(mouseX, mouseY));
      lastSample = now;
    }
  }

  lastX = mouseX;
  lastY = mouseY;
}

//we need this window resized function to make sure the canvas resizes properly when the window size changes, ensuring the background remains full-screen and responsive
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}