/**
 * math-utils.js — small, dependency-free math helpers shared across simulations.
 *
 * LOADING MODEL (important): this file is loaded via a classic <script src> tag in
 * p5.js "global mode". It therefore uses NO `export` statements — everything is
 * attached to a single global namespace object `MathUtils`. Adding `export` here
 * would force the browser into ES-module mode, which breaks loading over file://.
 * See CLAUDE.md → "The relative-path import contract".
 */
(function (global) {
  const TAU = Math.PI * 2;

  const MathUtils = {
    TAU,

    /** Linear interpolation between a and b by t in [0, 1]. */
    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    /** Remap x from [inMin, inMax] onto [outMin, outMax]. */
    map(x, inMin, inMax, outMin, outMax) {
      return outMin + ((x - inMin) * (outMax - outMin)) / (inMax - inMin);
    },

    /** Constrain x to the inclusive range [min, max]. */
    clamp(x, min, max) {
      return Math.min(Math.max(x, min), max);
    },

    /** Smoothstep easing (0 at edge0, 1 at edge1). */
    smoothstep(edge0, edge1, x) {
      const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    },

    /** Convert degrees to radians. */
    radians(deg) {
      return (deg * Math.PI) / 180;
    },
  };

  global.MathUtils = MathUtils;
})(window);
