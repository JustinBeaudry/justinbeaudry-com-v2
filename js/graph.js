// js/graph.js
// Ecosystem graph — SVG edges, node selection, detail panel

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EDGES = [
  { from: 'justin', to: 'actual-reality', type: 'hub' },
  { from: 'justin', to: 'toledo-codes', type: 'hub' },
  { from: 'justin', to: 'empowered-ai', type: 'hub' },
  { from: 'justin', to: 'ai-collective', type: 'hub' },
  { from: 'actual-reality', to: 'empowered-ai', type: 'cross' },
  { from: 'toledo-codes', to: 'ai-collective', type: 'cross' },
  { from: 'empowered-ai', to: 'ai-collective', type: 'cross' },
];

const DETAILS = {
  'justin': {
    name: 'Justin Beaudry',
    role: 'SOFTWARE + HUMANS + COMMUNITY',
    description:
      "Spent a decade at SF/Austin startups \u2014 CreativeLive, Instawork, United Airlines, Vida Health. Studied philosophy at Toledo, not CS. Moved back because the interesting problems aren\u2019t all on the coasts.",
    research: {
      label: 'PUBLISHED RESEARCH',
      title:
        'Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations',
      meta: 'arXiv \u00b7 2025',
      url: 'https://arxiv.org/abs/2508.21164',
    },
  },
  'actual-reality': {
    name: 'Actual Reality Technologies',
    role: 'DIRECTOR OF ENGINEERING',
    description:
      'Founding engineering leader at an AI consultancy. Building products, internal tools, and the engineering org \u2014 consulting, coding, mentoring engineers. Player-coach across the full stack.',
  },
  'toledo-codes': {
    name: 'Toledo Codes',
    role: 'FOUNDER',
    description:
      'A developer community in Northwest Ohio. Regular meetups and a civic tech program where college students build real projects in a simulated startup environment \u2014 standups, code reviews, shipping. First project: Batting Cleanup, QR codes for reporting city maintenance issues.',
    link: { text: 'toledo.codes \u2192', url: 'https://toledo.codes' },
  },
  'empowered-ai': {
    name: 'EmpoweredAI',
    role: 'DIRECTOR OF TECHNOLOGY \u00b7 BOARD TREASURER',
    description:
      "Non-profit bringing AI education to kids ages 7\u201312 in Toledo. Backed by a $40K City of Toledo grant. Justin\u2019s role: guiding the technology roadmap and providing board oversight.",
  },
  'ai-collective': {
    name: 'AI Collective',
    role: 'REGIONAL MANAGER \u2014 MIDWEST',
    description:
      'Getting developers, businesses, and policymakers in the same room across Ohio and the Midwest. Co-hosting Great Lakes AI Week. The conversations that need to happen before the tools get built.',
    link: { text: 'Learn more \u2192', url: '#' },
  },
};

const CURVE_FACTOR_HUB = 0.22;
const CURVE_FACTOR_CROSS = 0.15;
const RESIZE_DEBOUNCE_MS = 150;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let phase = 'idle'; // 'idle' | 'drawing' | 'breathing' | 'interactive'
let selectedNodeId = null;

/** @type {HTMLElement | null} */
let graphEl = null;
/** @type {SVGSVGElement | null} */
let svgEl = null;
/** @type {HTMLElement | null} */
let detailContentEl = null;
/** @type {HTMLElement | null} */
let detailPanelEl = null;
/** @type {NodeListOf<HTMLElement> | null} */
let nodeEls = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the center of a node element relative to the graph container.
 * @param {string} nodeId
 * @returns {{ x: number, y: number }}
 */
function getNodeCenter(nodeId) {
  const el = graphEl.querySelector(`[data-node="${nodeId}"]`);
  if (!el || !graphEl) return { x: 0, y: 0 };
  const gr = graphEl.getBoundingClientRect();
  const nr = el.getBoundingClientRect();
  return {
    x: nr.left + nr.width / 2 - gr.left,
    y: nr.top + nr.height / 2 - gr.top,
  };
}

/**
 * Build the SVG `d` attribute for a quadratic bezier between two nodes.
 * @param {{ x: number, y: number }} p1
 * @param {{ x: number, y: number }} p2
 * @param {number} curveFactor
 * @returns {string}
 */
function bezierPath(p1, p2, curveFactor) {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const cx = mx - dy * curveFactor;
  const cy = my + dx * curveFactor;
  return `M${p1.x},${p1.y} Q${cx},${cy} ${p2.x},${p2.y}`;
}

// ---------------------------------------------------------------------------
// Edge rendering
// ---------------------------------------------------------------------------

/**
 * Render all SVG edge paths.
 * @param {boolean} animate — if true, apply drawing animation with dash offset
 */
