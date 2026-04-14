import { initGraph } from './graph.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  initGraph();
  initAnimations();
});
