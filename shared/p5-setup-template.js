/**
 * p5-setup-template.js — standard canvas + responsive-resize helpers.
 *
 * CRITICAL (p5 global-mode collision): p5 global mode has exactly ONE
 * window.setup / window.draw / window.windowResized. If this file declared its
 * own setup()/draw(), it would silently OVERWRITE (or be overwritten by) the
 * sketch's — whichever <script> loads last wins, and the other appears to "do
 * nothing". So this template exposes HELPERS only. Each sketch keeps its own
 * setup()/windowResized() and simply calls these from inside them.
 *
 * LOADING MODEL: classic <script src> in global mode. No `export`; API attached
 * to global `P5Setup`. See CLAUDE.md.
 */
(function (global) {
  const P5Setup = {
    /**
     * Create a canvas sized to the window (or a fixed export size) and return it.
     * Call this from inside your sketch's setup().
     *
     * @param {object} [opts]
     * @param {number} [opts.width]  fixed width in px; defaults to windowWidth
     * @param {number} [opts.height] fixed height in px; defaults to windowHeight
     * @param {number} [opts.pixelDensity] force a density (e.g. 1 for predictable
     *   exports, 2 for retina preview). Omit to use the display default.
     */
    createResponsiveCanvas(opts = {}) {
      const w = opts.width ?? global.windowWidth;
      const h = opts.height ?? global.windowHeight;
      if (opts.pixelDensity != null) global.pixelDensity(opts.pixelDensity);
      const cnv = global.createCanvas(w, h);
      return cnv;
    },

    /**
     * Resize the canvas to match the window. Call this from your sketch's
     * windowResized(). No-op for fixed-size export canvases.
     */
    handleResize() {
      global.resizeCanvas(global.windowWidth, global.windowHeight);
    },
  };

  global.P5Setup = P5Setup;
})(window);
