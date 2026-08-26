function initSvgIconFallback() {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function hydrateUse(use) {
    if (!(use instanceof Element)) return;
    const svg = use.closest('svg.ui-icon');
    if (!svg) return;
    const href = use.getAttribute('href') || use.getAttribute('xlink:href') || '';
    if (!href.startsWith('#')) return;
    const symbol = document.getElementById(href.slice(1));
    if (!symbol || symbol.tagName.toLowerCase() !== 'symbol') return;

    const oldLayer = svg.querySelector(':scope > g[data-icon-inline-fallback]');
    if (oldLayer) oldLayer.remove();

    if (!svg.getAttribute('viewBox') && symbol.getAttribute('viewBox')) {
      svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
    }

    const layer = document.createElementNS(SVG_NS, 'g');
    layer.setAttribute('data-icon-inline-fallback', '');
    [...symbol.children].forEach(child => layer.appendChild(child.cloneNode(true)));
    svg.insertBefore(layer, use);

    // Keep <use> in the DOM because a few controls update its href dynamically,
    // but hide it so the inline copy is the single rendered source of truth.
    use.style.display = 'none';
  }

  function hydrateTree(root) {
    if (!(root instanceof Element || root instanceof Document)) return;
    if (root instanceof Element && root.matches('svg.ui-icon use')) hydrateUse(root);
    root.querySelectorAll?.('svg.ui-icon use').forEach(hydrateUse);
  }

  hydrateTree(document);
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target.matches?.('svg.ui-icon use')) {
        hydrateUse(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) hydrateTree(node);
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
}

initSvgIconFallback();
initPlatformFeatures();
init();
