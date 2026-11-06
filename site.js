(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const defaults = {
    services:[
      {title:'Mobile App Development',icon:'▣',description:'Modern Android and iOS applications designed for usability, performance and scale.'},
      {title:'Website Development',icon:'⌘',description:'Responsive business websites and web applications with clean interfaces.'},
      {title:'Software Development',icon:'⌬',description:'Custom software that streamlines workflows and solves business challenges.'},
      {title:'UI/UX Design',icon:'✧',description:'Intuitive user journeys and polished interfaces that make every interaction count.'},
      {title:'Graphic Designing',icon:'◈',description:'Distinctive visual identities and creative assets that help brands stand out.'},
      {title:'Quality Assurance & Testing',icon:'✓',description:'Thorough testing to improve stability, usability and confidence before launch.'}
    ],
    team:[
      {name:'Abdul Wahab',role:'Founder',initials:'AW',order:1},{name:'Muhammad Ashfaq',role:'CEO',initials:'MA',order:2},
      {name:'Rana Zakaria',role:'Graphic Designer',initials:'RZ',order:3},{name:'Muhammad Usman',role:'App Developer',initials:'MU',order:4},
      {name:'Muhammad Usama Zahid',role:'Web Developer',initials:'MZ',order:5},{name:'Mian Umaim',role:'QA & Tester',initials:'MU',order:6}
    ],
    products:[{name:'Zylokids',category:'Kids learning app · Android',description:'A kids-focused learning app by Nexify Tech Solutions. Visit its official Google Play listing for current app details and availability.',image:'',playUrl:'https://play.google.com/store/apps/details?id=com.zylokidz.learning',featured:true}],
    social:[{label:'Facebook',url:'https://www.facebook.com/profile.php?id=61593676081344'},{label:'Instagram',url:'https://www.instagram.com/zylokidz?igsi=enA4ZGQwNGw4cjM4'},{label:'X',url:'https://x.com/Wahab_ZyloKidz'},{label:'Google',url:'https://share.google/vBeixWJ16eg2cmCGt'}]
  };
  let db=null, storage=null;
  try { if (window.firebase && window.NEXIFY_FIREBASE_CONFIG) { if (!firebase.apps.length) firebase.initializeApp(NEXIFY_FIREBASE_CONFIG); db=firebase.firestore(); storage=firebase.storage(); window.nexifyFirebase={app:firebase.app(),auth:firebase.auth(),db,storage}; } } catch(e){ console.warn('Firebase initialization:',e); }
  const safe = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reveal = () => { const els=$$('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('visible'));return;} const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.12}); els.forEach(e=>io.observe(e)); };
  const serviceCard = x => `<article class="service-card reveal"><div class="service-icon">${safe(x.icon||'✧')}</div><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p><span class="card-arrow">↗</span></article>`;
  const teamCard = x => `<article class="team-card reveal"><div class="team-monogram">${safe(x.initials || String(x.name||'N').split(' ').map(v=>v[0]).slice(0,2).join(''))}</div><div><small>${safe(x.role)}</small><h3>${safe(x.name)}</h3></div><span class="team-spark">✳</span></article>`;
  const productCard = x => `<article class="product-card reveal"><div class="product-visual">${x.image?`<img src="${safe(x.image)}" alt="${safe(x.name)} app artwork">`:`<div class="product-art"><span class="product-orbit"></span><b>Z</b><i>LEARN · PLAY · GROW</i></div>`}</div><div class="product-info"><div class="eyebrow">${safe(x.category||'NEXIFY PRODUCT')}</div><h3>${safe(x.name)}</h3><p>${safe(x.description)}</p><div class="product-actions"><a class="button button-small" href="product.html?slug=${encodeURIComponent(x.slug||'zylokids')}">Explore product ↗</a>${x.playUrl?`<a class="store-link" href="${safe(x.playUrl)}" target="_blank" rel="noopener">Google Play ↗</a>`:''}</div></div></article>`;
  async function collection(name, fallback){ if(!db)return fallback; try{const snap=await db.collection(name).where('published','==',true).get(); return snap.empty?fallback:snap.docs.map(d=>({id:d.id,...d.data()}));}catch(e){console.warn('CMS read '+name,e);return fallback;} }
  async function settings(){if(!db)return {};try{const d=await db.collection('site').doc('settings').get();return d.exists?d.data():{};}catch(e){return {};}}
  async function render(){const [services,team,products,social,site]=await Promise.all([collection('services',defaults.services),collection('team',defaults.team),collection('products',defaults.products),collection('social',defaults.social),settings()]);
    $('#servicesGrid').innerHTML=services.sort((a,b)=>(a.order||0)-(b.order||0)).map(serviceCard).join('');
    $('#teamGrid').innerHTML=team.sort((a,b)=>(a.order||0)-(b.order||0)).map(teamCard).join('');
    $('#productsGrid').innerHTML=products.sort((a,b)=>(a.order||0)-(b.order||0)).map(productCard).join('');
    $('#socialLinks').innerHTML=social.sort((a,b)=>(a.order||0)-(b.order||0)).map(s=>`<a href="${safe(s.url)}" target="_blank" rel="noopener">${safe(s.label)} ↗</a>`).join('');
    if(site.companyName)document.title=site.companyName+' | '+(site.tagline||'Innovate. Build. Transform.');
    if(site.email){$$('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+site.email;a.textContent=site.email;});}
    if(site.phone){const wa='https://wa.me/'+site.phone.replace(/\D/g,'');$$('a[href*="wa.me"]').forEach(a=>{a.href=wa;a.textContent=site.phone;});}
    reveal();
  }
  const menu=$('.menu-toggle'); menu?.addEventListener('click',()=>$('.nav-links').classList.toggle('open'));
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>$('.nav-links').classList.remove('open')));
  const header=$('.site-header'); addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
  $$('.service-card,.team-card,.product-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}));
  $('#year').textContent=new Date().getFullYear();
  $('#contactForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,btn=$('button[type="submit"]',form),status=$('#formStatus');btn.disabled=true;btn.textContent='Sending…';status.textContent='';const data=Object.fromEntries(new FormData(form).entries());data.createdAt=db?firebase.firestore.FieldValue.serverTimestamp():new Date().toISOString();data.status='new';try{if(!db)throw new Error('Firebase is not configured');await db.collection('inquiries').add(data);status.textContent='Thank you! Your inquiry has been sent.';status.className='form-status success';form.reset();}catch(err){console.error(err);const subject=encodeURIComponent(data.subject);const body=encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);location.href=`mailto:whb4912@gmail.com?subject=${subject}&body=${body}`;status.textContent='Your email app is opening. Please send the prepared message.';status.className='form-status';}finally{btn.disabled=false;btn.innerHTML='Send inquiry <b>↗</b>';}});
  render();
})();
