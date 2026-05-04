const METRIKA_COUNTER_ID = 108972241;

// Статичный сайт не может сам отправить заявку в личный Telegram без серверного обработчика.
// Если позже подключите webhook/бота, вставьте URL сюда: сайт → webhook → Telegram.
const LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwcP5k9FD8E5ZUg1VCnrh-0ZgHJhmp4EAfUPsHCZ6GLAlYv8j0ebigapOLJiZB904h3NQ/exec';
const TELEGRAM_URL = 'https://t.me/AmalTarget';
const WHATSAPP_NUMBER = '79832676282';

function sendMetrikaGoal(goalId, params = {}) {
  if (typeof window.ym === 'function') {
    window.ym(METRIKA_COUNTER_ID, 'reachGoal', goalId, params);
  }
}

function bindMetrikaGoals(root = document) {
  root.querySelectorAll('[data-ym-goals]').forEach((element) => {
    if (element.dataset.boundMetrika === '1') return;
    element.dataset.boundMetrika = '1';
    element.addEventListener('click', () => {
      element.dataset.ymGoals
        .split(',')
        .map((goal) => goal.trim())
        .filter(Boolean)
        .forEach((goal) => sendMetrikaGoal(goal));
    });
  });
}

bindMetrikaGoals();

const quizSteps = [
  {
    key: 'niche',
    title: 'Какая у вас сфера?',
    hint: 'Выберите вариант — следующий вопрос откроется сам.',
    options: ['Услуги', 'Товары', 'Бьюти / медицина', 'Ремонт / строительство', 'Авто', 'Другая сфера']
  },
  {
    key: 'site_type',
    title: 'Что нужно сделать?',
    hint: 'Это поможет подобрать структуру первого экрана.',
    options: ['Лендинг', 'Сайт услуг', 'Сайт товара', 'Сайт-визитка', 'Пока не знаю']
  },
  {
    key: 'priority',
    title: 'Что важнее всего?',
    hint: 'Так макет будет ближе к вашей реальной задаче.',
    options: ['Больше заявок', 'Красивый внешний вид', 'Быстрый запуск', 'Низкая цена', 'Без подписки и конструктора']
  },
  {
    key: 'contact_way',
    title: 'Куда удобнее отправить макет?',
    hint: 'На финальном шаге оставите Telegram или телефон.',
    options: ['Telegram', 'WhatsApp', 'Позвонить', 'Пока не знаю']
  }
];

const quizModal = document.getElementById('quizModal');
const quizBody = document.getElementById('quizBody');
const quizProgressBar = document.getElementById('quizProgressBar');

const quizState = {
  step: 0,
  source: '',
  answers: {}
};

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  params.forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'yclid') result[key] = value;
  });
  return result;
}

function openQuiz(source = 'button') {
  quizState.step = 0;
  quizState.source = source;
  quizState.answers = {};
  quizModal.hidden = false;
  document.body.classList.add('quiz-open');
  sendMetrikaGoal('quiz_open', { source });
  renderQuizStep();
}

function closeQuiz() {
  quizModal.hidden = true;
  document.body.classList.remove('quiz-open');
}

function renderQuizStep() {
  const totalSteps = quizSteps.length + 1;
  const progress = Math.round(((quizState.step + 1) / totalSteps) * 100);
  quizProgressBar.style.width = `${progress}%`;

  if (quizState.step >= quizSteps.length) {
    renderContactStep();
    return;
  }

  const current = quizSteps[quizState.step];
  const options = current.options.map((option) => `
    <button class="quiz-option" type="button" data-quiz-answer="${escapeHtml(option)}">
      ${escapeHtml(option)} <span>выбрать</span>
    </button>
  `).join('');

  quizBody.innerHTML = `
    <p class="quiz-kicker">Шаг ${quizState.step + 1} из ${totalSteps}</p>
    <h2 class="quiz-title" id="quizTitle">${escapeHtml(current.title)}</h2>
    <p class="quiz-hint">${escapeHtml(current.hint)}</p>
    <div class="quiz-options">${options}</div>
    <div class="quiz-back-row">
      <button class="quiz-back-btn" type="button" data-quiz-back ${quizState.step === 0 ? 'hidden' : ''}>← назад</button>
      <span class="quiz-count">Без кнопки «Далее»</span>
    </div>
  `;

  quizBody.querySelectorAll('[data-quiz-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.dataset.quizAnswer;
      quizState.answers[current.key] = answer;
      button.classList.add('active');
      sendMetrikaGoal(`quiz_step_${quizState.step + 1}`, { answer, source: quizState.source });
      window.setTimeout(() => {
        quizState.step += 1;
        renderQuizStep();
      }, 160);
    });
  });

  const backButton = quizBody.querySelector('[data-quiz-back]');
  if (backButton) backButton.addEventListener('click', goBack);
}

