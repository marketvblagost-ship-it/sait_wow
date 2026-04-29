const METRIKA_COUNTER_ID = 108972241;

function sendMetrikaGoal(goalId) {
  if (typeof window.ym === 'function') {
    window.ym(METRIKA_COUNTER_ID, 'reachGoal', goalId);
  }
}

document.querySelectorAll('[data-ym-goals]').forEach((element) => {
  element.addEventListener('click', () => {
    element.dataset.ymGoals
      .split(',')
      .map((goal) => goal.trim())
      .filter(Boolean)
      .forEach(sendMetrikaGoal);
  });
});

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});
