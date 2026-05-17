import React, { useEffect, useRef } from 'react';
import { ArrowUp, MapPin, ChevronsRight, Code2, Palette, MonitorSmartphone, ArrowRight, Mail, Phone, Facebook, Instagram, Linkedin, CheckCircle } from 'lucide-react';
import scotLogo from './assets/images/regenerated_image_1777995957471.png';
import scarlettImage from './assets/images/regenerated_image_1777997652640.jpg';

export default function App() {
  const isRunningRef = useRef(true);

  useEffect(() => {
    isRunningRef.current = true;
    const container = document.getElementById('book-container');
    const slider = document.getElementById('book-slider');
    const stb = document.getElementById('scrollTopBtn');
    const totalPages = document.querySelectorAll('.book-page').length;

    if (!container || !slider || !stb) return;

    // --- TYPEWRITER ---
    const typewriterElement = document.getElementById('typewriter');
    const stringsToType = [
      "SITES WEB SUR MESURE",
      "DESIGN GRAPHIQUE",
      "ASSISTANCE INFORMATIQUE",
      "IDENTITÉ VISUELLE"
    ];
    let currentStringIndex = 0;
    let twIndex = 0;
    let isDeleting = false;
    let typeWriterTimeoutId: any;

    function typeWriter() {
      if (!isRunningRef.current) return;
      if (!typewriterElement) return;
      
      const currentText = stringsToType[currentStringIndex];

      if (!isDeleting) {
        typewriterElement.innerHTML = currentText.substring(0, twIndex + 1);
        twIndex++;
        if (twIndex === currentText.length) { 
          isDeleting = true; 
          typeWriterTimeoutId = setTimeout(typeWriter, 2500); // Wait longer when word is complete
          return; 
        }
        typeWriterTimeoutId = setTimeout(typeWriter, 70 + Math.random() * 40); // Natural random typing speed
      } else {
        typewriterElement.innerHTML = currentText.substring(0, twIndex - 1);
        twIndex--;
        if (twIndex === 0) { 
          isDeleting = false; 
          currentStringIndex = (currentStringIndex + 1) % stringsToType.length;
          typeWriterTimeoutId = setTimeout(typeWriter, 400); 
          return; 
        }
        typeWriterTimeoutId = setTimeout(typeWriter, 30); // Fast deletion
      }
    }

    typeWriterTimeoutId = setTimeout(typeWriter, 1200);

    // --- MENU ---
    function openMenu() {
      const m = document.getElementById('fullScreenMenu');
      const b = document.getElementById('menuToggle');
      if (!m || !b) return;
      m.style.display = 'flex';
      m.style.transition = 'none';
      m.style.clipPath = 'circle(0% at calc(100% - 2.2rem) 2.2rem)';
      b.classList.add('open');
      document.body.style.overflow = 'hidden';
      // force repaint
      void m.offsetWidth;
      m.style.transition = 'clip-path 0.8s cubic-bezier(0.65,0,0.35,1)';
      m.style.clipPath = 'circle(150% at calc(100% - 2.2rem) 2.2rem)';
      const it = m.querySelectorAll('.menu-item');
      for (let i = 0; i < it.length; i++) {
        setTimeout(() => { it[i].classList.add('show'); }, parseInt(it[i].getAttribute('data-delay') || '0'));
      }
    }
    
    function closeMenu() {
      const m = document.getElementById('fullScreenMenu');
      const b = document.getElementById('menuToggle');
      if (!m || !b) return;
      const it = m.querySelectorAll('.menu-item');
      for (let i = 0; i < it.length; i++) it[i].classList.remove('show');
      b.classList.remove('open');
      m.style.clipPath = 'circle(0% at calc(100% - 2.2rem) 2.2rem)';
      setTimeout(() => { 
        if (m) m.style.display = 'none'; 
        document.body.style.overflow = ''; 
      }, 800);
    }
    
    function toggleMenu() { 
      const m = document.getElementById('fullScreenMenu'); 
      if (m && m.style.display === 'flex') closeMenu(); else openMenu(); 
    }

    function goToPage(i: number) {
      closeMenu();
      const page = document.getElementById('page-' + i);
      if (page) {
        setTimeout(() => { 
          page.scrollIntoView({ behavior: 'smooth' }); 
        }, 350);
      }
    }

    // --- INITIALIZE REVEALS ---
    const p0 = document.getElementById('page-0');
    if (p0) {
      p0.querySelectorAll('.reveal').forEach((el) => { el.classList.add('visible'); });
      p0.classList.add('page-enter');
    }

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    
    const fullScreenMenuClickHandler = function (e: MouseEvent) {
      const target = e.target as HTMLElement;
      const l = target.closest('.menu-link');
      if (l) { 
        const i = l.getAttribute('data-goto'); 
        if (i !== null) goToPage(parseInt(i, 10)); 
        return; 
      }
      if (e.target === fullScreenMenu) closeMenu();
    };
    const fullScreenMenu = document.getElementById('fullScreenMenu');
    if (fullScreenMenu) fullScreenMenu.addEventListener('click', fullScreenMenuClickHandler);

    const globalClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const t = target.closest('.nav-trigger');
      if (t) {
        const i = t.getAttribute('data-goto');
        if (i !== null) goToPage(parseInt(i, 10));
      }
    };
    document.addEventListener('click', globalClickHandler);

    const stbClickHandler = () => { 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };
    stb.addEventListener('click', stbClickHandler);

    const navDots = document.querySelectorAll('.nav-dot');
    const navDotClickHandlers: { el: Element, fn: EventListener }[] = [];
    navDots.forEach((d) => {
      const fn = () => {
        const idxStr = d.getAttribute('data-idx');
        if (idxStr !== null) {
          goToPage(parseInt(idxStr, 10));
        }
      };
      d.addEventListener('click', fn);
      navDotClickHandlers.push({ el: d, fn });
    });

    // --- INTERSECTION OBSERVER ---
    const pages = document.querySelectorAll('.book-page');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const idx = entry.target.getAttribute('data-idx');
        if (entry.isIntersecting) {
          entry.target.classList.add('page-enter');
          entry.target.querySelectorAll('.reveal').forEach((el) => {
             el.classList.add('visible');
          });
          
          navDots.forEach((d) => {
            if (d.getAttribute('data-idx') === idx) {
              d.classList.add('active');
            } else {
              d.classList.remove('active');
            }
          });
        } else {
          // Reset animation so it replays next time
          entry.target.classList.remove('page-enter');
          entry.target.querySelectorAll('.reveal').forEach((el) => {
             el.classList.remove('visible');
          });
        }
      });
    }, { threshold: 0.15 });

    pages.forEach((page) => observer.observe(page));

    // --- SCROLL DROPS ---
    const handleGlobalScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      const progressEl = document.getElementById('readingProgress');
      if (progressEl) progressEl.style.width = progress + '%';
      
      if (stb) stb.classList.toggle('visible', scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleGlobalScroll);

    return () => {
      isRunningRef.current = false;
      clearTimeout(typeWriterTimeoutId);
      document.removeEventListener('click', globalClickHandler);
      stb.removeEventListener('click', stbClickHandler);
      window.removeEventListener('scroll', handleGlobalScroll);
      navDotClickHandlers.forEach(({el, fn}) => el.removeEventListener('click', fn));
      if (menuToggle) menuToggle.removeEventListener('click', toggleMenu);
      if (fullScreenMenu) fullScreenMenu.removeEventListener('click', fullScreenMenuClickHandler);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => { toast.classList.remove('show'); }, 3500);
    }
  };

  return (
    <>
      <div id="readingProgress" style={{ width: '0%' }}></div>
      <div className="book-spine"></div>

      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-4" id="navDots">
        <div className="nav-dot active relative" data-idx="0"><span className="nav-dot-label">Couverture</span></div>
        <div className="nav-dot relative" data-idx="1"><span className="nav-dot-label">Chapitre I</span></div>
        <div className="nav-dot relative" data-idx="2"><span className="nav-dot-label">Chapitre II</span></div>
        <div className="nav-dot relative" data-idx="3"><span className="nav-dot-label">Chapitre III</span></div>
        <div className="nav-dot relative" data-idx="4"><span className="nav-dot-label">Chapitre IV</span></div>
        <div className="nav-dot relative" data-idx="5"><span className="nav-dot-label">Épilogue</span></div>
      </nav>

      <button id="scrollTopBtn" aria-label="Revenir à la couverture">
        <ArrowUp size={18} />
      </button>

      <button id="menuToggle" aria-label="Menu">
        <span className="bar"></span><span className="bar"></span><span className="bar"></span>
      </button>

      <div id="fullScreenMenu">
        <div className="text-center px-6">
          <div className="menu-item" data-delay="100">
            <img src={scotLogo} alt="Logo" className="w-16 mx-auto" />
          </div>
          <div className="menu-item mt-6" data-delay="180">
            <div className="menu-link" data-goto="0">L'Agence de Scott</div>
            <p className="menu-sub">Couverture</p>
          </div>
          <div className="menu-item mt-4 md:mt-5" data-delay="260">
            <div className="menu-link" data-goto="1">Savoir-faire</div>
            <p className="menu-sub">Premier Chapitre</p>
          </div>
          <div className="menu-item mt-4 md:mt-5" data-delay="340">
            <div className="menu-link" data-goto="2">L'Histoire</div>
            <p className="menu-sub">Deuxième Chapitre</p>
          </div>
          <div className="menu-item mt-4 md:mt-5" data-delay="420">
            <div className="menu-link" data-goto="3">Les Projets</div>
            <p className="menu-sub">Troisième Chapitre</p>
          </div>
          <div className="menu-item mt-4 md:mt-5" data-delay="500">
            <div className="menu-link" data-goto="4">Zone d'intervention</div>
            <p className="menu-sub">Quatrième Chapitre</p>
          </div>
          <div className="menu-item mt-4 md:mt-5" data-delay="580">
            <div className="menu-link" data-goto="5">Contact</div>
            <p className="menu-sub">Dernier Chapitre</p>
          </div>
        </div>
      </div>

      <div id="book-container">
        <div id="book-slider" className="flex flex-col">

          {/* PAGE 0 — COVER */}
          <section id="page-0" className="book-page min-h-screen relative flex flex-col justify-center overflow-hidden" data-idx="0">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_074327_a4d6275d-82d9-4c83-bfbe-f1fb2213c17c.mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            <div className="gutter-shadow gutter-dark"></div>
            <div className="page-curl"></div>
            <div className="max-w-4xl mx-auto px-8 pl-14 md:pl-20 text-center relative">
              <div className="reveal d1 mb-10"><img src={scotLogo} alt="L'Agence de Scott" className="w-40 md:w-48 mx-auto float drop-shadow-2xl" /></div>
              <div className="reveal d2"><h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-3 text-white drop-shadow-lg">L'Agence de <span className="text-orange-500">Scott</span>.</h1></div>
              <div className="reveal d3"><p className="text-sm md:text-base font-light tracking-[0.35em] uppercase text-stone-300 mb-10 drop-shadow-md h-8"><span id="typewriter"></span><span id="typewriter-cursor"></span></p></div>
              <div className="reveal d4"><p className="inline-flex items-center justify-center gap-2 text-stone-300 font-light text-xs md:text-sm border border-stone-500/30 bg-stone-900/30 backdrop-blur-sm px-5 py-2.5 rounded-full"><MapPin size={14} className="text-orange-500" /> Saint-Amarin · Vallée de Thur · Haut-Rhin</p></div>
              <div className="reveal d6 mt-16">
                <div className="scroll-hint flex flex-col items-center justify-center gap-2 text-stone-400">
                  <span className="text-[0.65rem] tracking-[0.25em] uppercase opacity-70">Scroller pour découvrir</span>
                  <div className="w-6 h-10 border-2 border-stone-400/50 rounded-full flex justify-center pt-2 mt-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
            <span className="hidden">1</span>
          </section>

          {/* PAGE 1 — LES SAVOIR-FAIRE */}
          <section id="page-1" className="book-page min-h-screen paper-light text-stone-800" data-idx="1">
            <div className="page-shadow-overlay"></div>
            <div className="gutter-shadow gutter-light"></div>
            <div className="page-curl"></div>
            <div className="chapter-watermark">I</div>
            <div className="max-w-6xl mx-auto px-8 pl-14 md:pl-20 py-28 md:py-36 relative flex flex-col my-auto">
              <div className="reveal d1 mb-3"><span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-orange-600">Premier chapitre</span></div>
              <div className="reveal d2 mb-16">
                <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-stone-900">Ce que je peux faire pour vous</h2>
                <div className="w-14 h-[2px] bg-orange-500 mt-5"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="svc-card reveal d3 bg-white border border-stone-200 p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 group-hover:bg-orange-500/10"></div>
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:-translate-y-2"><Code2 size={28} className="text-orange-500" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900 relative z-10">Développement Web</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm relative z-10">Sites vitrines, e-commerce, applications sur mesure. Un code propre, performant, pensé pour vos utilisateurs.</p>
                  <div className="mt-6 flex flex-wrap gap-2 relative z-10"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">HTML / CSS</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">JavaScript</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">CMS</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Responsive</span></div>
                </div>
                <div className="svc-card reveal d5 bg-white border border-stone-200 p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 group-hover:bg-teal-500/10"></div>
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:-translate-y-2"><Palette size={28} className="text-teal-600" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900 relative z-10">Graphisme</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm relative z-10">Identité visuelle, logos, supports print &amp; digital. Un design qui raconte votre histoire et marque les esprits.</p>
                  <div className="mt-6 flex flex-wrap gap-2 relative z-10"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Logo</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Charte graphique</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Print</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">UI / UX</span></div>
                </div>
                <div className="svc-card reveal d7 bg-white border border-stone-200 p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full transition-transform duration-500 group-hover:scale-150 group-hover:bg-blue-500/10"></div>
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:-translate-y-2"><MonitorSmartphone size={28} className="text-blue-600" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900 relative z-10">Assistance Informatique</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm relative z-10">Dépannage, installation, conseils à domicile dans toute la vallée. Un accompagnement humain et de proximité.</p>
                  <div className="mt-6 flex flex-wrap gap-2 relative z-10"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">À domicile</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Installation</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Dépannage</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600 border border-stone-200">Conseil</span></div>
                </div>
              </div>
              <div className="reveal d8 mt-16 flex justify-center">
                <button className="nav-trigger inline-flex items-center gap-3 bg-orange-600 hover:bg-stone-900 text-white px-8 py-3.5 font-sans font-medium text-sm tracking-widest uppercase transition-colors duration-500 cursor-pointer" data-goto="5">
                  Prendre contact
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <span className="absolute bottom-8 right-12 text-stone-300 font-serif text-sm">1</span>
          </section>

          {/* PAGE 2 — L'HISTOIRE */}
          <section id="page-2" className="book-page min-h-screen paper-dark text-stone-100" data-idx="2">
            <div className="page-shadow-overlay"></div>
            <div className="gutter-shadow gutter-dark"></div>
            <div className="chapter-watermark" style={{ color: 'rgba(232,119,34,0.04)' }}>II</div>
            <div className="max-w-6xl mx-auto px-8 pl-14 md:pl-20 py-28 md:py-36 relative flex flex-col my-auto">
              <div className="reveal d1 mb-3"><span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-orange-500">Deuxième chapitre</span></div>
              <div className="reveal d2 mb-16">
                <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-stone-100">Mon Histoire</h2>
                <div className="w-14 h-[2px] bg-orange-500 mt-5"></div>
              </div>
              <div className="grid md:grid-cols-5 gap-12 items-start">
                <div className="md:col-span-2 flex flex-col items-center reveal d3">
                  <div className="portrait-frame w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 relative group">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <img loading="lazy" src="https://z-cdn-media.chatglm.cn/files/f731fbcd-8db4-4fac-a91c-0b2413d779ce.png?auth_key=1877729329-7b6a01a972de4c7d9a05ee9c8dc80c62-0-16fa48133f75d4c43d56d6d29dbb51f1" alt="Jordan Schmidt" className="w-full h-full object-cover rounded-full border-[6px] border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2" />
                  </div>
                  <div className="mt-8 text-center">
                    <p className="font-serif text-xl text-stone-100">Jordan Schmidt</p>
                    <p className="text-stone-400 text-xs font-light tracking-wider mt-1">Fondateur</p>
                  </div>
                </div>
                <div className="md:col-span-3 space-y-6">
                  <p className="reveal d4 text-lg md:text-xl font-light leading-relaxed text-stone-400">Chaque projet a une histoire. La mienne commence au cœur de la <strong className="font-medium text-stone-100">Vallée de Saint-Amarin</strong>, entre les sommets vosgiens et la passion du digital.</p>
                  <p className="reveal d5 text-lg md:text-xl font-light leading-relaxed text-stone-400">Je m'appelle <strong className="font-medium text-stone-100">Jordan Schmidt</strong>. Derrière <strong className="font-medium text-stone-100">L'Agence de Scott</strong>, il y a une profonde conviction&nbsp;: celle de créer, de résoudre et d'accompagner avec une véritable <em className="text-orange-500 not-italic font-medium">approche humaine</em>.</p>
                  <p className="reveal d6 text-lg md:text-xl font-light leading-relaxed text-stone-400">Du site web sur-mesure qui donne vie à votre identité, au graphique qui raconte vos valeurs, jusqu'à l'assistance informatique qui vous simplifie le quotidien, je mets mon savoir-faire au service de ceux qui font vibrer notre territoire.</p>
                  <p className="reveal d7 text-lg md:text-xl font-light leading-relaxed text-stone-400">Ici, pas de grands discours corporatifs. Juste une expertise authentique, l'écoute et l'envie de transformer vos idées en réalité numérique.</p>
                  <div className="reveal d9 border-l-4 border-orange-500 pl-6 pt-2 pb-2">
                    <blockquote className="font-serif text-xl md:text-2xl italic text-stone-400 leading-snug">«&nbsp;Chaque projet est une page blanche, et ensemble, nous écrivons la vôtre.&nbsp;»</blockquote>
                  </div>
                </div>
              </div>
            </div>
            <span className="hidden">3</span>
          </section>

          {/* PAGE 3 — LES PROJETS */}
          <section id="page-3" className="book-page min-h-screen paper-light text-stone-800" data-idx="3">
            <div className="page-shadow-overlay"></div>
            <div className="gutter-shadow gutter-light"></div>
            <div className="page-curl"></div>
            <div className="chapter-watermark">III</div>
            <div className="max-w-6xl mx-auto px-8 pl-14 md:pl-20 py-28 md:py-36 relative flex flex-col my-auto">
              <div className="reveal d1 mb-3"><span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-orange-600">Troisième chapitre</span></div>
              <div className="reveal d2 mb-6">
                <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-stone-900">Les Projets</h2>
                <div className="w-14 h-[2px] bg-orange-500 mt-5"></div>
              </div>
              <div className="reveal d3 mb-16">
                <p className="text-lg md:text-xl font-light text-stone-600 max-w-2xl leading-relaxed">Chaque collaboration est une aventure. Voici quelques-unes des histoires que j'ai eu le plaisir d'écrire avec mes clients.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-16 lg:gap-y-20">
                <a href="https://latelierdescarlett.fr" target="_blank" rel="noopener noreferrer" className="project-card reveal d4 block cursor-pointer group">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src={scarlettImage} alt="L'atelier de Scarlett" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-orange-600">Site Web</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      L'atelier de Scarlett
                      <ArrowRight className="text-orange-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Site vitrine pour une créatrice en couture et broderie, à Saint-Amarin.</p>
                  </div>
                </a>
                <div className="project-card reveal d5 group cursor-pointer">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src="https://picsum.photos/seed/artisan-logo/800/600.jpg" alt="Fromagerie Stoffel" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">Graphisme</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      Fromagerie Stoffel
                      <ArrowRight className="text-teal-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Identité visuelle complète&nbsp;: logo, packaging, cartes de visite.</p>
                  </div>
                </div>
                <div className="project-card reveal d6 group cursor-pointer">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src="https://picsum.photos/seed/tech-startup-web/800/600.jpg" alt="ValléeTech" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">Application Web</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      ValléeTech
                      <ArrowRight className="text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Application de gestion pour un réseau d'entreprises locales.</p>
                  </div>
                </div>
                <div className="project-card reveal d7 group cursor-pointer">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src="https://picsum.photos/seed/mountain-gite/800/600.jpg" alt="Gîte du Markstein" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-orange-600">Web + Graphisme</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      Gîte du Markstein
                      <ArrowRight className="text-orange-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Refonte complète&nbsp;: site booking, charte graphique montagne.</p>
                  </div>
                </div>
                <div className="project-card reveal d8 group cursor-pointer">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src="https://picsum.photos/seed/mairie-digitale/800/600.jpg" alt="Mairie de Malmerspach" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">Assistance</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      Mairie de Malmerspach
                      <ArrowRight className="text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Mise en réseau, installation, formation du personnel.</p>
                  </div>
                </div>
                <div className="project-card reveal d9 group cursor-pointer">
                  <div className="bg-white p-3 lg:p-4 shadow-xl overflow-hidden relative">
                    <img loading="lazy" src="https://picsum.photos/seed/bakery-branding/800/600.jpg" alt="Boulangerie Linder" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50 transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 px-1">
                    <span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">Graphisme</span>
                    <h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900 flex items-center justify-between">
                      Boulangerie Linder
                      <ArrowRight className="text-teal-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" size={24} />
                    </h3>
                    <p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Nouvelle identité visuelle pour une boulangerie artisanale.</p>
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-8 right-12 text-stone-300 font-serif text-sm">3</span>
          </section>

          {/* PAGE 4 — ZONE D'INTERVENTION */}
          <section id="page-4" className="book-page min-h-screen paper-dark" data-idx="4">
            <div className="page-shadow-overlay"></div>
            <div className="gutter-shadow gutter-dark"></div>
            <div className="chapter-watermark" style={{ color: 'rgba(232,119,34,0.04)' }}>IV</div>
            <div className="max-w-6xl mx-auto px-8 pl-14 md:pl-20 py-28 md:py-36 relative flex flex-col my-auto">
              <div className="reveal d1 mb-3"><span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-orange-500">Quatrième chapitre</span></div>
              <div className="reveal d2 mb-16">
                <h2 className="font-serif text-4xl md:text-6xl tracking-tight">Zone d'intervention</h2>
                <div className="w-14 h-[2px] bg-orange-500 mt-5"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="reveal d3">
                  <div className="relative group" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                    <div className="overflow-hidden relative" style={{ border: '8px solid #292524' }}>
                      <img loading="lazy" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=700&h=550" alt="Bureau et digital" className="w-full h-72 md:h-[28rem] object-cover shadow-2xl transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-5 py-2.5 font-serif text-lg shadow-lg transition-transform duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2 z-10">De la vallée au bout du monde</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="reveal d4 text-lg md:text-xl font-light leading-relaxed text-stone-400">Le digital ne devrait jamais rimer avec distance. Que vous soyez mon voisin ou à l'autre bout de la France, l'<strong className="font-medium text-stone-100">accompagnement</strong> reste mon maître mot.</p>
                  <p className="reveal d5 text-lg md:text-xl font-light leading-relaxed text-stone-400">Le siège de <strong className="font-medium text-stone-100">L'Agence de Scott</strong> est au cœur de la Vallée de Saint-Amarin, parce qu'il n'y a pas besoin de gratte-ciel pour construire de grands projets.</p>
                  <div className="reveal d6 bg-stone-800 border border-stone-700 p-6 shadow-lg border-l-4 border-orange-500">
                    <h4 className="font-serif text-lg mb-2 text-stone-100">Intervention physique locale</h4>
                    <p className="text-stone-500 font-light text-sm leading-relaxed">Assistance, conseil et configuration à domicile sur l'ensemble de la vallée et ses alentours&nbsp;: Saint-Amarin, Malmerspach, Fellering, Oderen, Kruth, Wildenstein, Ranspach, Husseren-Wesserling, Moosch, Urbès, Storckensohn, Willer, Bitschwiller-lès-Thann.<br /><br /><strong>Les frais de déplacements sont offerts pour toute intervention dans la vallée de Saint-Amarin.</strong></p>
                  </div>
                  <p className="reveal d7 text-lg md:text-xl font-light leading-relaxed text-stone-400">Pour le développement de sites web et la création graphique, l'agence intervient <strong className="font-medium text-stone-100">partout, sans barrières</strong>.</p>
                </div>
              </div>
            </div>
            <span className="hidden">5</span>
          </section>

          {/* PAGE 5 — CONTACT */}
          <section id="page-5" className="book-page min-h-screen paper-light text-stone-800" data-idx="5">
            <div className="page-shadow-overlay"></div>
            <div className="gutter-shadow gutter-light"></div>
            <div className="page-curl"></div>
            <div className="chapter-watermark">V</div>
            <div className="max-w-4xl mx-auto px-8 pl-14 md:pl-20 py-28 md:py-36 flex flex-col h-full">
              <div className="reveal d1 mb-3"><span className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-orange-600">Dernier chapitre</span></div>
              <div className="reveal d2 mb-6">
                <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-stone-900">L'Épilogue</h2>
                <div className="w-14 h-[2px] bg-orange-500 mt-5"></div>
              </div>
              <div className="reveal d3 mb-14">
                <p className="text-lg md:text-xl font-light text-stone-600 max-w-2xl leading-relaxed">Votre histoire commence ici. Parlez-moi de votre projet, et ensemble, écrivons le prochain chapitre.</p>
              </div>
              <form className="space-y-6 max-w-xl reveal d4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-stone-500 mb-2">Nom</label>
                    <input type="text" required placeholder="Votre nom" className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-stone-500 mb-2">Email</label>
                    <input type="email" required placeholder="votre@email.fr" className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-stone-500 mb-2">Sujet</label>
                  <select className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition text-sm">
                    <option value="">Choisissez un sujet</option>
                    <option>Développement Web</option>
                    <option>Graphisme</option>
                    <option>Assistance Informatique</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-stone-500 mb-2">Message</label>
                  <textarea rows={5} required placeholder="Racontez-moi votre projet…" className="w-full bg-white border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none text-sm"></textarea>
                </div>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 tracking-wider uppercase text-xs transition-all duration-300 flex items-center gap-3 group shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 rounded-sm">
                  Envoyer le message<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <div className="reveal d6 mt-20 grid sm:grid-cols-3 gap-8 border-t border-stone-200 pt-12">
                <div className="flex items-start gap-3"><MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-stone-900">Adresse</h4>
                    <p className="text-stone-500 text-sm font-light">Saint-Amarin<br />68550, France</p>
                  </div>
                </div>
                <div className="flex items-start gap-3"><Mail size={18} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-stone-900">Email</h4>
                    <a href="mailto:contact@agencedescott.fr" className="text-stone-500 text-sm font-light hover:text-orange-600 transition">contact@agencedescott.fr</a>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <a href="https://facebook.com/agencedescott" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://instagram.com/agencedescott" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://linkedin.com/company/agencedescott" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </div>
              <footer className="mt-20 pt-12 border-t border-stone-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-stone-400 text-xs font-light tracking-wide">&copy; {new Date().getFullYear()} L'Agence de Scott — Tous droits réservés.</p>
                  <p className="text-stone-400 text-xs font-light tracking-wide text-center md:text-right">
                    Design & Développement par <span className="text-stone-600 font-medium">Jordan Schmidt</span>.
                  </p>
                  <p className="text-stone-300 font-serif text-sm">V</p>
                </div>
              </footer>
            </div>
          </section>

        </div>
      </div>

      <div id="toast" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 shadow-2xl z-[300] flex items-center gap-2 rounded-sm">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">Message envoyé avec succès !</span>
      </div>
    </>
  );
}
