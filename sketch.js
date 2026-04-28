let partyMode = false;

let balloons = [];
let bgConfetti = [];
let textConfetti = [];
let numberBalloons = [];

let button;
let homeButton;

let pg;

let partyStartFrame = 0;

// dragging
let draggingBalloon = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function setup() {
let canvas = createCanvas(windowWidth, windowHeight);
textFont("Coiny");
canvas.parent("sketch-container");  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  noCursor();

  // PARTY BUTTON
  button = createButton("Party Mode: OFF");
  button.position(20, 20);
  button.mousePressed(toggleMode);
  styleButton(button);

  // HOME BUTTON
  homeButton = createButton("Return to Homepage");
  homeButton.mousePressed(() => {
    window.location.href = "#";
  });
  styleButton(homeButton);

  // center AFTER it's created
  centerHomeButton();

  for (let i = 0; i < 25; i++) {
    balloons.push(new Balloon(random(width), random(height)));
  }

  createNumberBalloons();

  let density = floor((width * height) / 1200);
  for (let i = 0; i < density; i++) {
    bgConfetti.push(new BGConfetti());
  }

  pg = createGraphics(width, height);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(width / 4);
  pg.fill(255);
  pg.background(0);
  pg.text("404", width / 2, height / 2);

  pg.loadPixels();
  for (let x = 0; x < width; x += 6) {
    for (let y = 0; y < height; y += 6) {
      let i = (x + y * width) * 4;
      if (pg.pixels[i] > 200) {
        textConfetti.push(new TextConfetti(x, y));
      }
    }
  }
}

// ---------------- CENTER BUTTON ----------------
function centerHomeButton() {
  let btnWidth = homeButton.elt.offsetWidth;
  let x = width / 2 - btnWidth / 2;
  let y = height / 2 + 100;
  homeButton.position(x, y);
}

// ---------------- BUTTON STYLE ----------------
function styleButton(btn) {
  btn.style("padding", "10px 18px");
  btn.style("border", "none");
  btn.style("border-radius", "20px");
  btn.style("cursor", "pointer");
  btn.style("font-weight", "bold");
  btn.style("transition", "all 0.2s ease");

  setButtonColor(btn);

  btn.mouseOver(() => {
    setButtonColor(btn);
    btn.style("transform", "translateY(-4px) scale(1.08)");

    let glowHue = random(360);
    btn.style(
      "box-shadow",
      `0 8px 20px hsla(${glowHue}, 80%, 60%, 0.6)`
    );
  });

  btn.mouseOut(() => {
    setButtonColor(btn);
    btn.style("transform", "translateY(0px) scale(1)");
    btn.style("box-shadow", "none");
  });
}

function setButtonColor(btn) {
  let h = random(360);
  let s = partyMode ? 80 : 50;
  let b = partyMode ? 100 : 90;

  btn.style("background-color", `hsl(${h}, ${s}%, ${b}%)`);
  btn.style("color", b > 70 ? "#000" : "#fff");
}

// ---------------- NUMBER BALLOONS ----------------
function createNumberBalloons() {
  numberBalloons = [];
  let spacing = width / 6;

  numberBalloons.push(new NumberBalloon(width/2 - spacing, height/2, "4"));
  numberBalloons.push(new NumberBalloon(width/2, height/2, "0"));
  numberBalloons.push(new NumberBalloon(width/2 + spacing, height/2, "4"));
}

// ---------------- TOGGLE ----------------
function toggleMode() {
  partyMode = !partyMode;

  button.html(
    partyMode ? "Party Mode: ON" : "Party Mode: OFF"
  );

  setButtonColor(button);

  button.style("transform", "scale(0.95)");
  setTimeout(() => {
    button.style("transform", "scale(1)");
  }, 100);

  if (partyMode) {
    partyStartFrame = frameCount;
    createNumberBalloons();
  }
}

// ---------------- DRAW ----------------
function draw() {
  if (!partyMode) {
    drawClassic();
  } else {
    drawParty();
  }

  drawCakeCursor(mouseX, mouseY);
}

// ---------------- CLASSIC ----------------
function drawClassic() {
  background(0, 0, 95);

  fill(0, 0, 20);
  textSize(90);
  text("404", width / 2, height / 2 - 40);

  textSize(22);
  text("Page Not Found", width / 2, height / 2 + 40);
}

// ---------------- PARTY ----------------
function drawParty() {
  background(210, 30, 10);

  fill(0, 0, 100);
  textSize(24);
  text("This page partied too hard and disappeared 🎉", width/2, height/2 - 120);

  for (let c of bgConfetti) {
    c.update();
    c.display();
  }

  for (let c of textConfetti) {
    c.update();
    c.display();
  }

  for (let n of numberBalloons) {
    n.update();
    n.display();
  }

  for (let b of balloons) {
    b.update();
    b.display();
  }
}