function renderContactStep() {
  quizProgressBar.style.width = '100%';
  quizBody.innerHTML = `
    <p class="quiz-kicker">Финальный шаг</p>
    <h2 class="quiz-title" id="quizTitle">Куда отправить макет?</h2>
    <p class="quiz-hint">Оставьте Telegram или телефон. После отправки свяжусь с вами, уточню информацию по сайту и подготовлю макет.</p>
    <form class="quiz-contact-box" id="quizLeadForm">
      <label for="quizContact">Telegram или телефон</label>
      <input id="quizContact" name="contact" type="text" inputmode="text" autocomplete="tel" placeholder="@username или +7 999 999-99-99" required minlength="3">
      <button class="quiz-submit" type="submit">Получить макет</button>
      <p class="quiz-legal">Без спама. Контакт нужен только для связи по макету сайта.</p>
    </form>
    <div class="quiz-back-row">
      <button class="quiz-back-btn" type="button" data-quiz-back>← назад</button>
      <span class="quiz-count">4 ответа уже учтены</span>
    </div>
  `;

  quizBody.querySelector('[data-quiz-back]').addEventListener('click', goBack);
  quizBody.querySelector('#quizLeadForm').addEventListener('submit', submitQuizLead);
  const input = quizBody.querySelector('#quizContact');
  window.setTimeout(() => input.focus(), 60);
}

async function submitQuizLead(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const contact = form.elements.contact.value.trim();
  if (!contact) return;

  const payload = {
    contact,
    source: quizState.source,
    answers: { ...quizState.answers },
    page: window.location.href,
    utm: getUtmParams(),
    createdAt: new Date().toISOString()
  };

  sendMetrikaGoal('quiz_submit', payload);
  sendMetrikaGoal('get_mockup', payload);
  localStorage.setItem('amalSiteLastQuizLead', JSON.stringify(payload));

  let sent = false;
  if (LEAD_ENDPOINT) {
    try {
      await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      sent = true;
    } catch (error) {
      sent = false;
    }
  }

  const message = buildLeadMessage(payload);
  await copyLeadText(message);
  renderSuccessStep(payload, sent, message);

  if (!sent) {
    window.open(TELEGRAM_URL, '_blank', 'noopener');
  }
}

function renderSuccessStep(payload, sent, message) {
  const summary = [
    ['Сфера', payload.answers.niche],
    ['Сайт', payload.answers.site_type],
    ['Главное', payload.answers.priority],
    ['Связь', payload.answers.contact_way],
    ['Контакт', payload.contact]
  ];

  const rows = summary.map(([label, value]) => `<p><b>${escapeHtml(label)}:</b> ${escapeHtml(value || '—')}</p>`).join('');

  quizBody.innerHTML = `
    <div class="quiz-success">
      <p class="quiz-kicker">Готово</p>
      <h3>Заявка собрана</h3>
      <p>${sent ? 'Заявка отправлена. Я свяжусь с вами, уточню информацию по сайту и подготовлю макет.' : 'Заявка подготовлена. Telegram открыт — отправьте сообщение в чат @AmalTarget, и я свяжусь с вами для уточнения информации по сайту.'}</p>
      <div class="quiz-result-card">${rows}</div>
      <div class="quiz-copy-box">
        <textarea readonly id="leadText">${escapeHtml(message)}</textarea>
      </div>
      <div class="quiz-actions">
        <button class="btn copy-btn" type="button" id="copyLeadBtn">Скопировать заявку</button>
        <a class="btn primary" href="${TELEGRAM_URL}" target="_blank" rel="noopener" data-ym-goals="click_telegram">Открыть Telegram</a>
        <a class="btn secondary" href="${buildWhatsAppUrl(payload)}" target="_blank" rel="noopener" data-ym-goals="click_whatsapp">Отправить в WhatsApp</a>
      </div>
    </div>
  `;

  quizBody.querySelector('#copyLeadBtn').addEventListener('click', async () => {
    await copyLeadText(message);
    quizBody.querySelector('#copyLeadBtn').textContent = 'Скопировано';
  });

  bindMetrikaGoals(quizBody);
}

function buildLeadMessage(payload) {
  return [
    'Здравствуйте! Хочу получить макет сайта за 4 499 ₽ до 10 мая.',
    '',
    `Контакт: ${payload.contact}`,
    `Сфера: ${payload.answers.niche || '-'}`,
    `Тип сайта: ${payload.answers.site_type || '-'}`,
    `Главное: ${payload.answers.priority || '-'}`,
    `Удобная связь: ${payload.answers.contact_way || '-'}`,
    `Источник кнопки: ${payload.source || '-'}`,
    '',
    `Страница: ${payload.page}`
  ].join('\n');
}

function buildWhatsAppUrl(payload) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildLeadMessage(payload))}`;
}

async function copyLeadText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function goBack() {
  if (quizState.step > 0) {
    quizState.step -= 1;
    renderQuizStep();
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.querySelectorAll('.js-open-quiz').forEach((button) => {
  button.addEventListener('click', () => openQuiz(button.dataset.quizSource || 'button'));
});

document.querySelectorAll('[data-quiz-close]').forEach((element) => {
  element.addEventListener('click', closeQuiz);
});

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !quizModal.hidden) closeQuiz();
});
