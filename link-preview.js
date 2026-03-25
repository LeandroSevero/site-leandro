const PEEK_WIDTH = 220;
const PEEK_HEIGHT = 138;
const OPEN_DELAY = 100;
const CLOSE_DELAY = 180;

const buildMicrolinkUrl = (url) => {
  const params = new URLSearchParams({
    url,
    screenshot: 'true',
    meta: 'false',
    embed: 'screenshot.url',
    colorScheme: 'dark',
    'viewport.isMobile': 'true',
    'viewport.deviceScaleFactor': '1',
    'viewport.width': String(PEEK_WIDTH * 2.5),
    'viewport.height': String(PEEK_HEIGHT * 2.5),
  });
  return `https://api.microlink.io/?${params.toString()}`;
};

const createPopup = () => {
  const el = document.createElement('div');
  el.className = 'link-preview-popup';
  el.innerHTML = `
    <div class="link-preview-inner">
      <img class="link-preview-img" alt="Preview" width="${PEEK_WIDTH}" height="${PEEK_HEIGHT}" />
      <div class="link-preview-fallback" hidden>Preview unavailable</div>
      <div class="link-preview-lens" hidden></div>
    </div>
  `;
  document.body.appendChild(el);
  return el;
};

const getOrCreatePopup = (() => {
  let popup = null;
  return () => {
    if (!popup) popup = createPopup();
    return popup;
  };
})();

let openTimer = null;
let closeTimer = null;
let currentAnchor = null;
let lensActive = false;

const positionPopup = (popup, anchor) => {
  const rect = anchor.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const popupW = PEEK_WIDTH + 4;
  const popupH = PEEK_HEIGHT + 4;
  const gap = 12;

  let top = rect.top + scrollY - popupH - gap;
  let left = rect.left + scrollX + rect.width / 2 - popupW / 2;

  if (top < scrollY + 8) {
    top = rect.bottom + scrollY + gap;
  }

  const viewW = document.documentElement.clientWidth;
  if (left < 8) left = 8;
  if (left + popupW > viewW - 8) left = viewW - popupW - 8;

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
};

const showPopup = (anchor) => {
  const popup = getOrCreatePopup();
  const url = anchor.getAttribute('data-link-preview');
  const imgSrc = buildMicrolinkUrl(url);

  const img = popup.querySelector('.link-preview-img');
  const fallback = popup.querySelector('.link-preview-fallback');
  const lens = popup.querySelector('.link-preview-lens');

  fallback.hidden = true;
  img.hidden = false;
  lens.hidden = true;
  lensActive = false;

  if (img.dataset.src !== imgSrc) {
    img.dataset.src = imgSrc;
    img.src = imgSrc;
    img.onerror = () => {
      img.hidden = true;
      fallback.hidden = false;
    };
  }

  positionPopup(popup, anchor);
  popup.classList.remove('link-preview-exit');
  popup.classList.add('link-preview-visible');
  currentAnchor = anchor;
};

const hidePopup = () => {
  const popup = getOrCreatePopup();
  popup.classList.remove('link-preview-visible');
  popup.classList.add('link-preview-exit');
  currentAnchor = null;
  lensActive = false;
  const lens = popup.querySelector('.link-preview-lens');
  if (lens) lens.hidden = true;
};

const moveLens = (popup, e) => {
  const inner = popup.querySelector('.link-preview-inner');
  const rect = inner.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const lens = popup.querySelector('.link-preview-lens');
  const img = popup.querySelector('.link-preview-img');
  if (!lens || img.hidden) return;

  const lensSize = 90;
  const zoom = 1.8;

  lens.hidden = false;
  lens.style.width = `${lensSize}px`;
  lens.style.height = `${lensSize}px`;

  const bgX = -(x * zoom - lensSize / 2);
  const bgY = -(y * zoom - lensSize / 2);

  lens.style.backgroundImage = `url(${img.src})`;
  lens.style.backgroundSize = `${PEEK_WIDTH * zoom}px ${PEEK_HEIGHT * zoom}px`;
  lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
  lens.style.left = `${x - lensSize / 2}px`;
  lens.style.top = `${y - lensSize / 2}px`;
};

export const initLinkPreview = () => {
  const triggers = document.querySelectorAll('[data-link-preview]');

  triggers.forEach((anchor) => {
    anchor.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => showPopup(anchor), OPEN_DELAY);
    });

    anchor.addEventListener('mouseleave', () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(hidePopup, CLOSE_DELAY);
    });

    anchor.addEventListener('mousemove', (e) => {
      const popup = getOrCreatePopup();
      if (popup.classList.contains('link-preview-visible')) {
        moveLens(popup, e);
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (currentAnchor) {
      positionPopup(getOrCreatePopup(), currentAnchor);
    }
  }, { passive: true });
};
