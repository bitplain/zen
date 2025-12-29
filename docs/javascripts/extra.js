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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', smoothAnchors);
} else {
  smoothAnchors();
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
