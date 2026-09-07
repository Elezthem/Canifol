const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const mobile = window.matchMedia('(max-width: 1060px)');

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  header.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.hidden = false;
header.classList.add('has-menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  header.classList.toggle('menu-open', open);
});
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  const section = document.querySelector(link.hash);
  if (section) {
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', (event) => {
  if (!header.contains(event.relatedTarget)) closeMenu();
});
mobile.addEventListener('change', () => closeMenu());

// Keep all content readable, including when observers or JavaScript are unavailable.
if ('IntersectionObserver' in window) {
  const links = [...nav.querySelectorAll('a')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}

const lightbox = document.querySelector('.lightbox');
if (typeof lightbox.showModal === 'function') {
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  let opener;
  document.querySelectorAll('.gallery-card').forEach((card) => {
    const thumbnail = card.querySelector('img');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-zoom';
    button.setAttribute('aria-label', `Збільшити: ${thumbnail.alt}`);
    thumbnail.before(button);
    button.append(thumbnail);
    button.addEventListener('click', () => {
      opener = button;
      image.src = thumbnail.src;
      image.alt = thumbnail.alt;
      caption.textContent = card.querySelector('figcaption').textContent;
      lightbox.showModal();
      document.body.classList.add('lightbox-open');
    });
  });
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      const bounds = lightbox.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
    }
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    opener?.focus({ preventScroll: true });
  });
}

const copyButton = document.querySelector('#copy-brief');
const brief = 'Тема дисципліни: \nКількість лабораторних робіт: \nРівень підготовки студентів: \nНаявне обладнання: \nБажані терміни та бюджет: ';
if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(brief);
      status.textContent = 'Шаблон скопійовано. Вставте його у повідомлення та заповніть.';
    } catch {
      status.textContent = 'Не вдалося скопіювати. У запиті вкажіть дисципліну, кількість робіт, обладнання, терміни та бюджет.';
    }
  });
}
