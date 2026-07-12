import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGlobalScript } from "../../b1creates-renders-engine/pipeline/test/load-global.mjs";

const win = loadGlobalScript(fileURLToPath(new URL("./physics-engine.js", import.meta.url)));

test("waveField sums radial sines, mean-normalized", () => {
  const grid = win.PhysicsEngine.waveField({
    sources: [{ x: 0.5, y: 0.5, phase: Math.PI / 2 }],
    k: 0, omega: 0, cols: 1, rows: 1, time: 0,
  });
  assert.equal(grid.length, 1);
  assert.deepEqual({ x: grid[0].x, y: grid[0].y }, { x: 0.5, y: 0.5 });
  assert.ok(Math.abs(grid[0].value - 1) < 1e-12); // sin(0 - 0 + pi/2) = 1
});
