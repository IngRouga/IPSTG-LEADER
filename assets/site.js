// Mobile menu + reveal + modal + lightbox (shared, injected on every page)
document.addEventListener('DOMContentLoaded',()=>{
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobile-menu');
  const menuClose=document.getElementById('mobile-menu-close');
  let scrollLockY=0;
  function openMenu(){
    if(!menu) return;
    scrollLockY=window.scrollY||document.documentElement.scrollTop||0;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    if(burger){burger.classList.add('is-open');burger.setAttribute('aria-expanded','true');}
    document.body.classList.add('menu-open');
    document.body.style.position='fixed';
    document.body.style.top=`-${scrollLockY}px`;
    document.body.style.left='0';
    document.body.style.right='0';
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    if(!menu) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true');
    if(burger){burger.classList.remove('is-open');burger.setAttribute('aria-expanded','false');}
    document.body.classList.remove('menu-open');
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.left='';
    document.body.style.right='';
    document.body.style.overflow='';
    window.scrollTo(0,scrollLockY);
  }
  if(burger&&menu){
    burger.addEventListener('click',()=>{ menu.classList.contains('open') ? closeMenu() : openMenu(); });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    if(menuClose) menuClose.addEventListener('click',closeMenu);
    // Click on the overlay's own background (not on a link/logo/close button) closes it too
    menu.addEventListener('click',(e)=>{ if(e.target===menu) closeMenu(); });
    menu.querySelectorAll('.mm-links, .mm-head').forEach(bg=>bg.addEventListener('click',(e)=>{ if(e.target===bg) closeMenu(); }));
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'&&menu.classList.contains('open')) closeMenu(); });
  }

  // Header: transparent over hero → solid on scroll
  const headerEl=document.getElementById('nav');
  if(headerEl){
    const toggleHeader=()=>{
      if(window.scrollY>40){ headerEl.classList.add('solid'); }
      else{ headerEl.classList.remove('solid'); }
    };
    toggleHeader();
    window.addEventListener('scroll',toggleHeader,{passive:true});
  }

  const reveals=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:.12});
  reveals.forEach(r=>io.observe(r));
  // Safety net: force-reveal everything after 2s in case of slow rendering/observer issues
  setTimeout(()=>{ reveals.forEach(r=>r.classList.add('visible')); }, 2000);

  injectOverlays();
  setupLightbox();

  // Floating buttons must never sit on top of the footer — fade them out once it's in view
  const footerEl=document.querySelector('footer');
  if(footerEl && document.querySelector('.float-stack')){
    const footerIO=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ document.body.classList.toggle('footer-in-view', e.isIntersecting); });
    },{threshold:.01});
    footerIO.observe(footerEl);
  }
});

// ---------- Shared modal + lightbox markup (injected once per page) ----------
function injectOverlays(){
  if(document.getElementById('program-modal')) return;
  const wrap=document.createElement('div');
  wrap.innerHTML=`
  <div id="program-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-5" style="background:rgba(18,21,31,.75);">
    <div class="bg-white rounded-sm max-w-md w-full p-7 relative">
      <button id="program-modal-close" aria-label="Fermer" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      <span id="program-modal-cat" class="text-[10px] font-semibold uppercase tracking-wide" style="color:var(--gold);"></span>
      <h3 id="program-modal-title" class="serif text-xl font-semibold mt-2" style="color:var(--burgundy);"></h3>
      <p id="program-modal-desc" class="text-gray-600 text-sm mt-3"></p>
      <a id="program-modal-cta" href="admissions.html" class="btn-gold inline-block mt-6 px-6 py-3 rounded-sm text-sm font-semibold">S'inscrire à cette formation</a>
    </div>
  </div>
  <div id="lightbox" class="fixed inset-0 z-[100] hidden items-center justify-center p-5" style="background:rgba(18,21,31,.9);">
    <button id="lightbox-close" aria-label="Fermer" class="absolute top-5 right-6 text-white text-3xl leading-none">&times;</button>
    <img id="lightbox-img" src="" alt="" class="max-h-[85vh] max-w-full rounded-sm object-contain">
  </div>`;
  document.body.appendChild(wrap);

  const pm=document.getElementById('program-modal');
  document.getElementById('program-modal-close').addEventListener('click',()=>{pm.classList.add('hidden');pm.classList.remove('flex');});
  pm.addEventListener('click',(e)=>{ if(e.target===pm){pm.classList.add('hidden');pm.classList.remove('flex');} });

  const lb=document.getElementById('lightbox');
  document.getElementById('lightbox-close').addEventListener('click',()=>{lb.classList.add('hidden');lb.classList.remove('flex');});
  lb.addEventListener('click',(e)=>{ if(e.target===lb){lb.classList.add('hidden');lb.classList.remove('flex');} });

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){
      pm.classList.add('hidden');pm.classList.remove('flex');
      lb.classList.add('hidden');lb.classList.remove('flex');
    }
  });
}

function openProgramModal(cat,name,desc){
  injectOverlays();
  document.getElementById('program-modal-cat').textContent=cat;
  document.getElementById('program-modal-title').textContent=name;
  document.getElementById('program-modal-desc').textContent=desc || "Formation dispensée à IPSTG-LEADER. Contactez l'équipe des admissions pour le programme détaillé et les modalités d'inscription.";
  const pm=document.getElementById('program-modal');
  pm.classList.remove('hidden'); pm.classList.add('flex');
}

