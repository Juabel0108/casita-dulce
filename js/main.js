/* ==========================================================================
   Preescolar La Casita Dulce — main.js
   ========================================================================== */

/* --- Año en footer --- */
const yearNode = document.querySelector('#year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

/* --- Menú móvil --- */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuToggle && nav) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    if (returnFocus) menuToggle.focus();
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Cierra al hacer clic en un enlace del nav
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) {
      closeMenu();
    }
  });

  // Cierra al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu({ returnFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 740) closeMenu();
  });
}

/* --- Tracking de clics (consola, reemplaza con GA4 si lo necesitas) --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href') || '';

  if (href.startsWith('tel:')) {
    console.log({ event: 'click_call', href, page: location.pathname });
  }

  if (href.includes('wa.me/')) {
    console.log({ event: 'click_whatsapp', href, page: location.pathname });
  }
});

/* --- Formulario → WhatsApp prellenado --- */
document.querySelectorAll('.js-whatsapp-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data     = new FormData(form);
    const context  = form.dataset.formContext || 'información';
    const nombre   = (data.get('nombre')   || '').toString().trim();
    const telefono = (data.get('telefono') || '').toString().trim();
    const ubicacion = (data.get('ubicacion') || '').toString().trim();
    const edad     = (data.get('edad')     || '').toString().trim();

    const lines = [
      `Hola, deseo ${context} en Preescolar La Casita Dulce.`,
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Ubicación de interés: ${ubicacion}`,
    ];

    if (edad) lines.push(`Edad del niño/a: ${edad}`);

    const whatsappByLocation = {
      'Bayamón': '19399881323',
      'Naranjito': '19399881106',
      'Ambas': '17879417801',
    };
    const whatsappNumber = whatsappByLocation[ubicacion] || '17879417801';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

    const wrapper       = form.closest('.contact-form-wrap') || form.parentElement;
    const feedback      = wrapper.querySelector('.form-feedback');
    const waResult      = wrapper.querySelector('.whatsapp-result');

    if (feedback) {
      feedback.classList.add('success');
      feedback.textContent = `¡Listo! Preparamos tu mensaje para el equipo de ${ubicacion === 'Ambas' ? 'La Casita Dulce' : ubicacion}.`;
    }

    if (waResult) {
      waResult.href = url;
      waResult.classList.remove('hidden');
    }

    // Abre WhatsApp con el mensaje listo; la persona confirma el envío.
    window.open(url, '_blank', 'noopener,noreferrer');

    form.reset();
    console.log({ event: 'form_submit', ubicacion, edad, destination: whatsappNumber, page: location.pathname });
  });
});
