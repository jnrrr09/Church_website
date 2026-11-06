/* Content is kept separate from rendering so verified church information can be added later. */
// Group names are based on PCG-wide ministry categories; Liberty activity and contacts need confirmation.
const ministries = [
  { name: 'Children Service', category: 'Children & families', description: 'A welcoming place for children to learn, worship, and grow in faith.', coordinator: '', phone: '', email: '' },
  { name: 'Junior Youth', category: 'Youth', description: 'Christian fellowship and faith formation for young people.', coordinator: '', phone: '', email: '' },
  { name: 'Women’s Fellowship', category: 'Fellowship', description: 'Women gathering for fellowship, prayer, service, and spiritual growth.', coordinator: '', phone: '', email: '' },
  { name: 'Men’s Fellowship', category: 'Fellowship', description: 'Men building faith and community through fellowship and service.', coordinator: '', phone: '', email: '' },
  { name: 'Young People’s Guild', category: 'Youth', description: 'A place for young people to worship, serve, and grow together.', coordinator: '', phone: '', email: '' },
  { name: 'Singing Band', category: 'Worship', description: 'Serving the church through music and congregational worship.', coordinator: '', phone: '', email: '' },
  { name: 'Bible & Prayer Group', category: 'Spiritual growth', description: 'Growing together through Scripture, prayer, and encouragement.', coordinator: '', phone: '', email: '' },
  { name: 'Young Adults’ Fellowship', category: 'Fellowship', description: 'Faith and fellowship for young adults in the congregation.', coordinator: '', phone: '', email: '' }
];
const events = [];
// Gallery cards live in index.html. Replace each card's img src with your image path.
const galleryImages = [...document.querySelectorAll('#gallery-grid .gallery-item')].map(card => ({
  src: card.querySelector('img').getAttribute('src'),
  alt: card.querySelector('img').alt,
  caption: card.querySelector('span').textContent
}));
// Group logos supplied in the logo folder.
const ministryLogos = {
  'Children Service': 'logo/Children%27s%20service.jpg',
  'Junior Youth': 'logo/JY.png',
  'Women’s Fellowship': 'logo/women%27s%20fellowship.png',
  'Men’s Fellowship': 'logo/men%27s%20fellowship.webp',
  'Young People’s Guild': 'logo/YPG.png',
  'Singing Band': 'logo/singing%20band.webp',
  'Bible & Prayer Group': 'logo/biblestudy.jpg',
  'Young Adults’ Fellowship': 'logo/YAF.webp'
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  navigation.classList.remove('is-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (navigation.classList.contains('is-open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

// Mark the visible section in the primary navigation.
const navLinks = [...document.querySelectorAll('#site-nav a[href^="#"]')];
const observedSections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-25% 0px -65% 0px' });
  observedSections.forEach(section => sectionObserver.observe(section));
}

// Render data-driven sections with honest empty states until church-approved content is available.
const ministryList = document.querySelector('#ministry-list');
if (ministryList) {
  if (ministries.length) ministryList.innerHTML = ministries.map((item, index) => `
    <article class="ministry-card" style="--card-index:${index}">
      <img class="ministry-emblem" src="${escapeHTML(ministryLogos[item.name] || 'download.png')}" alt="${escapeHTML(item.name)} logo" width="58" height="58" loading="lazy">
      <span class="ministry-category">${escapeHTML(item.category)}</span>
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <button type="button" class="ministry-visit" data-ministry="${escapeHTML(item.name)}" aria-label="Learn more about ${escapeHTML(item.name)}">Learn more</button>
    </article>`).join('');
  else ministryList.innerHTML = '<article class="empty-card">Ministry information will be added after the church confirms its active groups.</article>';
}

// Reveal content cards as they enter the viewport, with a small alternating drift.
const revealTargets = '.verse-card, .value-card, .minister-intro, .service-card, .ministry-card, .event-card, .sermon-player, .visit-details article';
let revealObserver;
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  }), { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
}
function observeRevealCards() {
  if (!revealObserver) return;
  document.querySelectorAll(revealTargets).forEach((element, index) => {
    if (element.dataset.revealObserved) return;
    element.dataset.revealObserved = 'true';
    element.style.setProperty('--reveal-x', index % 2 ? '16px' : '-16px');
    element.style.setProperty('--reveal-delay', `${index % 3 * 90}ms`);
    element.classList.add('reveal-card');
    revealObserver.observe(element);
  });
}
observeRevealCards();

