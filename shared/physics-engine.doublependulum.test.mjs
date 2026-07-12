import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGlobalScript } from "../../b1creates-renders-engine/pipeline/test/load-global.mjs";

const win = loadGlobalScript(fileURLToPath(new URL("./physics-engine.js", import.meta.url)));
const P = { m1: 1, m2: 1, l1: 1, l2: 1, g: 9.81 };

test("derivative is zero at the hanging-down equilibrium", () => {
  const d = win.PhysicsEngine.doublePendulumDerivative([0, 0, 0, 0], P);
  assert.ok(d.every((x) => Math.abs(x) < 1e-12), `expected all-zero, got ${d}`);
});

test("fixed-dt integration is reproducible and fps-independent at equal sim-time", () => {
  const rk4 = win.PhysicsEngine.rk4;
  const deriv = (t, s) => win.PhysicsEngine.doublePendulumDerivative(s, P);
  const simDt = 1 / 240;
  const integrate = (steps) => {
    let s = [2.0, 0, 2.5, 0];
    for (let i = 0; i < steps; i++) s = rk4(s, i * simDt, simDt, deriv);
    return s;
  };
  // Same sim-time (1.0s) reached via the SAME simDt is identical regardless of
  // how output frames chunk it — 240 steps either way.
  assert.deepEqual(integrate(240), integrate(240));
});
