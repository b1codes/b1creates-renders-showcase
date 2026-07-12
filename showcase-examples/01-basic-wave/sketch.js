/**
 * sketch.js — public "basic wave" showcase.
 *
 * This is the clean, brand-free reference sketch. It depends ONLY on the shared
 * engine (PhysicsEngine, MathUtils, P5Setup) — never on the private pipeline's
 * palettes or watermarks. The private staging-lab copy of this sketch adds those.
 *
 * These globals are provided by the <script> tags loaded before this file:
 *   PhysicsEngine, MathUtils, P5Setup  (from ../../shared/)
 *   createCanvas, background, fill, …  (from p5.js)
 */

const CONFIG = {
  count: 24, // number of pendulums
  period: 30, // seconds for the pattern to fully realign
  cycles: 24, // swings the slowest pendulum makes per period
  ballRadius: 9,
};

// Neutral built-in colors. The public repo intentionally ships no brand palette.
const NEUTRAL = { bg: "#0b0b0f", ink: "#e8e8ef" };

function setup() {
  // Uses the shared helper — NOT a template-owned setup(). See p5-setup-template.js.
  P5Setup.createResponsiveCanvas();
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(NEUTRAL.bg);

  const t = millis() / 1000;
  const state = PhysicsEngine.pendulumWave({
    count: CONFIG.count,
    time: t,
    period: CONFIG.period,
    cycles: CONFIG.cycles,
    amplitude: 1,
  });

  const marginX = width * 0.12;
  const usableW = width - marginX * 2;
  const pivotY = height * 0.18;
  const length = height * 0.66;

  for (const p of state) {
    const x = MathUtils.map(p.index, 0, CONFIG.count - 1, marginX, width - marginX);
    // Small-angle horizontal swing of a bob hanging from (x, pivotY).
    const bobX = x + Math.sin(p.angle) * (usableW * 0.03);
    const bobY = pivotY + Math.cos(p.angle) * length;

    stroke(0, 0, 60);
    strokeWeight(1);
    line(x, pivotY, bobX, bobY);

    // Hue tracks each pendulum's phase for a travelling-color effect.
    noStroke();
    fill((p.phase * 360) % 360, 70, 100);
    circle(bobX, bobY, CONFIG.ballRadius * 2);
  }
}

function windowResized() {
  P5Setup.handleResize();
}
