import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadGlobalScript } from "../../b1creates-renders-engine/pipeline/test/load-global.mjs";

const win = loadGlobalScript(
  fileURLToPath(new URL("./physics-engine.js", import.meta.url))
);

test("harmonograph returns a normalized Lissajous point", () => {
  const p = win.PhysicsEngine.harmonograph({ fx: 1, fy: 1, px: 0, py: Math.PI / 2, s: 0 });
  assert.ok(Math.abs(p.x - 0) < 1e-12); // sin(0)
  assert.ok(Math.abs(p.y - 1) < 1e-12); // sin(pi/2)
});
