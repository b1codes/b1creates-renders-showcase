/**
 * physics-engine.js — the core, brand-agnostic simulation math. This is the
 * open-source heart of the public repo; it must never reference brand assets,
 * palettes, or anything from the private pipeline.
 *
 * LOADING MODEL: classic <script src> in p5 global mode. No `export` — the API is
 * attached to the global `PhysicsEngine`. See CLAUDE.md.
 *
 * Two independent tools live here:
 *   1. pendulumWave()  — a CLOSED-FORM (analytic) solver. A pendulum wave is not
 *      simulated step-by-step; each pendulum's phase is a pure function of its
 *      index and time. Cheap, exact, and frame-rate independent — ideal for the
 *      deterministic re-rendering the pipeline needs.
 *   2. rk4()           — a general 4th-order Runge-Kutta integrator, kept here for
 *      FUTURE simulations (double pendulum, coupled/chaotic systems) that have no
 *      closed form. `01-basic-wave` deliberately does NOT use it.
 */
(function (global) {
  const PhysicsEngine = {
    /**
     * Analytic pendulum wave.
     *
     * Classic installation math: the longest pendulum completes `cycles` full
     * swings in `period` seconds; each shorter pendulum completes one extra swing
     * over that window. The whole array realigns exactly once per `period`.
     *
     * @param {object} opts
     * @param {number} opts.count    number of pendulums
     * @param {number} opts.time     elapsed seconds
     * @param {number} [opts.period] seconds for the pattern to fully realign
     * @param {number} [opts.cycles] swings the slowest pendulum makes per period
     * @param {number} [opts.amplitude] peak angular displacement (radians)
     * @returns {Array<{index:number, angle:number, phase:number}>}
     *   angle = signed angular displacement; phase in [0,1) for coloring/mapping.
     */
    pendulumWave({ count, time, period = 30, cycles = 50, amplitude = 1 }) {
      const out = new Array(count);
      for (let i = 0; i < count; i++) {
        // Oscillations-per-period increases by one for each pendulum in the line.
        const oscillations = cycles + i;
        const theta = (Math.PI * 2 * oscillations * time) / period;
        out[i] = {
          index: i,
          angle: amplitude * Math.sin(theta),
          phase: ((theta / (Math.PI * 2)) % 1 + 1) % 1,
        };
      }
      return out;
    },

    /**
     * Analytic Lissajous / harmonograph point at curve-parameter s.
     * Undamped so the curve is closed and loops; x,y in [-1,1].
     * @param {object} opts
     * @param {number} opts.fx  x-axis angular frequency
     * @param {number} opts.fy  y-axis angular frequency
     * @param {number} [opts.px] x-axis phase
     * @param {number} [opts.py] y-axis phase
     * @param {number} opts.s   curve parameter
     * @returns {{x:number, y:number}}
     */
    harmonograph({ fx, fy, px = 0, py = 0, s }) {
      return { x: Math.sin(fx * s + px), y: Math.sin(fy * s + py) };
    },

    /**
     * General 4th-order Runge-Kutta step. Reserved for future non-analytic sims.
     *
     * @param {number[]} state          state vector at time t
     * @param {number}   t              current time
     * @param {number}   dt             timestep
     * @param {(t:number, s:number[]) => number[]} derivative  ds/dt
     * @returns {number[]} state advanced by dt
     */
    rk4(state, t, dt, derivative) {
      const add = (a, b, s) => a.map((v, i) => v + b[i] * s);
      const k1 = derivative(t, state);
      const k2 = derivative(t + dt / 2, add(state, k1, dt / 2));
      const k3 = derivative(t + dt / 2, add(state, k2, dt / 2));
      const k4 = derivative(t + dt, add(state, k3, dt));
      return state.map(
        (v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
      );
    },
  };

  global.PhysicsEngine = PhysicsEngine;
})(window);