const eventList = document.querySelector('#event-list');
function renderEvents(filter = 'all') {
  if (!eventList) return;
  const visible = events.filter(event => filter === 'all' || event.type === filter);
  eventList.innerHTML = visible.length ? visible.map(event => `
    <article class="event-card"><span class="event-type">${escapeHTML(event.typeLabel)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description)}</p><span class="event-date">${escapeHTML(event.date)}${event.time ? ` · ${escapeHTML(event.time)}` : ''}</span></article>`).join('')
    : '<div class="empty-card">No confirmed events or notices to display right now.</div>';
  observeRevealCards();
}
renderEvents();
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  renderEvents(button.dataset.filter);
}));

// Church photos are stored in this browser and shown in a gently advancing carousel.
const galleryDialog = document.querySelector('#gallery-dialog');
const galleryGrid = document.querySelector('#gallery-grid');
let galleryIndex = 0;
let carouselPaused = false;
const galleryPause = document.querySelector('.gallery-pause');
function renderGallery() {
  if (!galleryGrid) return;
  if (!galleryImages.length) {
    galleryGrid.innerHTML = '<div class="gallery-placeholder"><p>Church photos will appear here</p></div>';
    if (galleryPause) galleryPause.hidden = true;
    return;
  }
  if (galleryPause) galleryPause.hidden = galleryImages.length < 2;
  const visibleCount = window.matchMedia('(max-width: 700px)').matches ? 1 : 2;
  galleryIndex = Math.min(galleryIndex, Math.max(0, galleryImages.length - visibleCount));
  galleryGrid.innerHTML = `<div class="gallery-track">${galleryImages.map((item, index) => `<button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="View ${escapeHTML(item.alt)}"><img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt)}" loading="lazy"><span>${escapeHTML(item.caption || item.alt)}</span><i aria-hidden="true">Add your image path in index.html</i></button>`).join('')}</div>`;
  galleryGrid.querySelectorAll('.gallery-item img').forEach(image => image.addEventListener('error', () => image.closest('.gallery-item').classList.add('no-photo'), { once: true }));
  positionGalleryTrack();
}
function positionGalleryTrack() {
  if (!galleryGrid) return;
  const visibleCount = window.matchMedia('(max-width: 700px)').matches ? 1 : 2;
  const step = (galleryGrid.clientWidth - (visibleCount - 1) * 14) / visibleCount + 14;
  const track = galleryGrid.querySelector('.gallery-track');
  if (track) track.style.transform = `translateX(-${galleryIndex * step}px)`;
}
function showGalleryImage(index) {
  if (!galleryImages.length || !galleryDialog) return;
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryDialog.querySelector('img');
  image.src = galleryImages[galleryIndex].src;
  image.alt = galleryImages[galleryIndex].alt;
  galleryDialog.querySelector('figcaption').textContent = galleryImages[galleryIndex].caption || '';
}
if (galleryGrid) {
  renderGallery();
  galleryGrid.addEventListener('click', event => {
    const tile = event.target.closest('[data-gallery-index]');
    if (!tile) return;
    showGalleryImage(Number(tile.dataset.galleryIndex));
    galleryDialog.showModal();
    galleryDialog.querySelector('.lightbox-close').focus();
  });
  const advanceGallery = () => {
    const visibleCount = window.matchMedia('(max-width: 700px)').matches ? 1 : 2;
    const lastIndex = Math.max(0, galleryImages.length - visibleCount);
    if (lastIndex > 0 && !carouselPaused && !galleryDialog?.open) {
      galleryIndex = galleryIndex >= lastIndex ? 0 : galleryIndex + 1;
      positionGalleryTrack();
    }
  };
  let galleryTimer;
  const galleryObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !galleryTimer) galleryTimer = window.setInterval(advanceGallery, 2000);
    else if (!entries[0].isIntersecting && galleryTimer) {
      window.clearInterval(galleryTimer);
      galleryTimer = null;
    }
  }, { threshold: 0.25 });
  galleryObserver.observe(galleryGrid);
  window.addEventListener('resize', positionGalleryTrack);
  galleryGrid.addEventListener('mouseenter', () => { carouselPaused = true; });
  galleryGrid.addEventListener('mouseleave', () => { carouselPaused = false; });
  galleryGrid.addEventListener('focusin', () => { carouselPaused = true; });
  galleryGrid.addEventListener('focusout', event => { if (!galleryGrid.contains(event.relatedTarget)) carouselPaused = false; });
}
const ministerPhoto = document.querySelector('.minister-photo');
if (ministerPhoto) ministerPhoto.addEventListener('error', () => ministerPhoto.closest('.minister-placeholder').classList.add('no-portrait'), { once: true });
const sermonVideo = document.querySelector('.sermon-video');
if (sermonVideo) {
  const sermonPlayer = sermonVideo.closest('.sermon-player');
  sermonVideo.addEventListener('loadedmetadata', () => sermonPlayer.classList.add('has-video'), { once: true });
  sermonVideo.addEventListener('error', () => sermonPlayer.classList.remove('has-video'));
}
if (galleryPause) galleryPause.addEventListener('click', () => {
  carouselPaused = !carouselPaused;
  galleryPause.setAttribute('aria-pressed', String(carouselPaused));
  galleryPause.textContent = carouselPaused ? 'Resume slideshow' : 'Pause slideshow';
});
if (galleryDialog) {
  galleryDialog.querySelector('.lightbox-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.lightbox-prev').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  galleryDialog.querySelector('.lightbox-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) galleryDialog.close(); });
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });
}

