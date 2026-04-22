// ===== BURGER MENU =====
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
}

// ===== MODAL =====
function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// Escape to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== PORTFOLIO FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== ORDER SIMILAR =====
function orderSimilar(type) {
  // Scroll to contact form
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  // Prefill type in form
  setTimeout(() => {
    const ftypeEl = document.getElementById('ftype');
    if (ftypeEl) {
      for (let i = 0; i < ftypeEl.options.length; i++) {
        if (ftypeEl.options[i].text.toLowerCase().includes(
          type.split('—')[0].toLowerCase().trim().substring(0, 15)
        )) {
          ftypeEl.selectedIndex = i;
          break;
        }
      }
    }
  }, 600);
  showToast('Выберите детали в форме ниже');
}

// ===== FORM SUBMIT =====
function handleSubmit(e) {
  e.preventDefault();
  closeModal();
  showToast('Заявка отправлена! Отвечу в течение 1–2 часов 👋');
  e.target.reset();
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// ===== SMOOTH SCROLL FOR NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