export function renderEdges(animate = false) {
  if (!svgEl) return;
  svgEl.innerHTML = '';

  EDGES.forEach((edge) => {
    const p1 = getNodeCenter(edge.from);
    const p2 = getNodeCenter(edge.to);
    const curveFactor =
      edge.type === 'hub' ? CURVE_FACTOR_HUB : CURVE_FACTOR_CROSS;

    const path = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    path.setAttribute('d', bezierPath(p1, p2, curveFactor));

    // Determine classes based on type + current selection
    const classes = ['edge'];
    if (edge.type === 'cross') classes.push('cross');

    if (phase === 'interactive' && selectedNodeId) {
      applySelectionClasses(classes, edge, selectedNodeId);
    }

    if (animate) classes.push('drawing');

    path.setAttribute('class', classes.join(' '));

    svgEl.appendChild(path);

    // Set accurate dash values for drawing animation
    if (animate) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    }
  });
}

/**
 * Mutate a classes array to add 'active' or 'dimmed' based on selection.
 * @param {string[]} classes
 * @param {{ from: string, to: string, type: string }} edge
 * @param {string} nodeId
 */
function applySelectionClasses(classes, edge, nodeId) {
  const isConnected = edge.from === nodeId || edge.to === nodeId;

  if (nodeId === 'justin') {
    // Hub edges active, cross edges neutral
    if (edge.type === 'hub') classes.push('active');
  } else {
    // Peripheral selected: connected edges active, others dimmed
    if (isConnected) {
      classes.push('active');
    } else {
      classes.push('dimmed');
    }
  }
}

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------

/**
 * Update the detail panel content for a given node.
 * @param {string} nodeId
 */
function updateDetail(nodeId) {
  const data = DETAILS[nodeId];
  if (!data || !detailContentEl) return;

  // Remove animate class to reset
  detailContentEl.classList.remove('animate');

  let html = `
    <h3>${data.name}</h3>
    <div class="detail-role">${data.role}</div>
    <p>${data.description}</p>`;

  if (data.link) {
    html += `<a href="${data.link.url}" class="detail-link">${data.link.text}</a>`;
  }

  if (data.research) {
    html += `
    <div class="research-inline">
      <span class="pub-label">${data.research.label}</span>
      <a href="${data.research.url}">${data.research.title} <span class="research-meta">\u2014 ${data.research.meta}</span></a>
    </div>`;
  }

  detailContentEl.innerHTML = html;

  // Trigger fade animation via reflow
  void detailContentEl.offsetWidth;
  detailContentEl.classList.add('animate');

  // On mobile, scroll detail panel into view
  if (window.innerWidth <= 768 && detailPanelEl) {
    setTimeout(() => {
      detailPanelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

// ---------------------------------------------------------------------------
// Node selection
// ---------------------------------------------------------------------------

/**
 * Select a node by its element. Updates classes, edges, and detail panel.
 * @param {HTMLElement} el
 */
function selectNode(el) {
  const nodeId = el.dataset.node;
  if (nodeId === selectedNodeId) return; // no-op if already selected

  // Update selected state on all nodes
  nodeEls.forEach((n) => {
    n.classList.remove('selected');
    n.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
  selectedNodeId = nodeId;

  // Switch to interactive phase — stops breathing
  phase = 'interactive';

  // Re-render edges with selection state (no drawing animation)
  renderEdges(false);

  // Update detail panel
  updateDetail(nodeId);
}

/**
 * Handle keyboard interaction on nodes (Enter / Space).
 * @param {KeyboardEvent} event
 */
function handleNodeKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectNode(/** @type {HTMLElement} */ (event.currentTarget));
  }
}

// ---------------------------------------------------------------------------
// Resize handling
// ---------------------------------------------------------------------------

/**
 * Create a debounced resize handler that re-renders edges.
 * @returns {ResizeObserver}
 */
function createResizeObserver() {
  let timeoutId = null;

  return new ResizeObserver(() => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      renderEdges(false);
    }, RESIZE_DEBOUNCE_MS);
  });
}

// ---------------------------------------------------------------------------
// Phase accessors (for animation module)
// ---------------------------------------------------------------------------

/** @returns {string} */
export function getPhase() {
  return phase;
}

/** @param {string} p */
export function setPhase(p) {
  phase = p;
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export function initGraph() {
  graphEl = document.getElementById('graph');
  svgEl = document.getElementById('edges');
  detailContentEl = document.getElementById('detail-content');
  detailPanelEl = document.getElementById('detail-panel');

  if (!graphEl || !svgEl) return;

  nodeEls = graphEl.querySelectorAll('[data-node]');

  // Attach click + keyboard handlers
  nodeEls.forEach((node) => {
    node.addEventListener('click', () => selectNode(node));
    node.addEventListener('keydown', handleNodeKeydown);
  });

  // Initial edge render (justin is pre-selected in HTML)
  selectedNodeId = 'justin';
  renderEdges(false);

  // Resize observer for edge repositioning
  const resizeObserver = createResizeObserver();
  resizeObserver.observe(graphEl);
}
