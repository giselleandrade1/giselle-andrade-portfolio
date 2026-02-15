import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

function AvatarArt({ size = 180, src, alt = 'Giselle avatar' }) {
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
  const [, setTheme] = useState('dark');
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

  // High contrast feature removed — kept intentionally blank to avoid SSR changes

  return (
    <>
      <Head>
        <title>Giselle Andrade — Front-end Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Portfólio — Giselle Andrade, Front-end Developer" />
      </Head>

      <div className={styles.page}>
        <a href="#main" className={styles.skipLink}>Pular para o conteúdo</a>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.logoInner}>
              <img src="https://avatars.githubusercontent.com/u/187031179?v=4" alt="Giselle" width={40} height={40} className={styles.logoAvatar} />
              <span className={styles.logoText}>Giselle Andrade</span>
            </div>

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
                <AvatarArt size={180} src="https://avatars.githubusercontent.com/u/187031179?v=4" />
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
            <p className={styles.copy}>© {new Date().getFullYear()} Giselle Andrade</p>
          </div>
        </footer>
      </div>
    </>
  );
}
