// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Respect reduced-motion preference ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Typing effect in hero ----------
const typedEl = document.getElementById('typed');
const phrases = ['web.', 'brand.', 'store.', 'future.', 'vision.'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = phrases[0]; // static, no animation
  } else {
    typeLoop();
  }
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('a[data-nav]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent-bright)' : '';
      });
    }
  });
}, { rootMargin: '-50% 0px -45% 0px' });

sections.forEach(sec => navObserver.observe(sec));

// ---------- Back to top + scroll progress bar ----------
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');

function onScroll() {
  const scrolled = window.scrollY;
  backToTop.classList.toggle('visible', scrolled > 600);

  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Pre-select package when a "Choose..." button is clicked ----------
const packageSelect = document.querySelector('select[name="package"]');

document.querySelectorAll('[data-package]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (packageSelect) {
      packageSelect.value = btn.getAttribute('data-package');
    }
  });
});

// ---------- Contact form (submits to Web3Forms — https://web3forms.com) ----------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Message received — I\'ll reply within 1 business day.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong — please email LSdigital024@gmail.com directly.';
      }
    } catch {
      formStatus.textContent = 'Something went wrong — please email LSdigital024@gmail.com directly.';
    }
  });
}

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
