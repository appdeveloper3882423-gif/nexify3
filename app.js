(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const fb = () => window.NEXIFY || {};
  const defaults = {
    services: [
      {id:"android-ios",title:"Android & iOS App Development",description:"User-friendly mobile applications built for performance, reliability and growth.",icon:"▣",published:true,order:1},
      {id:"web",title:"Website Development",description:"Responsive, polished websites that turn visitors into customers.",icon:"⌘",published:true,order:2},
      {id:"software",title:"Software Development",description:"Purpose-built software that simplifies workflows and solves real problems.",icon:"⌁",published:true,order:3},
      {id:"uiux",title:"UI/UX Design",description:"Thoughtful interfaces and clear user journeys designed around people.",icon:"✳",published:true,order:4},
      {id:"graphic",title:"Graphic Designing",description:"Distinctive visual identities and creative assets for digital brands.",icon:"◇",published:true,order:5},
      {id:"qa",title:"Quality Assurance & Testing",description:"Careful testing to make digital experiences dependable and consistent.",icon:"✓",published:true,order:6}
    ],
    products: [{id:"zylokids",title:"Zylokids",category:"Learning app",description:"A learning experience designed to make discovery engaging for kids.",initial:"Z",url:"https://play.google.com/store/apps/details?id=com.zylokidz.learning",published:true,order:1}],
    team: [
      {id:"abdul-wahab",name:"Abdul Wahab",role:"Founder",published:true,order:1},
      {id:"muhammad-ashfaq",name:"Muhammad Ashfaq",role:"CEO",published:true,order:2},
      {id:"rana-zakaria",name:"Rana Zakaria",role:"Graphic Designer",published:true,order:3},
      {id:"muhammad-usman",name:"Muhammad Usman",role:"App Developer",published:true,order:4},
      {id:"muhammad-usama-zahid",name:"Muhammad Usama Zahid",role:"Web Developer",published:true,order:5},
      {id:"mian-umaim",name:"Mian Umaim",role:"QA & Tester",published:true,order:6}
    ],
    social: [
      {id:"facebook",title:"Facebook",url:"https://www.facebook.com/profile.php?id=61593676081344",published:true},
      {id:"instagram",title:"Instagram",url:"https://www.instagram.com/zylokids?igsi=enA4ZGQwNGw4cjM4",published:true},
      {id:"x",title:"X",url:"https://x.com/Wahab_ZyloKidz",published:true},
      {id:"google",title:"Google",url:"https://share.google/vBeixWJ16eg2cmCGt",published:true}
    ],
    site: [{id:"main",company:"Nexify Tech Solutions",tagline:"Innovate. Build. Transform.",email:"whb4912@gmail.com",phone:"+92 307 0610455",published:true}]
  };
  let data = JSON.parse(JSON.stringify(defaults));
  let activeTab = "services";
  let currentUser = null;

  function safeText(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function revealSetup(){
    const nodes = $$(".reveal");
    if (!("IntersectionObserver" in window)){nodes.forEach(n=>n.classList.add("visible"));return;}
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target);}}),{threshold:.12});
    nodes.forEach(n=>io.observe(n));
  }
  function render(){
    $("#servicesGrid").innerHTML = data.services.filter(x=>x.published!==false).sort((a,b)=>(a.order||0)-(b.order||0)).map((x,i)=>`<article class="service-card reveal"><span class="card-index">0${i+1}</span><div class="service-icon">${safeText(x.icon||"✦")}</div><h3>${safeText(x.title)}</h3><p>${safeText(x.description)}</p></article>`).join("");
    $("#productsGrid").innerHTML = data.products.filter(x=>x.published!==false).map(x=>`<article class="product-card reveal"><div class="product-art"><b>${safeText(x.initial||"N")}</b></div><div><div class="eyebrow">${safeText(x.category||"NEXIFY PRODUCT")}</div><h3>${safeText(x.title)}</h3><p>${safeText(x.description)}</p><a class="text-link" href="${safeText(x.url||"#")}" target="_blank" rel="noopener">Explore product ↗</a></div></article>`).join("");
    $("#teamGrid").innerHTML = data.team.filter(x=>x.published!==false).map(x=>{const initials=(x.name||"N").split(/\s+/).slice(0,2).map(y=>y[0]).join("").toUpperCase();return `<article class="team-card reveal"><div class="avatar">${safeText(initials)}</div><h3>${safeText(x.name)}</h3><span class="role">${safeText(x.role)}</span><p>Bringing skill, care and creativity to every project.</p></article>`;}).join("");
    $("#socialLinks").innerHTML = data.social.filter(x=>x.published!==false).map(x=>`<a href="${safeText(x.url)}" target="_blank" rel="noopener">${safeText(x.title)} ↗</a>`).join("");
    $("#year").textContent = new Date().getFullYear();
    revealSetup();
  }
  async function loadPublicContent(){
    if(!fb().db)return;
    for(const col of ["services","products","team","social","site"]){
      try{
        const snap=await fb().db.collection(col).where("published","==",true).get();
        if(!snap.empty)data[col]=snap.docs.map(d=>({id:d.id,...d.data()}));
      }catch(e){console.warn(`Using built-in ${col} content:`,e.message);}
    }
    render();
  }
  $("#menuToggle").addEventListener("click",()=>$("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
  render();loadPublicContent();

  $("#contactForm").addEventListener("submit",async e=>{
    e.preventDefault();const form=e.currentTarget;const status=$("#formStatus");const button=$("button[type=submit]",form);
    const payload=Object.fromEntries(new FormData(form).entries());payload.createdAt=fb().ready?firebase.firestore.FieldValue.serverTimestamp():new Date().toISOString();
    button.disabled=true;button.textContent="Sending…";status.textContent="";
    try{
      if(!fb().db)throw new Error("Database is not available. Please email us directly.");
      await fb().db.collection("inquiries").add(payload);form.reset();status.textContent="Thank you! Your inquiry has been sent.";
    }catch(err){status.textContent=err.message.includes("Database")?"Please email whb4912@gmail.com to contact us.":"Could not send right now. Please email whb4912@gmail.com.";console.error(err);}
    finally{button.disabled=false;button.innerHTML='Send inquiry <span>↗</span>';}
  });

  // Admin dashboard: all editable content is stored as Firestore documents.
  const collections={services:["title","description","icon","order","published"],products:["title","category","description","initial","url","order","published"],team:["name","role","order","published"],social:["title","url","published"],site:["company","tagline","email","phone","published"]};
  function status(id,msg){const el=$("#"+id);if(el)el.textContent=msg;}
  async function isAdmin(user){return user.email === "whb4912@gmail.com" && user.emailVerified === true;}
  function showAdmin(user){currentUser=user;$("#adminLogin").classList.add("hidden");$("#adminDashboard").classList.remove("hidden");$("#adminEmail").textContent=user.email||"Administrator";loadAdminTab(activeTab);}
  $("#loginForm").addEventListener("submit",async e=>{
    e.preventDefault();const f=e.currentTarget;status("loginStatus","Signing in…");
    try{if(!fb().auth)throw new Error("Firebase is not initialized.");const cred=await fb().auth.signInWithEmailAndPassword(f.email.value.trim(),f.password.value);if(!(await isAdmin(cred.user))){await fb().auth.signOut();throw new Error("This account does not have admin permission. Ask the project owner to assign the admin claim.");}showAdmin(cred.user);}
    catch(err){status("loginStatus",err.message);}
  });
  $("#logoutBtn").addEventListener("click",async()=>{if(fb().auth)await fb().auth.signOut();currentUser=null;$("#adminDashboard").classList.add("hidden");$("#adminLogin").classList.remove("hidden");});
  $("#adminTabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;activeTab=b.dataset.tab;$$("button",$("#adminTabs")).forEach(x=>x.classList.toggle("active",x===b));loadAdminTab(activeTab);});
  if(fb().auth)fb().auth.onAuthStateChanged(async user=>{if(user){try{if(await isAdmin(user))showAdmin(user);}catch(e){console.warn(e);}}});
  async function getRows(col){
    if(!fb().db)throw new Error("Firestore is not available.");
    const snap=await fb().db.collection(col).get();return snap.docs.map(d=>({id:d.id,...d.data()}));
  }
  function fieldHTML(key,val){
    const label=key.replace(/[A-Z]/g,m=>" "+m.toLowerCase()).replace(/^./,m=>m.toUpperCase());
    if(key==="published")return `<label>${label}<select name="${key}"><option value="true" ${val!==false?"selected":""}>Visible</option><option value="false" ${val===false?"selected":""}>Hidden</option></select></label>`;
    const type=key==="url"?"url":key==="order"?"number":"text";
    const full=["description","url","company","tagline"].includes(key)?"full":"";
    return `<label class="${full}">${label}<input name="${key}" type="${type}" value="${safeText(val??"")}" ${key==="order"?'min="0" step="1"':""} required></label>`;
  }
  async function loadAdminTab(col){
    const panel=$("#adminPanel");panel.innerHTML="<p class='admin-note'>Loading…</p>";
    try{
      const rows=await getRows(col);
      if(col==="inquiries"){
        panel.innerHTML=`<h3>Customer inquiries</h3><p class="admin-note">Read incoming contact form messages. Messages can be deleted after review.</p><div class="admin-list">${rows.map(x=>`<div class="admin-item"><div><strong>${safeText(x.name)} — ${safeText(x.subject)}</strong><small>${safeText(x.email)} · ${safeText(x.message)}</small></div><div class="admin-actions"><button class="delete" data-delete="${safeText(x.id)}">Delete</button></div></div>`).join("")||"<p class='admin-note'>No inquiries yet.</p>"}</div>`;
      }else{
        const fields=collections[col];const first=rows[0]||{};
        panel.innerHTML=`<h3>Manage ${safeText(col)}</h3><p class="admin-note">Create, edit, publish, hide or delete ${safeText(col)} entries. Text and links only — no paid image storage or uploads.</p><form class="admin-editor" id="contentEditor"><input type="hidden" name="docId" value="">${fields.map(k=>fieldHTML(k, k==="published"?true:k==="order"?rows.length+1:"")).join("")}<button class="btn" type="submit">Save entry ↗</button><p class="form-status full" id="editorStatus"></p></form><div class="admin-list">${rows.map(x=>`<div class="admin-item"><div><strong>${safeText(x.title||x.name||x.company||x.id)}</strong><small>${safeText(x.description||x.role||x.url||x.tagline||"")}</small></div><div class="admin-actions"><button data-edit="${safeText(x.id)}">Edit</button><button class="delete" data-delete="${safeText(x.id)}">Delete</button></div></div>`).join("")||"<p class='admin-note'>No entries saved yet. Use the form above to add one.</p>"}</div>`;
        $("#contentEditor").addEventListener("submit",saveContent);
        $("#contentEditor").dataset.collection=col;
      }
      panel.addEventListener("click",adminAction,{once:true});
    }catch(err){panel.innerHTML=`<p class="form-status">${safeText(err.message)}</p>`;}
  }
  async function saveContent(e){
    e.preventDefault();const form=e.currentTarget;const col=form.dataset.collection;const fields=collections[col];const payload={};
    fields.forEach(k=>{const el=form.elements[k];if(!el)return;payload[k]=k==="published"?el.value==="true":k==="order"?Number(el.value):el.value.trim();});
    try{const id=form.elements.docId.value;if(id)await fb().db.collection(col).doc(id).set(payload,{merge:true});else await fb().db.collection(col).add(payload);status("editorStatus","Saved successfully.");await loadAdminTab(col);await loadPublicContent();}
    catch(err){status("editorStatus",err.message);}
  }
  async function adminAction(e){
    const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");
    if(edit){const col=activeTab;try{const doc=await fb().db.collection(col).doc(edit.dataset.edit).get();const form=$("#contentEditor");const d=doc.data();form.elements.docId.value=doc.id;collections[col].forEach(k=>{const el=form.elements[k];if(el)el.value=k==="published"?String(d[k]!==false):String(d[k]??"");});form.scrollIntoView({behavior:"smooth",block:"center"});}catch(err){alert(err.message);}}
    if(del){if(!confirm("Delete this entry permanently?"))return;try{await fb().db.collection(activeTab).doc(del.dataset.delete).delete();await loadAdminTab(activeTab);await loadPublicContent();}catch(err){alert(err.message);}}
  }
  // Admin area is available at /#admin; auth remains protected by Firebase custom claims.
})();