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
const AUTH_STORAGE_KEY = 'kb-auth-session';

// Хэши допустимых учётных данных (SHA-256) — логин "admin" и пароль "120488"
const VALID_LOGIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
const VALID_PASSWORD_HASH = 'e81eab89b751a01a21fd595df109cd030d84cac0815fc385e3a926ec8bb34d8c';

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

const decodeSession = () => {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  // Совместимость со старой записью
  if (raw === '1') {
    return { user: 'admin (legacy)' };
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const isAuthenticated = () => Boolean(decodeSession());

const applyPrelockIfNeeded = () => {
  if (!isAuthenticated()) {
    document.documentElement.classList.add('kb-auth-prelock');
  } else {
    document.documentElement.classList.remove('kb-auth-prelock');
  }
};

const persistAuth = user => {
  if (!canUseStorage()) return;
  const payload = { user, ts: Date.now() };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

const clearAuth = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const digestText = async text => {
  if (!window.crypto?.subtle) {
    throw new Error('Crypto API недоступен');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyCredentials = async (login, password) => {
  try {
    const [loginHash, passwordHash] = await Promise.all([
      digestText(login.trim()),
      digestText(password)
    ]);
    return loginHash === VALID_LOGIN_HASH && passwordHash === VALID_PASSWORD_HASH;
  } catch (error) {
    // Если не удалось посчитать хэш, блокируем доступ
    return false;
  }
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
        Все материалы доступны только после проверки учётных данных. Введите служебный логин и пароль, чтобы продолжить.
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
            <span>Логин</span>
            <input type="text" name="login" placeholder="admin" autocomplete="username" required />
          </label>
          <label class="kb-auth__field">
            <span>Пароль</span>
            <input type="password" name="password" placeholder="••••••••" autocomplete="current-password" minlength="6" required />
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
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('kb-auth-prelock');
  });

  const form = gate.querySelector('#kb-auth-form');
  const status = gate.querySelector('#kb-auth-status');
  const loginInput = gate.querySelector('input[name="login"]');
  const submitButton = gate.querySelector('.kb-auth__submit');

  if (loginInput) {
    loginInput.focus();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const login = (formData.get('login') || '').toString().trim();
    const password = (formData.get('password') || '').toString();

    if (!login || !password) {
      status.textContent = 'Укажите учётные данные.';
      status.classList.add('is-error');
      return;
    }

    submitButton.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'Проверяем доступ...';

    verifyCredentials(login, password)
      .then(ok => {
        if (!ok) {
          status.textContent = 'Неверный логин или пароль.';
          status.classList.add('is-error');
          submitButton.disabled = false;
          loginInput?.focus();
          return;
        }

        status.textContent = 'Доступ подтверждён. Загружаем базу знаний...';
        persistAuth(login);
        document.documentElement.classList.remove('kb-auth-locked');
        document.documentElement.classList.remove('kb-auth-prelock');
        gate.remove();
        ensureSessionControls();
      })
      .catch(() => {
        status.textContent = 'Не удалось проверить доступ. Попробуйте ещё раз.';
        status.classList.add('is-error');
        submitButton.disabled = false;
      });
  });
};

const ensureSessionControls = () => {
  const session = decodeSession();
  const existing = document.querySelector('.kb-session-pill');
  if (!session) {
    existing?.remove();
    return;
  }

  if (existing) return;

  const pill = document.createElement('div');
  pill.className = 'kb-session-pill';
  pill.innerHTML = `
    <div class="kb-session-pill__user">
      <span class="kb-session-pill__label">Вы вошли как</span>
      <strong>${session.user || 'admin'}</strong>
    </div>
    <button type="button" class="kb-session-pill__action">Выйти</button>
  `;

  pill.querySelector('.kb-session-pill__action')?.addEventListener('click', () => {
    clearAuth();
    pill.remove();
    lockUntilAuth();
  });

  document.body.appendChild(pill);
};

applyPrelockIfNeeded();

const initAuth = () => {
  lockUntilAuth();
  ensureSessionControls();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
