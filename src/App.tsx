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

    let targetScrollX = 0, currentScrollX = 0;
    let targetScrollY = 0, currentScrollY = 0;
    const ease = 0.12;
    let lastActiveIndex = 0;
    let isSnapping = false;
    let activePageIndex = 0;
    let lastKnownWidth = 0;

    let animationFrameId: number;

    function lerp(start: number, end: number, factor: number) {
      return start + (end - start) * factor;
    }

    function shouldScrollVertically(scrollDelta: number, pageEl: HTMLElement | null) {
      if (!pageEl || pageEl.scrollHeight <= pageEl.clientHeight + 5) return false;
      const atTop = pageEl.scrollTop <= 1;
      const atBottom = pageEl.scrollTop + pageEl.clientHeight >= pageEl.scrollHeight - 1;
      if (scrollDelta > 0 && !atBottom) return true;
      if (scrollDelta < 0 && !atTop) return true;
      return false;
    }

    function animate() {
      if (!isRunningRef.current) return;
      if (!container || !slider) return;

      const currentWidth = container.clientWidth;
      if (currentWidth !== lastKnownWidth && currentWidth > 0) {
        lastKnownWidth = currentWidth;
        targetScrollX = activePageIndex * currentWidth;
        currentScrollX = targetScrollX;
        isSnapping = false;
      }

      const currentEase = isSnapping ? 0.25 : ease;
      currentScrollX = lerp(currentScrollX, targetScrollX, currentEase);

      if (Math.abs(currentScrollX - targetScrollX) < 1) {
        currentScrollX = targetScrollX;
        if (isSnapping) isSnapping = false;
      }

      slider.style.transform = 'translate3d(' + (-Math.round(currentScrollX)) + 'px, 0, 0)';

      const safeWidth = currentWidth > 0 ? currentWidth : 1;
      const activeIndex = Math.round(currentScrollX / safeWidth);
      const activePage = document.getElementById('page-' + activeIndex);

      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        if (activePage) {
          targetScrollY = activePage.scrollTop;
          currentScrollY = targetScrollY;
          if (!activePage.classList.contains('page-enter')) {
            activePage.classList.add('page-enter');
            activePage.querySelectorAll('.reveal').forEach((el) => { el.classList.add('visible'); });
          }
        }
        document.querySelectorAll('.nav-dot').forEach((d, j) => {
          d.classList.toggle('active', j === activeIndex);
        });
      }

      if (activePage && activePage.scrollHeight > activePage.clientHeight + 5) {
        currentScrollY = lerp(currentScrollY, targetScrollY, Math.max(0.1, ease));
        if (Math.abs(currentScrollY - targetScrollY) < 0.5) currentScrollY = targetScrollY;
        activePage.scrollTop = currentScrollY;
      }

      const maxScroll = (totalPages - 1) * safeWidth;
      const progress = maxScroll > 0 ? (currentScrollX / maxScroll) * 100 : 0;
      const progressEl = document.getElementById('readingProgress');
      if (progressEl) progressEl.style.width = progress + '%';
      
      if (stb) stb.classList.toggle('visible', safeWidth > 1 && currentScrollX > safeWidth * 0.5);

      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    function snapToPage(targetIndex: number) {
      if (!container) return;
      const pageWidth = container.clientWidth;
      activePageIndex = Math.max(0, Math.min(targetIndex, totalPages - 1));
      targetScrollX = activePageIndex * pageWidth;
      isSnapping = true;
    }

    // --- TYPEWRITER ---
    const typewriterElement = document.getElementById('typewriter');
    const textToType = "SITES WEB · DESIGN · ASSISTANCE INFORMATIQUE";
    let twIndex = 0;
    let isDeleting = false;
    let typeWriterTimeoutId: any;

    function typeWriter() {
      if (!isRunningRef.current) return;
      if (!typewriterElement) return;
      if (!isDeleting) {
        typewriterElement.innerHTML = textToType.substring(0, twIndex + 1);
        twIndex++;
        if (twIndex === textToType.length) { 
          isDeleting = true; 
          typeWriterTimeoutId = setTimeout(typeWriter, 2000); 
          return; 
        }
        typeWriterTimeoutId = setTimeout(typeWriter, 90);
      } else {
        typewriterElement.innerHTML = textToType.substring(0, twIndex - 1);
        twIndex--;
        if (twIndex === 0) { 
          isDeleting = false; 
          typeWriterTimeoutId = setTimeout(typeWriter, 500); 
          return; 
        }
        typeWriterTimeoutId = setTimeout(typeWriter, 40);
      }
    }

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
      setTimeout(() => { snapToPage(i); targetScrollY = 0; }, 350);
    }

    // --- INITIALIZE REVEALS ---
    const p0 = document.getElementById('page-0');
    if (p0) p0.querySelectorAll('.reveal').forEach((el) => { el.classList.add('visible'); });

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    
    const fullScreenMenu = document.getElementById('fullScreenMenu');
    if (fullScreenMenu) fullScreenMenu.addEventListener('click', function (e) {
      const target = e.target as HTMLElement;
      const l = target.closest('.menu-link');
      if (l) { 
        const i = l.getAttribute('data-goto'); 
        if (i !== null) goToPage(parseInt(i, 10)); 
        return; 
      }
      if (e.target === this) closeMenu();
    });

    const globalClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const t = target.closest('.nav-trigger');
      if (t) {
        const i = t.getAttribute('data-goto');
        if (i !== null) goToPage(parseInt(i, 10));
      }
    };
    document.addEventListener('click', globalClickHandler);

    typeWriterTimeoutId = setTimeout(typeWriter, 1200);

    // --- Desktop Scroll (Molette) ---
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (isSnapping) return;

      const safeWidth = container.clientWidth > 0 ? container.clientWidth : 1;
      const activeIndex = Math.round(targetScrollX / safeWidth);
      const pageEl = document.getElementById('page-' + activeIndex);
      const scrollDelta = e.deltaY;

      if (shouldScrollVertically(scrollDelta, pageEl)) {
        targetScrollY += scrollDelta * 0.8;
        if (pageEl) {
          targetScrollY = Math.max(0, Math.min(targetScrollY, pageEl.scrollHeight - pageEl.clientHeight));
        }
      } else {
        if (scrollDelta > 0) {
          snapToPage(activeIndex + 1);
        } else {
          snapToPage(activeIndex - 1);
        }
      }
    };
    container.addEventListener('wheel', wheelHandler, { passive: false });

    // --- Mobile Scroll (Doigt) ---
    let lastTouchY = 0;
    let touchVelocity = 0;
    let lastTouchTime = 0;
    let touchStartPageIndex = 0;

    const touchStartHandler = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      lastTouchTime = Date.now();
      touchVelocity = 0;
      touchStartPageIndex = activePageIndex;
    };

    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const now = Date.now();
      const dragDelta = y - lastTouchY;
      const deltaTime = now - lastTouchTime;
      const scrollDelta = -dragDelta;

      const safeWidth = container.clientWidth > 0 ? container.clientWidth : 1;
      const activeIndex = Math.round(targetScrollX / safeWidth);
      const pageEl = document.getElementById('page-' + activeIndex);

      if (shouldScrollVertically(scrollDelta, pageEl)) {
        targetScrollY += scrollDelta;
        if (pageEl) {
          targetScrollY = Math.max(0, Math.min(targetScrollY, pageEl.scrollHeight - pageEl.clientHeight));
        }
        touchVelocity = 0;
      } else {
        targetScrollX += scrollDelta;
        const maxScroll = (totalPages - 1) * safeWidth;
        targetScrollX = Math.max(0, Math.min(targetScrollX, maxScroll));
        if (deltaTime > 0) touchVelocity = scrollDelta / deltaTime;
      }

      lastTouchY = y;
      lastTouchTime = now;
    };

    const touchEndHandler = () => {
      const inertiaDistance = touchVelocity * 150;
      const finalTarget = targetScrollX + inertiaDistance;
      let targetIndex = Math.round(finalTarget / (container.clientWidth > 0 ? container.clientWidth : 1));
      targetIndex = Math.max(touchStartPageIndex - 1, Math.min(touchStartPageIndex + 1, targetIndex));
      snapToPage(targetIndex);
    };

    container.addEventListener('touchstart', touchStartHandler, { passive: true });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler);

    // --- Flèches clavier ---
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        snapToPage(activePageIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        snapToPage(activePageIndex - 1);
      }
    };
    document.addEventListener('keydown', keydownHandler);

    const stbClickHandler = () => { snapToPage(0); targetScrollY = 0; };
    stb.addEventListener('click', stbClickHandler);

    const navDots = document.querySelectorAll('.nav-dot');
    const navDotClickHandlers: { el: Element, fn: EventListener }[] = [];
    navDots.forEach((d) => {
      const fn = () => {
        snapToPage(parseInt(d.getAttribute('data-idx') || '0', 10));
        targetScrollY = 0;
      };
      d.addEventListener('click', fn);
      navDotClickHandlers.push({ el: d, fn });
    });

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(typeWriterTimeoutId);
      document.removeEventListener('click', globalClickHandler);
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
      document.removeEventListener('keydown', keydownHandler);
      stb.removeEventListener('click', stbClickHandler);
      navDotClickHandlers.forEach(({el, fn}) => el.removeEventListener('click', fn));
      if (menuToggle) menuToggle.removeEventListener('click', toggleMenu);
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
        <div id="book-slider">

          {/* PAGE 0 — COVER */}
          <section id="page-0" className="book-page flex items-center justify-center overflow-hidden" data-idx="0">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_074327_a4d6275d-82d9-4c83-bfbe-f1fb2213c17c.mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            <div className="gutter-shadow gutter-dark"></div>
            <div className="page-curl"></div>
            <div className="max-w-4xl mx-auto px-8 pl-14 md:pl-20 text-center relative">
              <div className="reveal d1 mb-10"><img src={scotLogo} alt="L'Agence de Scott" className="w-40 md:w-52 mx-auto float" /></div>
              <div className="reveal d2"><h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-3 text-white drop-shadow-lg">L'Agence de <span className="text-orange-500">Scott</span>.</h1></div>
              <div className="reveal d3"><p className="text-base md:text-lg font-light tracking-[0.35em] uppercase text-stone-300 mb-10 drop-shadow-md h-8"><span id="typewriter"></span><span id="typewriter-cursor"></span></p></div>
              <div className="reveal d4"><p className="text-stone-400 font-light text-sm flex items-center justify-center gap-2"><MapPin size={14} /> Saint-Amarin · Vallée de Thur · Haut-Rhin</p></div>
              <div className="reveal d6 mt-12">
                <div className="scroll-hint flex items-center justify-center gap-2 text-stone-400"><span className="text-[0.65rem] tracking-[0.25em] uppercase">Scroller pour tourner la page</span><ChevronsRight size={22} /></div>
              </div>
            </div>
            <span className="absolute bottom-8 right-12 text-stone-500 font-serif text-sm italic">i</span>
          </section>

          {/* PAGE 1 — LES SAVOIR-FAIRE */}
          <section id="page-1" className="book-page paper-light text-stone-800" data-idx="1">
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
                <div className="svc-card reveal d3 bg-white border border-stone-200 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/5 rounded-bl-full"></div>
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6"><Code2 size={28} className="text-orange-500" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900">Développement Web</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm">Sites vitrines, e-commerce, applications sur mesure. Un code propre, performant, pensé pour vos utilisateurs.</p>
                  <div className="mt-6 flex flex-wrap gap-2"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">HTML / CSS</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">JavaScript</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">CMS</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Responsive</span></div>
                </div>
                <div className="svc-card reveal d5 bg-white border border-stone-200 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/5 rounded-bl-full"></div>
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6"><Palette size={28} className="text-teal-600" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900">Graphisme</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm">Identité visuelle, logos, supports print &amp; digital. Un design qui raconte votre histoire et marque les esprits.</p>
                  <div className="mt-6 flex flex-wrap gap-2"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Logo</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Charte graphique</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Print</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">UI / UX</span></div>
                </div>
                <div className="svc-card reveal d7 bg-white border border-stone-200 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full"></div>
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6"><MonitorSmartphone size={28} className="text-blue-600" /></div>
                  <h3 className="font-serif text-2xl mb-4 text-stone-900">Assistance Informatique</h3>
                  <p className="text-stone-600 font-light leading-relaxed text-sm">Dépannage, installation, conseils à domicile dans toute la vallée. Un accompagnement humain et de proximité.</p>
                  <div className="mt-6 flex flex-wrap gap-2"><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">À domicile</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Installation</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Dépannage</span><span className="text-[0.65rem] bg-stone-100 px-2 py-1 rounded text-stone-600">Conseil</span></div>
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
          <section id="page-2" className="book-page paper-dark text-stone-100" data-idx="2">
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
                  <div className="portrait-frame w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                    <img src="https://z-cdn-media.chatglm.cn/files/f731fbcd-8db4-4fac-a91c-0b2413d779ce.png?auth_key=1877729329-7b6a01a972de4c7d9a05ee9c8dc80c62-0-16fa48133f75d4c43d56d6d29dbb51f1" alt="Jordan Schmidt" className="w-full h-full object-cover rounded-full border-[5px] border-stone-800 shadow-xl" />
                  </div>
                  <div className="mt-5 text-center">
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
            <span className="absolute bottom-8 right-12 text-stone-700 font-serif text-sm">2</span>
          </section>

          {/* PAGE 3 — LES PROJETS */}
          <section id="page-3" className="book-page paper-light text-stone-800" data-idx="3">
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
                <p className="text-lg font-light text-stone-500 max-w-xl">Chaque collaboration est une aventure. Voici quelques-unes des histoires que j'ai eu le plaisir d'écrire avec mes clients.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-16 lg:gap-y-20">
                <div className="project-card reveal d4">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src={scarlettImage} alt="L'atelier de Scarlett" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-orange-600">Site Web</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">L'atelier de Scarlett</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Site vitrine pour une créatrice en couture et broderie, à Saint-Amarin.</p></div>
                </div>
                <div className="project-card reveal d5">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src="https://picsum.photos/seed/artisan-logo/800/600.jpg" alt="Fromagerie Stoffel" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">Graphisme</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">Fromagerie Stoffel</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Identité visuelle complète&nbsp;: logo, packaging, cartes de visite.</p></div>
                </div>
                <div className="project-card reveal d6">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src="https://picsum.photos/seed/tech-startup-web/800/600.jpg" alt="ValléeTech" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">Application Web</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">ValléeTech</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Application de gestion pour un réseau d'entreprises locales.</p></div>
                </div>
                <div className="project-card reveal d7">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src="https://picsum.photos/seed/mountain-gite/800/600.jpg" alt="Gîte du Markstein" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-orange-600">Web + Graphisme</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">Gîte du Markstein</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Refonte complète&nbsp;: site booking, charte graphique montagne.</p></div>
                </div>
                <div className="project-card reveal d8">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src="https://picsum.photos/seed/mairie-digitale/800/600.jpg" alt="Mairie de Malmerspach" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600">Assistance</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">Mairie de Malmerspach</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Mise en réseau, installation, formation du personnel.</p></div>
                </div>
                <div className="project-card reveal d9">
                  <div className="bg-white p-3 lg:p-4 shadow-xl"><img src="https://picsum.photos/seed/bakery-branding/800/600.jpg" alt="Boulangerie Linder" className="w-full h-56 md:h-72 lg:h-80 object-contain bg-stone-50" /></div>
                  <div className="mt-5 px-1"><span className="text-[0.65rem] lg:text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">Graphisme</span><h3 className="font-serif text-2xl lg:text-3xl mt-2 text-stone-900">Boulangerie Linder</h3><p className="text-stone-500 text-sm lg:text-base font-light mt-2.5 leading-relaxed">Nouvelle identité visuelle pour une boulangerie artisanale.</p></div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-8 right-12 text-stone-300 font-serif text-sm">3</span>
          </section>

          {/* PAGE 4 — ZONE D'INTERVENTION */}
          <section id="page-4" className="book-page paper-dark" data-idx="4">
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
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=700&h=550" alt="Bureau et digital" className="w-full h-72 md:h-[28rem] object-cover shadow-2xl" style={{ border: '8px solid #292524', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }} />
                    <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-5 py-2.5 font-serif text-lg shadow-lg">De la vallée au bout du monde</div>
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
            <span className="absolute bottom-8 right-12 text-stone-700 font-serif text-sm">4</span>
          </section>

          {/* PAGE 5 — CONTACT */}
          <section id="page-5" className="book-page paper-light text-stone-800" data-idx="5">
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
                <p className="text-lg md:text-xl font-light text-stone-500 max-w-xl">Votre histoire commence ici. Parlez-moi de votre projet, et ensemble, écrivons le prochain chapitre.</p>
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
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 tracking-wider uppercase text-xs transition-all duration-300 flex items-center gap-2 group">
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
                    <p className="text-stone-500 text-sm font-light">contact@agencedescott.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3"><Phone size={18} className="text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-stone-900">Téléphone</h4>
                    <p className="text-stone-500 text-sm font-light">Sur demande</p>
                  </div>
                </div>
              </div>
              <div className="reveal d7 mt-10 flex items-center gap-3">
                <a href="#" className="w-10 h-10 border border-stone-300 flex items-center justify-center text-stone-500 hover:border-orange-500 hover:text-orange-500 transition-colors"><Facebook size={17} /></a>
                <a href="#" className="w-10 h-10 border border-stone-300 flex items-center justify-center text-stone-500 hover:border-orange-500 hover:text-orange-500 transition-colors"><Instagram size={17} /></a>
                <a href="#" className="w-10 h-10 border border-stone-300 flex items-center justify-center text-stone-500 hover:border-orange-500 hover:text-orange-500 transition-colors"><Linkedin size={17} /></a>
              </div>
              <div className="mt-auto pt-12 border-t border-stone-200 flex justify-between items-center">
                <p className="text-stone-400 text-xs font-light">© 2025 L'Agence de Scott — Tous droits réservés</p>
                <p className="text-stone-300 font-serif text-sm">5</p>
              </div>
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
