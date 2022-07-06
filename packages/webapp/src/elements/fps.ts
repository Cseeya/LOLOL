import {
  GemElement,
  html,
  adoptedStyle,
  customElement,
  createCSSSheet,
  css,
  createStore,
  connectStore,
  updateStore,
} from '@mantou/gem';

import { theme } from 'src/theme';

const style = createCSSSheet(css`
  :host {
    font-size: 0.875em;
    color: ${theme.describeColor};
    font-variant-numeric: tabular-nums;
  }
`);

const store = createStore({
  min: 0,
  max: 0,
  fps: 0,
  avgFps: 0,
});

const frames: number[] = [];
let lastFrameTime = performance.now();
let timer = 0;

const tick = () => {
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  const fps = Math.round(1000 / delta);
  frames.push(fps);
  if (frames.length > 100) {
    frames.shift();
  }

  let min = Infinity;
  let max = Infinity;
  const sum = frames.reduce((acc, val) => {
    acc += val;
    min = Math.min(val, min);
    max = Math.max(val, max);
    return acc;
  });
  const avgFps = Math.round(sum / frames.length);

  updateStore(store, {
    fps,
    avgFps,
    min,
    max,
  });

  timer = requestAnimationFrame(tick);
};

/**
 * @customElement nesbox-fps
 */
@customElement('nesbox-fps')
@adoptedStyle(style)
@connectStore(store)
export class NesboxFpsElement extends GemElement {
  static instanceSet: Set<NesboxFpsElement> = new Set();

  mounted = () => {
    NesboxFpsElement.instanceSet.add(this);
    if (NesboxFpsElement.instanceSet.size === 1) {
      timer = requestAnimationFrame(tick);
    }
  };

  unmounted = () => {
    NesboxFpsElement.instanceSet.delete(this);
    if (NesboxFpsElement.instanceSet.size === 0) {
      cancelAnimationFrame(timer);
    }
  };

  render = () => {
    return html`FPS: ${store.avgFps}`;
  };
}
