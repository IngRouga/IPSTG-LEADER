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

// Generic, non-fabricated presentation + débouchés text generated from the filière's own name/field.
// No invented partners, numbers or employer names — only standard job-family descriptions for the domain.
function getProgramDetails(cat,name,desc){
  const n=name.toLowerCase();
  let debouches;
  if(/informatique|logiciel|réseaux|télécommunication|intelligence artificielle|maintenance informatique/.test(n)){
    debouches=["Développeur / développeuse d'applications","Technicien(ne) ou administrateur(trice) systèmes et réseaux","Chargé(e) de support informatique","Analyste ou chef de projet informatique (avec expérience)"];
  } else if(/gestion commerciale|marketing|communication des entreprises|secrétariat/.test(n)){
    debouches=["Chargé(e) de clientèle ou commercial(e)","Assistant(e) de direction / secrétaire de direction","Chargé(e) de communication ou marketing","Responsable commercial(e) (avec expérience)"];
  } else if(/comptabilité|finance|banque|microfinance/.test(n)){
    debouches=["Comptable ou aide-comptable","Agent(e) ou conseiller(ère) en établissement bancaire ou de microfinance","Assistant(e) financier(ère)","Contrôleur(se) de gestion (avec expérience)"];
  } else if(/administration et gestion|gestion des organisations/.test(n)){
    debouches=["Assistant(e) administratif(ve)","Gestionnaire de structures publiques ou privées","Chargé(e) de projets","Cadre administratif (avec expérience)"];
  } else if(/génie électrique|génie civil|génie mécanique|chaudronnerie/.test(n)){
    debouches=["Technicien(ne) de bureau d'études ou de chantier","Agent(e) de maintenance industrielle","Technicien(ne) en installation et contrôle d'équipements","Chef d'équipe technique (avec expérience)"];
  } else if(/transport|logistique/.test(n)){
    debouches=["Agent(e) ou responsable logistique","Gestionnaire de parc ou d'exploitation transport","Chargé(e) de la chaîne d'approvisionnement","Responsable logistique (avec expérience)"];
  } else if(/énergies renouvelables|environnement/.test(n)){
    debouches=["Technicien(ne) en énergies renouvelables","Agent(e) de suivi environnemental","Chargé(e) de projets énergie/environnement","Responsable technique (avec expérience)"];
  } else if(/ressources humaines/.test(n)){
    debouches=["Assistant(e) ressources humaines","Chargé(e) de recrutement ou de formation","Gestionnaire du personnel","Responsable RH (avec expérience)"];
  } else if(/langues étrangères/.test(n)){
    debouches=["Interprète ou traducteur(trice)","Assistant(e) dans un cadre international","Formateur(trice) en langues","Chargé(e) de relations internationales"];
  } else if(/santé et sécurité/.test(n)){
    debouches=["Agent(e) HSE (Hygiène, Sécurité, Environnement)","Responsable sécurité au travail","Chargé(e) de prévention des risques","Coordinateur(trice) HSE (avec expérience)"];
  } else if(/développement durable|rse/.test(n)){
    debouches=["Chargé(e) de projets RSE","Coordinateur(trice) développement durable","Chargé(e) de suivi environnemental et social"];
  } else if(/développement personnel|nouvelles réglementations/.test(n)){
    debouches=["Formateur(trice) ou facilitateur(trice)","Consultant(e) en accompagnement professionnel","Chargé(e) de veille réglementaire"];
  } else if(/pétrole/.test(n)){
    debouches=["Technicien(ne) du secteur pétrolier","Agent(e) de suivi des opérations pétrolières","Technicien(ne) HSE pétrolier (avec expérience)"];
  } else if(/agro-alimentaires/.test(n)){
    debouches=["Technicien(ne) en industries agro-alimentaires","Agent(e) de contrôle qualité","Responsable de production agro-alimentaire (avec expérience)"];
  } else {
    debouches=["Cadre ou technicien(ne) dans le secteur de la gestion","Chargé(e) de projets","Poste à responsabilité (avec expérience)"];
  }
  const presentation=`La filière ${name} (${catLabels[cat]}) ${desc?`forme les étudiants aux compétences suivantes : ${desc.charAt(0).toLowerCase()+desc.slice(1)}`:"prépare les étudiants aux compétences clés de ce domaine"}. Les enseignements combinent cours théoriques, travaux dirigés et mises en situation pratique, pour une insertion rapide dans la vie professionnelle à l'issue de la formation.`;
  return {presentation,debouches};
}

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
      <a href="filiere-detail.html?cat=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}" class="flex-shrink-0 text-xs font-semibold gold-text whitespace-nowrap">Voir plus →</a>
    </div>
  `).join('');
  panel.dataset.rendered="1";
}

// ---------- Filière detail page (filiere-detail.html) ----------
function initFiliereDetailPage(){
  const root=document.getElementById('filiere-detail-root');
  if(!root) return;
  const params=new URLSearchParams(window.location.search);
  const cat=params.get('cat');
  const name=params.get('name');
  const list=programs[cat]||[];
  const entry=list.find(([n])=>n===name);
  if(!entry){
    root.innerHTML=`<div class="max-w-3xl mx-auto text-center py-10">
      <p class="eyebrow">Filière introuvable</p>
      <h1 class="serif mt-4" style="font-size:clamp(1.75rem,4vw,2.5rem);color:var(--burgundy);">Cette filière n'existe pas ou plus.</h1>
      <a href="filieres.html" class="btn-gold inline-block mt-7 px-7 py-3 rounded-sm font-semibold text-sm">Voir toutes les filières →</a>
    </div>`;
    return;
  }
  const [progName,desc]=entry;
  const {presentation,debouches}=getProgramDetails(cat,progName,desc);
  document.title=`${progName} — ${catLabels[cat]} | IPSTG-LEADER`;
  root.innerHTML=`
    <p class="eyebrow reveal">${catLabels[cat]}</p>
    <h1 class="serif reveal mt-4 leading-[1.05]" style="font-size:clamp(2rem,5vw,3.25rem);color:var(--burgundy);">${progName}</h1>
    <p class="reveal mt-6 text-gray-600 text-base leading-relaxed max-w-2xl">${presentation}</p>

    <h2 class="serif reveal mt-12 text-xl md:text-2xl font-semibold" style="color:var(--burgundy);">Débouchés professionnels</h2>
    <ul class="reveal mt-5 space-y-3 max-w-2xl">
      ${debouches.map(d=>`<li class="flex items-start gap-3 text-gray-700 text-sm md:text-base"><span class="gold-text font-bold mt-0.5">•</span><span>${d}</span></li>`).join('')}
    </ul>

    <div class="reveal mt-12 flex flex-wrap gap-4">
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSez2ukXEiBiVLY73QBf0RpQ-BetLX82rcs8B3XWc1u5Hu8Dtw/viewform" target="_blank" rel="noopener" class="btn-gold inline-block px-8 py-3.5 rounded-sm font-semibold text-sm">S'inscrire à cette filière</a>
      <a href="https://wa.me/22780574747?text=${encodeURIComponent('Bonjour IPSTG-LEADER, je souhaite des informations sur la filière '+progName+' ('+catLabels[cat]+').')}" target="_blank" rel="noopener" class="btn-outline inline-block px-8 py-3.5 rounded-sm font-semibold text-sm">Poser une question (WhatsApp)</a>
      <a href="filieres.html" class="inline-block px-8 py-3.5 rounded-sm font-semibold text-sm gold-text underline self-center">← Toutes les filières</a>
    </div>
  `;
  root.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}
document.addEventListener('DOMContentLoaded',initFiliereDetailPage);

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
