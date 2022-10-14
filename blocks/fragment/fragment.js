/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */

import {
  decorateMain,
  loadBlocks,
} from '../../scripts/scripts.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main, true);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (block.classList.contains('promo')) {
      fragmentSection.classList.add('promo-container');

      const wrapper = fragmentSection.querySelector('.default-content-wrapper');
      const inner = document.createElement('div');
      inner.classList.add('promo-inner');

      [...wrapper.childNodes].forEach((child) => {
        const pic = child.querySelector('picture');
        if (!pic) {
          inner.append(child);
        }
      });

      wrapper.append(inner);
    }
    if (fragmentSection) {
      block.closest('.section').classList.add(...fragmentSection.classList);
      block.innerHTML = '';
      block.append(...fragmentSection.childNodes);
    }
  }
}