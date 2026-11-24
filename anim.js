/* =============================================
   Animations partagées par toutes les pages
   - titres qui apparaissent mot par mot au défilement
   - barre de progression de lecture
   - survol des liens du menu (texte qui roule)
   ============================================= */
(() => {
  const below = en => en.boundingClientRect.top > 0; // l'élément est sous l'écran : on est remonté au-dessus
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;
  doc.classList.add('js-anim');

  /* Pas de transition entre pages : seule l accueil a son ouverture */

  /* ---------- Barre de progression ---------- */
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const onScroll = () => {
    const max = doc.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Liens du menu : le texte roule au survol ---------- */
  document.querySelectorAll('.main-nav a').forEach(a => {
    const t = a.textContent.trim();
    a.innerHTML = `<span class="roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
  });

  /* ---------- Boutons « Copier l'adresse » ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Adresse copiée ✓';
      } catch (e) {
        btn.textContent = btn.dataset.copy;
      }
      btn.classList.add('is-done');
      setTimeout(() => { btn.textContent = label; btn.classList.remove('is-done'); }, 2200);
    });
  });

  /* ---------- Pages projet : le média et les blocs de texte apparaissent au défilement ---------- */
  document.querySelectorAll('#description-motion-projet .container > div:not(.section-head), #description-affiche .container > div:not(.section-head)')
    .forEach(el => el.classList.add('reveal'));

  /* ---------- Galeries : les vignettes apparaissent en cascade ---------- */
  const gItems = [...document.querySelectorAll('.photo-item, .video-card, .poster-card')];
  if (gItems.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      gItems.forEach(el => el.classList.add('g-in'));
    } else {
      gItems.forEach(el => el.classList.add('g-item'));
      let batch = 0, batchTimer;
      const ioG = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) { if (below(en)) { en.target.classList.remove('g-in'); en.target.style.transitionDelay = '0ms'; } return; }
          en.target.style.transitionDelay = `${Math.min(batch++, 6) * 80}ms`;
          en.target.classList.add('g-in');
        });
        clearTimeout(batchTimer);
        batchTimer = setTimeout(() => { batch = 0; }, 120);
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      gItems.forEach(el => ioG.observe(el));
    }
  }

  /* ---------- Visionneuse photo : apparition douce + glisser au doigt ---------- */
  const lbBox = document.getElementById('lightbox');
  const lbImgEl = document.getElementById('lb-img');
  if (lbBox && lbImgEl) {
    new MutationObserver(() => {
      lbImgEl.classList.remove('lb-pop');
      void lbImgEl.offsetWidth;
      lbImgEl.classList.add('lb-pop');
    }).observe(lbImgEl, { attributes: true, attributeFilter: ['src'] });

    let tx = null;
    lbBox.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    lbBox.addEventListener('touchend', e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (Math.abs(dx) > 50) document.getElementById(dx < 0 ? 'lb-next' : 'lb-prev')?.click();
    });
  }

  /* ---------- [data-stagger] : chaque enfant apparaît à son tour ---------- */
  document.querySelectorAll('[data-stagger]').forEach(box => {
    [...box.children].forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i, 8) * 90}ms`;
    });
  });

  /* ---------- Affiche À propos : les plans bougent à des vitesses différentes au défilement ---------- */
  const poster = document.querySelector('.ap-poster');
  if (poster && !reduce) {
    let ticking = false;
    const update = () => {
      poster.style.setProperty('--p', Math.min(scrollY / innerHeight, 1.2).toFixed(3));
      // Une fois la section suivante en haut de l'écran, l'affiche (collée) est cachée : elle ne transparaît plus sous la suite
      const next = poster.nextElementSibling;
      poster.style.visibility = next && next.getBoundingClientRect().top <= 0 ? 'hidden' : '';
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
    // Affiche plus haute que l'écran (mobile) : elle ne se fige qu'une fois son bas atteint, pour tout voir avant
    const fitTop = () => { poster.style.top = Math.min(0, innerHeight - poster.offsetHeight) + 'px'; };
    addEventListener('resize', fitTop, { passive: true });
    addEventListener('load', fitTop);
    fitTop();
  }

  /* ---------- Animations réversibles : tout ce qui repasse sous l'écran (on remonte) se recache,
     pour rejouer l'apparition quand on redescend. Vérifié au défilement : un défilement rapide
     peut sauter les rappels de l'IntersectionObserver ---------- */
  if (!reduce) {
    let tick = false;
    const hideBelow = () => {
      tick = false;
      document.querySelectorAll('.reveal.visible, .split.in, [data-reveal-img].in, .g-item.g-in').forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.remove('visible', 'in', 'g-in');
          if (el.classList.contains('g-item')) el.style.transitionDelay = '0ms';
        }
      });
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(hideBelow); } }, { passive: true });
  }

  /* ---------- Blocs .reveal : apparition au défilement (toutes les pages) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const ioR = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('visible');
        else if (below(en)) en.target.classList.remove('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => ioR.observe(el));
  }

  /* ---------- Titres : apparition mot par mot ---------- */
  const splitWords = el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.className = 'wi';
            inner.style.transitionDelay = `${i++ * 70}ms`;
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    el.classList.add('split');
  };

  if (!reduce) {
    const titles = document.querySelectorAll('.section-title, .ap-big, .ap-name, .cat-hero h1, .page-hero h1, .section-head h2, [data-split]');
    titles.forEach(splitWords);
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('in');
        else if (below(en)) en.target.classList.remove('in');
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    titles.forEach(t => io.observe(t));

    // Images qui se dévoilent (rideau vertical)
    const imgs = document.querySelectorAll('[data-reveal-img]');
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add('in');
        else if (below(en)) en.target.classList.remove('in');
      });
    }, { threshold: 0.15 });
    imgs.forEach(i => io2.observe(i));
  } else {
    document.querySelectorAll('[data-reveal-img]').forEach(i => i.classList.add('in'));
  }
})();
