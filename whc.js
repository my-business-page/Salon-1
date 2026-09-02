(() => {
  const body = document.body;
  const loader = document.querySelector('.loader');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const canvas = document.querySelector('#strandCanvas');

  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('done'), 450));

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
    }));
  }

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) entry.target.classList.add('exit');
        else entry.target.classList.remove('exit');
      });
    }, { threshold: 0.1, rootMargin: '-8% 0px -8% 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  const header = document.querySelector('.site-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 20);
    body.style.setProperty('--scroll-progress', `${Math.min(100, (y / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100)}%`);
    lastY = y;
  }, {passive:true});

  if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1, raf=0, t=0;
    const resize = () => { dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight; canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const draw = () => {
      t += .006; ctx.clearRect(0,0,w,h);
      for(let s=0;s<7;s++){
        ctx.beginPath();
        const baseX=w*(.38+s*.08), amp=35+s*7;
        for(let i=0;i<=90;i++){
          const y=h*(i/90), x=baseX + Math.sin(i*.105+t*(1+s*.08)+s)*amp + Math.sin(i*.027-t)*35;
          i?ctx.lineTo(x,y):ctx.moveTo(x,y);
        }
        ctx.strokeStyle=s%3===0?'rgba(216,92,58,.20)':s%3===1?'rgba(216,229,166,.22)':'rgba(23,19,17,.10)';
        ctx.lineWidth=s%2?1:1.5; ctx.stroke();
      }
      raf=requestAnimationFrame(draw);
    };
    addEventListener('resize',resize); resize(); draw();
    addEventListener('pagehide',()=>cancelAnimationFrame(raf));
  }

  document.querySelectorAll('.service-card,.contact-tile,.journey-visual,.menu-visual').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (innerWidth < 800) return;
      const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  if (innerWidth > 900) {
    addEventListener('pointermove', e => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    }, {passive:true});
  }
})();