// Modal details support for ministry cards once approved data is present.
const detailDialog = document.querySelector('#detail-dialog');
if (ministryList && detailDialog) ministryList.addEventListener('click', event => {
  const button = event.target.closest('[data-ministry]');
  if (!button) return;
  const item = ministries.find(ministry => ministry.name === button.dataset.ministry);
  if (!item) return;
  const coordinator = item.coordinator ? escapeHTML(item.coordinator) : 'Coordinator name to be provided';
  const phone = item.phone ? `<a href="tel:${escapeHTML(item.phone.replace(/[^+\d]/g, ''))}">${escapeHTML(item.phone)}</a>` : '<span>Phone number to be provided</span>';
  const email = item.email ? `<a href="mailto:${escapeHTML(item.email)}">${escapeHTML(item.email)}</a>` : '<span>Email address to be provided</span>';
  detailDialog.querySelector('.modal-content').innerHTML = `<span class="eyebrow">Liberty Congregation · ${escapeHTML(item.category)}</span><h2>${escapeHTML(item.name)}</h2><p>${escapeHTML(item.details || item.description)}</p><div class="coordinator-box"><span class="coordinator-label">Ministry coordinator</span><strong>${coordinator}</strong><p>${phone}</p><p>${email}</p></div><p class="content-note">Please contact the church to confirm this group and its coordinator details.</p>`;
  detailDialog.showModal();
});
if (detailDialog) {
  detailDialog.querySelector('.modal-close').addEventListener('click', () => detailDialog.close());
  detailDialog.addEventListener('click', event => { if (event.target === detailDialog) detailDialog.close(); });
}

// Send messages through the temporary FormSubmit endpoint. The recipient must activate it first.
const contactForm = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');
if (contactForm && feedback) contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  feedback.textContent = '';
  if (!contactForm.reportValidity()) {
    feedback.textContent = 'Please complete each field with a valid email address.';
    return;
  }
  const submitButton = contactForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  contactForm.setAttribute('aria-busy', 'true');

  try {
    const formData = Object.fromEntries(new FormData(contactForm));
    formData._subject = `Liberty Congregation website message: ${formData.subject}`;
    const response = await fetch('https://formsubmit.co/ajax/armahevans09@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) {
      throw new Error('The form service did not accept this message.');
    }

    contactForm.reset();
    feedback.textContent = 'Your message has been submitted. Thank you for getting in touch.';
    window.alert('Your message has been submitted. Thank you for getting in touch.');
  } catch (error) {
    feedback.textContent = 'We could not confirm that your message was sent. Please try again or email armahevans09@gmail.com.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send message';
    contactForm.removeAttribute('aria-busy');
  }
});

// Back-to-top control and current year.
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