function setupLightbox(){
  document.querySelectorAll('.lightbox-img').forEach(img=>{
    img.style.cursor='zoom-in';
    img.addEventListener('click',()=>{
      injectOverlays();
      const lb=document.getElementById('lightbox');
      document.getElementById('lightbox-img').src=img.src;
      document.getElementById('lightbox-img').alt=img.alt||'';
      lb.classList.remove('hidden'); lb.classList.add('flex');
    });
  });
}

// Programs data (shared across formations.html and homepage)
const programs={
  licence:[
    ["Administration et gestion","Gestion, organisation et pilotage administratif des structures."],
    ["Génie logiciel","Conception et développement d'applications informatiques."],
    ["Gestion commerciale","Techniques de vente, gestion clientèle et stratégie commerciale."],
    ["Comptabilité et gestion d'entreprise","Fondamentaux comptables et gestion financière des organisations."],
    ["Énergies renouvelables et environnement","Technologies vertes et gestion des ressources énergétiques."],
    ["Intelligence artificielle","Bases de l'IA, apprentissage automatique et applications."],
    ["Informatique de gestion","Systèmes d'information au service de la gestion d'entreprise."],
    ["Télécommunication et réseaux","Infrastructures réseaux et systèmes de communication."],
    ["Transports logistiques","Organisation et gestion des chaînes logistiques."],
    ["Maintenance informatique","Entretien, dépannage et gestion des parcs informatiques."],
    ["Marketing digital","Stratégies marketing et communication sur les canaux numériques."],
  ],
  bts:[
    ["Secrétariat de Direction",""],["Informatique de Gestion",""],["Finance Banque",""],
    ["Gestion commerciale",""],["Maintenance Informatique et électronique",""],
    ["Comptabilité et gestion des entreprises",""],["Communication des entreprises",""],
    ["Génie Électrique",""],["Génie civil",""],["Génie Mécanique",""],["Chaudronnerie",""],
    ["Télécommunication et réseaux informatiques",""],["Énergie Renouvelables et Environnement",""],
    ["Transport Logistique",""],["Microfinance",""],["Administration et gestion des organisations",""],
    ["Pétrole Niger",""],["Industries Agro-alimentaires",""],
  ],
  master:[
    ["Administration et gestion",""],["Génie logiciel",""],["Gestion commerciale",""],
    ["Comptabilité et gestion d'entreprise",""],["Énergies renouvelables et environnement",""],
    ["Intelligence artificielle",""],["Informatique de gestion",""],
    ["Télécommunication et réseaux",""],["Transports logistiques",""],
  ],
  pro:[
    ["Informatique et Technologie",""],["Gestion et Leadership",""],["Ressources Humaines",""],
    ["Marketing et Communication",""],["Finance et Comptabilité",""],["Langues Étrangères",""],
    ["Santé et Sécurité au Travail",""],["Développement Durable et RSE",""],
    ["Développement Personnel",""],["Nouvelles Réglementations",""],
  ]
};
const catLabels={licence:"Licence — Bac+3",bts:"BTS d'État",master:"Master — Bac+5",pro:"Formation Continue"};

function renderPanel(key){
  const panel=document.querySelector(`.tab-panel[data-panel="${key}"]`);
  if(!panel||panel.dataset.rendered) return;
  panel.innerHTML=programs[key].map(([name,desc],i)=>`
    <div class="prog-row">
      <div class="pr-4">
        <span class="text-[10px] font-semibold gold-text uppercase tracking-wide">${catLabels[key]}</span>
        <h3 class="serif text-base font-semibold mt-1">${name}</h3>
        ${desc?`<p class="text-gray-500 text-sm mt-1">${desc}</p>`:''}
      </div>
      <button type="button" class="program-info-btn flex-shrink-0 text-xs font-semibold gold-text whitespace-nowrap" data-cat="${catLabels[key]}" data-name="${name.replace(/"/g,'&quot;')}" data-desc="${(desc||'').replace(/"/g,'&quot;')}">En savoir plus →</button>
    </div>
  `).join('');
  panel.dataset.rendered="1";
  panel.querySelectorAll('.program-info-btn').forEach(btn=>{
    btn.addEventListener('click',()=>openProgramModal(btn.dataset.cat, btn.dataset.name, btn.dataset.desc));
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('.tab-panel')){
    renderPanel('licence');
    document.querySelectorAll('.tab-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('active');b.style.color='var(--burgundy)';b.style.background='';});
        btn.classList.add('active'); btn.style.color='#fff'; btn.style.background='var(--burgundy)';
        const key=btn.dataset.tab;
        renderPanel(key);
        document.querySelectorAll('.tab-panel').forEach(p=>p.classList.add('hidden'));
        document.querySelector(`.tab-panel[data-panel="${key}"]`).classList.remove('hidden');
        document.querySelectorAll(`.tab-panel[data-panel="${key}"] .prog-row`).forEach(el=>el.classList.add('visible'));
      });
    });
  }
});
