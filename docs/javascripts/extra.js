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
