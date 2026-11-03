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
const galleryImages = [];

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
      <img class="ministry-emblem" src="download.png" alt="" width="58" height="58" loading="lazy">
      <span class="ministry-category">${escapeHTML(item.category)}</span>
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <button type="button" class="ministry-visit" data-ministry="${escapeHTML(item.name)}" aria-label="Visit ${escapeHTML(item.name)} information">Visit <span aria-hidden="true">→</span></button>
    </article>`).join('');
  else ministryList.innerHTML = '<article class="empty-card">Ministry information will be added after the church confirms its active groups.</article>';
}

const eventList = document.querySelector('#event-list');
function renderEvents(filter = 'all') {
  if (!eventList) return;
  const visible = events.filter(event => filter === 'all' || event.type === filter);
  eventList.innerHTML = visible.length ? visible.map(event => `
    <article class="event-card"><span class="event-type">${escapeHTML(event.typeLabel)}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description)}</p><span class="event-date">${escapeHTML(event.date)}${event.time ? ` · ${escapeHTML(event.time)}` : ''}</span></article>`).join('')
    : '<div class="empty-card">No confirmed events or notices to display right now.</div>';
}
renderEvents();
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  renderEvents(button.dataset.filter);
}));

// Accessible image lightbox. Populate galleryImages with approved photos and captions.
const galleryDialog = document.querySelector('#gallery-dialog');
const galleryGrid = document.querySelector('#gallery-grid');
let galleryIndex = 0;
function showGalleryImage(index) {
  if (!galleryImages.length || !galleryDialog) return;
  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryDialog.querySelector('img');
  image.src = galleryImages[galleryIndex].src;
  image.alt = galleryImages[galleryIndex].alt;
  galleryDialog.querySelector('figcaption').textContent = galleryImages[galleryIndex].caption || '';
}
if (galleryGrid && galleryImages.length) {
  galleryGrid.innerHTML = galleryImages.map((item, index) => `<button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="View ${escapeHTML(item.alt)}"><img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt)}" loading="lazy"><span>${escapeHTML(item.caption || '')}</span></button>`).join('');
  galleryGrid.addEventListener('click', event => {
    const tile = event.target.closest('[data-gallery-index]');
    if (!tile) return;
    showGalleryImage(Number(tile.dataset.galleryIndex));
    galleryDialog.showModal();
    galleryDialog.querySelector('.lightbox-close').focus();
  });
}
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

// Frontend validation only: no success state implies a message was sent.
const contactForm = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');
if (contactForm && feedback) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  feedback.textContent = '';
  if (!contactForm.reportValidity()) {
    feedback.textContent = 'Please complete each field with a valid email address.';
    return;
  }
  feedback.textContent = 'Your message is ready, but this website is not connected to a message service yet. Please email libertychurch@gmail.com.';
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
