// Плавный скролл к якорям для удобства чтения длинных гайдов
const smoothAnchors = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

const ensureSmoothAnchors = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', smoothAnchors);
  } else {
    smoothAnchors();
  }
};

ensureSmoothAnchors();

// Полноэкранная авторизация до показа контента
const AUTH_STORAGE_KEY = 'kb-auth-granted';

const canUseStorage = () => {
  try {
    const testKey = '__kb-auth-test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

const isAuthenticated = () =>
  canUseStorage() && localStorage.getItem(AUTH_STORAGE_KEY) === '1';

const persistAuth = () => {
  if (!canUseStorage()) return;
  localStorage.setItem(AUTH_STORAGE_KEY, '1');
};

const buildAuthGate = () => {
  const gate = document.createElement('div');
  gate.className = 'kb-auth-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'kb-auth-gate-title');

  gate.innerHTML = `
    <div class="kb-auth-gate__brand">
      <p class="kb-auth-gate__eyebrow">Корпоративный доступ</p>
      <h2 class="kb-auth-gate__title" id="kb-auth-gate-title">Вход в базу знаний</h2>
      <p class="kb-auth-gate__description">
        Все материалы доступны только после проверки учётных данных. Используйте корпоративный Apple ID или SSO.
      </p>
      <div class="kb-auth-gate__badge" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12l2 2 4-4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        SSO и единые пароли
      </div>
      <div class="kb-auth-gate__badge" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v6l3 2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Нет доступа — нет контента
      </div>
    </div>
    <div class="kb-auth kb-auth--gate">
      <div class="kb-auth__chrome">
        <span class="kb-auth__dot kb-auth__dot--red"></span>
        <span class="kb-auth__dot kb-auth__dot--amber"></span>
        <span class="kb-auth__dot kb-auth__dot--green"></span>
      </div>
      <div class="kb-auth__panel">
        <p class="kb-auth__title">Продолжите после входа</p>
        <p class="kb-auth__subtitle">Мы заблокировали навигацию, пока не проверим ваши данные.</p>
        <form class="kb-auth__form" id="kb-auth-form">
          <label class="kb-auth__field">
            <span>Служебный e-mail</span>
            <input type="email" name="email" placeholder="name@company.com" required />
          </label>
          <label class="kb-auth__field">
            <span>Пароль</span>
            <input type="password" name="password" placeholder="••••••••" minlength="8" required />
          </label>
          <label class="kb-auth__checkbox">
            <input type="checkbox" name="remember" checked />
            <span>Запомнить устройство</span>
          </label>
          <button type="submit" class="kb-auth__submit">Войти и открыть сайт</button>
          <p class="kb-auth__hint">Нет доступа? Свяжитесь с владельцем раздела.</p>
          <p class="kb-auth__status" id="kb-auth-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;

  return gate;
};

const lockUntilAuth = () => {
  if (isAuthenticated()) return;

  const gate = buildAuthGate();
  document.documentElement.classList.add('kb-auth-locked');
  document.body.appendChild(gate);

  const form = gate.querySelector('#kb-auth-form');
  const status = gate.querySelector('#kb-auth-status');
  const emailInput = gate.querySelector('input[name="email"]');

  if (emailInput) {
    emailInput.focus();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString().trim();
    const password = (formData.get('password') || '').toString();

    if (!email || !password) {
      status.textContent = 'Укажите учётные данные.';
      status.classList.add('is-error');
      return;
    }

    status.classList.remove('is-error');
    status.textContent = 'Проверяем доступ через SSO...';

    setTimeout(() => {
      status.textContent = 'Доступ подтверждён. Загружаем базу знаний...';
      persistAuth();
      document.documentElement.classList.remove('kb-auth-locked');
      gate.remove();
    }, 600);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lockUntilAuth);
} else {
  lockUntilAuth();
}

// Демонстрационная обработка формы авторизации
const initAuthForm = () => {
  const form = document.getElementById('kb-auth-form');
  const status = document.getElementById('kb-auth-status');
  if (!form || !status) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString().trim();
    const password = (formData.get('password') || '').toString();

    if (!email || !password) {
      status.textContent = 'Укажите учётные данные.';
      status.classList.add('is-error');
      return;
    }

    status.classList.remove('is-error');
    status.textContent = 'Проверяем доступ через SSO...';

    setTimeout(() => {
      status.textContent = 'Готово: переходим в защищённую зону базы знаний.';
    }, 500);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthForm);
} else {
  initAuthForm();
}
