import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

// Small utility to generate an organic blob path (normalized)
function randomBlobPath(seed = 0, points = 6, radius = 42) {
  // Smooth blob generator using cubic bezier control points
  const rnd = (v) => {
    const x = Math.sin(v * 374.345 + seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const pts = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = radius + (rnd(i + 1) - 0.5) * 16;
    pts.push([50 + Math.cos(angle) * r, 50 + Math.sin(angle) * r]);
  }

  // Catmull-Rom to Bezier conversion for smooth curve through pts
  const crToBezier = (p0, p1, p2, p3) => {
    const tension = 0.5;
    const c1x = p1[0] + (p2[0] - p0[0]) * tension / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension / 6;
    return { c1x, c1y, c2x, c2y };
  };

  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    if (i === 0) d += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    const bz = crToBezier(p0, p1, p2, p3);
    d += `C ${bz.c1x.toFixed(2)} ${bz.c1y.toFixed(2)}, ${bz.c2x.toFixed(2)} ${bz.c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  d += 'Z';
  return d;
}

function AvatarArt({ size = 180, seed = 1, src, alt = 'Giselle avatar' }) {
  // Simple square avatar with rounded corners — image fills the container
  return (
    <img src={src} alt={alt} width={size} height={size} className={styles.avatarSimple} />
  );
}

// Reusable Button component (renders <a> when href is provided)
function Button({ href, variant = 'primary', children, target, rel, onClick, className }) {
  const cls = `${styles.btn} ${variant === 'primary' ? styles.btnPrimary : styles.btnSecondary} ${className || ''}`.trim();
  if (href) {
    return (
      <a href={href} className={cls} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Home() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved) setTheme(saved);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', saved || 'dark');
    }
  }, []);

  // ThemeToggle component: checkbox switch with icons (SSR-safe)
  function ThemeToggle() {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const saved = localStorage.getItem('theme');
      const themeAttr = document.documentElement.getAttribute('data-theme');
      const isDark = saved ? saved === 'dark' : themeAttr === 'dark';
      setChecked(isDark);
    }, []);

    const handleChange = (e) => {
      const next = e.target.checked ? 'dark' : 'light';
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', next);
      try { if (typeof window !== 'undefined') localStorage.setItem('theme', next); } catch (err) { }
      setTheme(next);
      setChecked(e.target.checked);
    };

    return (
      <label className={styles.switch} htmlFor="toggle-dark-mode">
        <input aria-label="Alternar tema claro/escuro" aria-pressed={checked} type="checkbox" id="toggle-dark-mode" checked={checked} onChange={handleChange} />
        <span className={styles.slider} aria-hidden>
          <img src="/moon-stars.svg" alt="" aria-hidden className={styles.iconDark} />
          <img src="/sun.svg" alt="" aria-hidden className={styles.iconLight} />
        </span>
      </label>
    );
  }

  // Auto-contrast: compute simple luminance from background and toggle data-contrast
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getLuminanceFromHex = (hex) => {
      if (!hex) return 0;
      // remove #
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      // relative luminance
      const [rr, gg, bb] = [r, g, b].map(c => {
        const nc = c / 255;
        return nc <= 0.03928 ? nc / 12.92 : Math.pow((nc + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
    };

    const evaluateContrast = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      // try to read the computed background-color of body
      const bodyStyle = window.getComputedStyle(document.body).backgroundColor;
      // bodyStyle might be like 'rgb(43,15,58)' or 'rgba(...)' or 'linear-gradient(...)'
      let luminance = 0;
      if (bodyStyle.startsWith('rgb')) {
        const nums = bodyStyle.match(/\d+/g).map(Number);
        const [r, g, b] = nums;
        const [rr, gg, bb] = [r, g, b].map(c => {
          const nc = c / 255;
          return nc <= 0.03928 ? nc / 12.92 : Math.pow((nc + 0.055) / 1.055, 2.4);
        });
        luminance = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
      } else {
        // fallback: use CSS variable --background-color if set
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
        if (bg && bg.startsWith('#')) {
          luminance = getLuminanceFromHex(bg);
        }
      }

      // threshold: 0.5 is fairly bright; pick conservative threshold
      const contrastMode = luminance > 0.45 ? 'low' : 'high';
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-contrast', contrastMode);
    };

    evaluateContrast();
    window.addEventListener('resize', evaluateContrast);
    // observe theme changes (if you toggle theme variable later)
    const obs = new MutationObserver(evaluateContrast);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-theme'] });

    return () => {
      window.removeEventListener('resize', evaluateContrast);
      obs.disconnect();
    };
  }, []);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next);
    }
    try { if (typeof window !== 'undefined') localStorage.setItem('theme', next); } catch (e) { }
  }

  return (
    <>
      <Head>
        <title>Giselle Andrade — Front-end Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Portfólio — Giselle Andrade, Front-end Developer" />
        <link rel="icon" href="/github.svg" />
      </Head>

      <div className={styles.page}>
        <a href="#main" className={styles.skipLink}>Pular para o conteúdo</a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <a href="https://github.com/giselleandrade1" target="_blank" rel="noopener noreferrer" aria-label="Giselle Andrade GitHub profile">
              <div className={styles.logoInner}>
                <img src="https://avatars.githubusercontent.com/u/187031179?v=4" alt="Giselle" width={40} height={40} className={styles.logoAvatar} />
                <span className={styles.logoText}>Giselle Andrade</span>
              </div>
            </a>

            <nav className={styles.nav} aria-label="Main">
              <a href="#about">Sobre</a>
              <a href="#projects">Projetos</a>
              <a href="#contact">Contato</a>
            </nav>

            <div className={styles.headerActions}>
              <ThemeToggle />
            </div>
          </div>
        </header>

  <main id="main" role="main" className={styles.siteMain}>
          <section id="hero" className={styles.section}>
            <div className={styles.heroInner}>
              <div className={styles.avatarWrap}>
                <a href="https://github.com/giselleandrade1" target="_blank" rel="noopener noreferrer" aria-label="Giselle GitHub">
                  <AvatarArt size={180} seed={3} src="https://avatars.githubusercontent.com/u/187031179?v=4" />
                </a>
              </div>

              <div>
                <h1 className={styles.name}>Giselle Andrade</h1>
                <p className={styles.lead}>Front‑end Developer — building accessible, performant and delightful web interfaces.</p>
                <div className={styles.ctas}>
                  <Button href="#projects" variant="primary">Ver projetos</Button>
                  <Button href="#contact" variant="secondary">Entrar em contato</Button>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Sobre</h2>
              <p className={styles.sectionBody}>Sou desenvolvedora front-end com foco em acessibilidade, performance e boas práticas de UX. Trabalho com React, Next.js e CSS moderno para criar produtos bonitos e eficientes.</p>

              <div className={styles.skills}>
                <span className={styles.skill}>React</span>
                <span className={styles.skill}>Next.js</span>
                <span className={styles.skill}>TypeScript</span>
                <span className={styles.skill}>CSS / Tailwind</span>
                <span className={styles.skill}>A11Y</span>
              </div>
            </div>
          </section>

          <section id="projects" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Projetos em destaque</h2>
              <div className={styles.grid}>
                <article className={styles.card}>
                  <h3>Projeto A</h3>
                  <p className={styles.sectionBody}>App responsivo com foco em performance e animações suaves.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto A">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto B</h3>
                  <p className={styles.sectionBody}>Design system e componentes reutilizáveis.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto B">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto C</h3>
                  <p className={styles.sectionBody}>Ferramenta open-source com testes e CI.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto C">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto D</h3>
                  <p className={styles.sectionBody}>Aplicativo de produtividade com sincronização em tempo real.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto D">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto E</h3>
                  <p className={styles.sectionBody}>Dashboard analytics com visualizações e filtros personalizados.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto E">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto F</h3>
                  <p className={styles.sectionBody}>E-commerce headless com otimizações de SEO e performance.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto F">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto G</h3>
                  <p className={styles.sectionBody}>Plataforma colaborativa para designers e desenvolvedores.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto G">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto H</h3>
                  <p className={styles.sectionBody}>Microinterações avançadas e biblioteca de animações.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto H">Ver projeto</a></div>
                </article>

                <article className={styles.card}>
                  <h3>Projeto I</h3>
                  <p className={styles.sectionBody}>Integração com APIs externas e pipelines de dados.</p>
                  <div className={styles.cardFooter}><a href="#" aria-label="Ver projeto — Projeto I">Ver projeto</a></div>
                </article>
              </div>
            </div>
          </section>

          <section id="contact" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Contato</h2>
              <p className={styles.sectionBody}>Quer trabalhar comigo? Me mande uma mensagem — respondo rápido.</p>
              <div className={styles.contactRow}>
                <Button href="mailto:giselle@example.com" variant="primary">Enviar email</Button>
                <Button href="https://wa.link/ld6dq6" variant="secondary" target="_blank" rel="noopener noreferrer">WhatsApp</Button>
              </div>
            </div>
          </section>

        </main>

        <footer className={styles.siteFooter}>
          <div className={styles.footerInner}>
            <div className={styles.socials}>
              <a href="https://github.com/giselleandrade1" target="_blank" rel="noopener noreferrer"><Image src="/github.svg" alt="github" width={20} height={20} /></a>
              <a href="https://www.linkedin.com/in/giselleandrade1" target="_blank" rel="noopener noreferrer"><Image src="/linkedin.svg" alt="linkedin" width={20} height={20} /></a>
              <a href="https://www.instagram.com/giselleandrade1" target="_blank" rel="noopener noreferrer"><Image src="/instagram.svg" alt="instagram" width={20} height={20} /></a>
            </div>
            <p className={styles.copy}>© {new Date().getFullYear()} Giselle Andrade</p>
          </div>
        </footer>
      </div>
    </>
  );
}
