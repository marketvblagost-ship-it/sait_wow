const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const buttons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.portfolio-card');
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category.includes(filter);
      card.style.display = matches ? '' : 'none';
    });
  });
});

const nicheField = document.querySelector('#business-niche');
const typeField = document.querySelector('#site-type');
const quickLinks = document.querySelectorAll('[data-order-niche]');
quickLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const niche = link.dataset.orderNiche || '';
    const type = link.dataset.orderType || '';
    if (nicheField) nicheField.value = niche;
    if (typeField && type) typeField.value = type;
  });
});