// ---------------- BALLOON ----------------
class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseHue = random(360);
    this.size = random(30, 60);
    this.speed = random(0.8, 2);
    this.offset = random(1000);
    this.popped = false;
    this.popSize = 0;
  }

  update() {
    if (!this.popped) {
      this.y -= this.speed;
      this.x += sin(frameCount * 0.05 + this.offset) * 0.6;

      if (this.y < -50) {
        this.y = height + 50;
        this.x = random(width);
      }
    } else {
      this.popSize += 3;
      if (this.popSize > this.size * 2) this.popped = false;
    }
  }

  display() {
    let h = (this.baseHue + frameCount * 0.5) % 360;

    if (!this.popped) {
      fill(h, 80, 100, 70);
      noStroke();
      ellipse(this.x, this.y, this.size);

      stroke(0, 0, 100, 70);
      let sway = sin(frameCount * 0.1 + this.offset) * 6;
      line(this.x, this.y + this.size/2, this.x + sway, this.y + this.size + 20);
    } else {
      noFill();
      stroke(h, 80, 100, 80);
      ellipse(this.x, this.y, this.popSize);
    }
  }

  checkClick(mx, my) {
    if (dist(mx, my, this.x, this.y) < this.size/2) {
      this.popped = true;
    }
  }
}

// ---------------- NUMBER BALLOON ----------------
class NumberBalloon {
  constructor(x, y, num) {
    this.x = x;
    this.y = y;

    this.num = num;
    this.size = 180;
    this.hue = random(360);
    this.offset = random(1000);

    this.scale = 0;
    this.dragging = false;
  }

  update() {
    let t = constrain((frameCount - partyStartFrame) / 20, 0, 1);
    this.scale = easeOutBack(t);

    if (!this.dragging) {
      this.y += sin(frameCount * 0.02 + this.offset) * 0.3;
      this.x += sin(frameCount * 0.03 + this.offset) * 0.3;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.scale * (this.dragging ? 1.15 : 1));

    fill(this.hue, 80, 100, 75);
    noStroke();
    ellipse(0, 0, this.size);

    fill(0, 0, 100, 85);
    textSize(this.size * 0.8);
    text(this.num, 0, 10);

    stroke(0, 0, 100, 70);
    line(0, this.size/2, 0, this.size + 60);

    pop();
  }

  isMouseOver(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }

  changeColor() {
    this.hue = random(360);
  }
}

// ---------------- CONFETTI ----------------
class BGConfetti {
  constructor() {
    this.baseX = random(width);
    this.baseY = random(height);
    this.x = this.baseX;
    this.y = this.baseY;

    this.hue = random(360);
    this.size = random(1, 3);

    this.vx = 0;
    this.vy = 0;
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    if (d < 80) {
      let a = atan2(this.y - mouseY, this.x - mouseX);
      this.vx += cos(a) * 0.4;
      this.vy += sin(a) * 0.4;
    }

    this.vx += (this.baseX - this.x) * 0.03;
    this.vy += (this.baseY - this.y) * 0.03;

    this.vx *= 0.85;
    this.vy *= 0.85;

    this.x += this.vx;
    this.y += this.vy;
  }

  display() {
    fill(this.hue, 80, 100, 80);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

// ---------------- TEXT CONFETTI ----------------
class TextConfetti {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;

    this.hue = random(360);
    this.size = random(3, 5);

    this.vx = 0;
    this.vy = 0;
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    if (d < 80) {
      let a = atan2(this.y - mouseY, this.x - mouseX);
      this.vx += cos(a) * 0.6;
      this.vy += sin(a) * 0.6;
    }

    this.vx += (this.baseX - this.x) * 0.03;
    this.vy += (this.baseY - this.y) * 0.03;

    this.vx *= 0.88;
    this.vy *= 0.88;

    this.x += this.vx;
    this.y += this.vy;
  }

  display() {
    fill(this.hue, 80, 100, 80);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

// ---------------- EASING ----------------
function easeOutBack(t) {
  let c1 = 1.70158;
  let c3 = c1 + 1;
  return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
}

// ---------------- CAKE CURSOR ----------------
function drawCakeCursor(x, y) {
  push();
  translate(x, y);

  let bounce = sin(frameCount * 0.2) * 2;
  translate(0, bounce);

  fill(30, 20, 95);
  ellipse(0, 15, 40, 10);

  fill(20, 80, 90);
  rectMode(CENTER);
  rect(0, 0, 30, 20, 5);

  fill(340, 60, 100);
  rect(0, -8, 30, 10, 5);

  fill(50, 80, 100);
  rect(0, -18, 4, 12, 2);

  let flicker = sin(frameCount * 0.3) * 2;
  fill(40, 90, 100);
  ellipse(0, -24, 6 + flicker, 10 + flicker);

  pop();
}

// ---------------- INTERACTION ----------------
function mousePressed() {
  if (partyMode) {
    for (let n of numberBalloons) {
      if (n.isMouseOver(mouseX, mouseY)) {
        draggingBalloon = n;
        n.dragging = true;
        n.changeColor();
        dragOffsetX = mouseX - n.x;
        dragOffsetY = mouseY - n.y;
        return;
      }
    }

    for (let b of balloons) {
      b.checkClick(mouseX, mouseY);
    }
  }
}

function mouseDragged() {
  if (draggingBalloon) {
    draggingBalloon.x = mouseX - dragOffsetX;
    draggingBalloon.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (draggingBalloon) {
    draggingBalloon.dragging = false;
    draggingBalloon = null;
  }
}

// ---------------- RESIZE ----------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerHomeButton();
}