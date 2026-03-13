'use strict';

/* ── DATA STORE ── */
const store = {
  currentUser: null,
  adminUser:   'admin',
  adminPass:   'LD@2026',
  messages:    [],
  nextProjectId: 4,
  projects: [
    { id:1, name:'Quantum Enhanced Intrusion Detection & Anomaly Classification', year:'2025',
      desc:'CAN bus-based IDS for smart EVs using quantum-inspired ML. Classifies network anomalies and detects cyberattacks with high accuracy, with real-time dashboards.',
      tech:'Python,Qiskit,Scikit-learn,Pandas,CAN Dataset' },
    { id:2, name:'Real-Time Health Monitoring System using AWS IoT', year:'2025',
      desc:'AWS IoT-powered heart rate & SpO2 monitoring with SNS alerts, role-based access, and dashboards backed by DynamoDB & RDS via CloudFront.',
      tech:'AWS IoT Core,MQTT,DynamoDB,SNS,RDS,CloudFront,JavaScript' },
    { id:3, name:'Artworks Showcase & E-Commerce Platform', year:'2024',
      desc:'Responsive platform to showcase and sell artworks with filtering, search, and interactive UI. MySQL-backed product and order management.',
      tech:'HTML5,CSS3,JavaScript,MySQL' }
  ],
  softSkills: ['🎯 Leadership','🤝 Teamwork','📋 Event Management','💡 Problem Solving','📣 Communication','⚡ Quick Learner','🎨 Creative Thinking'],
};

/* ── CUSTOM CURSOR ── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function animRing(){rx+=(mx-rx)*0.14;ry+=(my-ry)*0.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();
document.addEventListener('mouseover',e=>{if(e.target.matches('a,button,.btn,.skill-tag,.tech-pill,.highlight-chip,.admin-btn,.login-btn,.login-tab,.admin-tab')){dot.classList.add('hover');ring.classList.add('hover');}});
document.addEventListener('mouseout', e=>{if(e.target.matches('a,button,.btn,.skill-tag,.tech-pill,.highlight-chip,.admin-btn,.login-btn,.login-tab,.admin-tab')){dot.classList.remove('hover');ring.classList.remove('hover');}});

/* ── PAGE SYSTEM ── */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Scroll to top — double rAF ensures it fires after browser paint
  setTimeout(()=>{
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
    // Also directly scroll the hero section into view if going to portfolio
    if(id==='portfolioPage'){
      const hero=document.getElementById('hero');
      if(hero) hero.scrollIntoView({block:'start',behavior:'instant'});
    }
  },0);
}

/* ── ADMIN LOGIN ── */
function loginAdmin(){
  const user=document.getElementById('adminUser').value.trim(),pass=document.getElementById('adminPass').value.trim(),err=document.getElementById('adminError');
  if(user!==store.adminUser||pass!==store.adminPass){err.textContent='>> Invalid credentials.';return;}
  store.currentUser={type:'admin',name:'Admin'};
  showPage('adminPage');
  renderAdminProjects();renderAdminSoftTags();renderAdminMessages();updateAdminStats();
}
function logout(){
  store.currentUser=null;showPage('portfolioPage');
}
function switchToPortfolio(){
  showPage('portfolioPage');
}

/* ── PORTFOLIO INIT ── */
let portfolioReady=false;
function initPortfolio(){
  if(portfolioReady)return;portfolioReady=true;
  initCanvas();initTypewriter();initCounters();initReveal();initNavScroll();initProjectTilt();
}
// Auto-init on load — no login required
initPortfolio();

/* ── Particle Canvas ── */
function initCanvas(){
  const canvas=document.getElementById('heroCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let W,H;const particles=[];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  window.addEventListener('resize',resize);resize();
  class Particle{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-0.5)*0.35;this.vy=(Math.random()-0.5)*0.35;this.size=Math.random()*1.2+0.3;this.alpha=Math.random()*0.5+0.1;this.color=Math.random()>0.5?'0,245,212':'123,47,255';}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill();}
    update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
  }
  for(let i=0;i<100;i++)particles.push(new Particle());
  (function loop(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.strokeStyle=`rgba(0,245,212,${0.06*(1-d/100)})`;ctx.lineWidth=0.5;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}}
    particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(loop);
  })();
}

/* ── Typewriter ── */
function initTypewriter(){
  const phrases=['Software Developer','Cloud & IoT Engineer','ML Enthusiast','Problem Solver','Quick Learner'];
  let pi=0,ci=0,deleting=false;
  const el=document.querySelector('.typewriter');if(!el)return;
  function tw(){const phrase=phrases[pi];if(!deleting){el.textContent=phrase.slice(0,++ci);if(ci===phrase.length){deleting=true;setTimeout(tw,1600);return;}}else{el.textContent=phrase.slice(0,--ci);if(ci===0){deleting=false;pi=(pi+1)%phrases.length;}}setTimeout(tw,deleting?55:90);}
  tw();
}

/* ── Counters ── */
function animateCounter(el){
  const target=parseFloat(el.getAttribute('data-target')),dec=parseInt(el.getAttribute('data-dec')||'0'),suffix=el.getAttribute('data-suffix')||'';
  if(isNaN(target)){el.textContent='0'+suffix;return;}
  const start=performance.now();
  (function step(ts){const p=Math.min((ts-start)/1800,1);el.textContent=(target*(1-Math.pow(1-p,3))).toFixed(dec)+suffix;if(p<1)requestAnimationFrame(step);})(start);
}
function initCounters(){setTimeout(()=>document.querySelectorAll('.counter-num').forEach(animateCounter),500);}

/* ── Scroll Reveal + Skill Bars ── */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      if(entry.target.classList.contains('reveal'))entry.target.classList.add('visible');
      if(entry.target.classList.contains('skill-panel')){entry.target.querySelectorAll('.skill-bar-fill').forEach(b=>b.style.width=b.dataset.pct+'%');obs.unobserve(entry.target);}
    });
  },{threshold:0.15});
  document.querySelectorAll('.reveal,.skill-panel').forEach(el=>obs.observe(el));
}

/* ── Navbar ── */
function initNavScroll(){
  const nb=document.getElementById('navbar'),secs=document.querySelectorAll('#portfolioPage section[id]'),links=document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',()=>{nb.classList.toggle('scrolled',window.scrollY>60);let cur='';secs.forEach(s=>{if(window.scrollY>=s.offsetTop-120)cur=s.id;});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));});
}

/* ── Project Tilt ── */
function initProjectTilt(){
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5;card.style.transform=`translateY(-6px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;card.style.transition='transform 0.1s';});
    card.addEventListener('mouseleave',()=>{card.style.transform='';card.style.transition='transform 0.4s ease, box-shadow 0.4s ease';});
  });
}

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});

/* ── Hero Glitch ── */
setInterval(()=>{const h=document.querySelector('.hero-name');if(h){h.style.filter='blur(1.5px) brightness(1.3)';setTimeout(()=>h.style.filter='',90);}},7000);

/* ── CONTACT FORM ── */
function submitContact(){
  const name=document.getElementById('cfName').value.trim(),email=document.getElementById('cfEmail').value.trim(),subject=document.getElementById('cfSubject').value.trim(),msg=document.getElementById('cfMsg').value.trim();
  const fmsg=document.getElementById('formMsg'),btn=document.getElementById('submitBtn');
  if(!name||!email||!msg){fmsg.textContent='>> Please fill all required fields.';return;}
  btn.textContent='TRANSMITTING...';btn.disabled=true;
  setTimeout(()=>{
    store.messages.push({id:Date.now(),name,email,subject,message:msg,time:new Date().toLocaleString()});
    updateAdminStats();btn.textContent='MESSAGE SENT ✓';btn.classList.add('sent');fmsg.textContent=">> Signal received. I'll get back to you soon.";
    ['cfName','cfEmail','cfSubject','cfMsg'].forEach(id=>document.getElementById(id).value='');
    setTimeout(()=>{btn.textContent='SEND MESSAGE →';btn.classList.remove('sent');btn.disabled=false;fmsg.textContent='';},5000);
  },1400);
}

/* ── ADMIN ── */
function switchAdminTab(tab,el){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));el.classList.add('active');document.getElementById('panel-'+tab).classList.add('active');if(tab==='messages')renderAdminMessages();}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
function updateAdminStats(){document.getElementById('statProjects').textContent=store.projects.length;document.getElementById('statSkills').textContent=store.softSkills.length;document.getElementById('statMessages').textContent=store.messages.length;}
function saveBio(){document.getElementById('heroBio').innerHTML=document.getElementById('adminHeroBio').value;document.getElementById('aboutPara1').innerHTML=document.getElementById('adminAbout1').value;document.getElementById('aboutPara2').innerHTML=document.getElementById('adminAbout2').value;document.getElementById('aboutPara3').innerHTML=document.getElementById('adminAbout3').value;showToast('✓ Bio updated successfully');}
function renderAdminProjects(){const list=document.getElementById('adminProjectList');list.innerHTML='';store.projects.forEach(p=>{const row=document.createElement('div');row.className='item-row';row.innerHTML=`<div class="item-row-info"><div class="item-row-name">${p.name}</div><div class="item-row-sub">${p.year} · ${p.tech}</div></div><div class="item-row-actions"><button class="admin-btn admin-btn-danger" onclick="deleteProject(${p.id})">✕ REMOVE</button></div>`;list.appendChild(row);});}
function renderProjectsGrid(){const grid=document.getElementById('projectsGrid');grid.innerHTML='';store.projects.forEach((p,i)=>{const card=document.createElement('div');card.className='project-card reveal visible';card.innerHTML=`<div class="proj-number">0${i+1}</div><div class="proj-year">${p.year}</div><div class="proj-name">${p.name}</div><div class="proj-desc">${p.desc}</div><div class="proj-tech">${p.tech.split(',').map(t=>`<span class="tech-pill">${t.trim()}</span>`).join('')}</div>`;grid.appendChild(card);});initProjectTilt();}
function addProject(){const name=document.getElementById('newProjName').value.trim(),year=document.getElementById('newProjYear').value.trim(),desc=document.getElementById('newProjDesc').value.trim(),tech=document.getElementById('newProjTech').value.trim();if(!name||!desc){showToast('⚠ Name and description are required');return;}store.projects.push({id:store.nextProjectId++,name,year:year||'2025',desc,tech:tech||'N/A'});renderAdminProjects();renderProjectsGrid();updateAdminStats();['newProjName','newProjYear','newProjDesc','newProjTech'].forEach(id=>document.getElementById(id).value='');showToast('✓ Project added!');}
function deleteProject(id){store.projects=store.projects.filter(p=>p.id!==id);renderAdminProjects();renderProjectsGrid();updateAdminStats();showToast('✓ Project removed');}
function renderAdminSoftTags(){const cont=document.getElementById('adminSoftTags');cont.innerHTML='';store.softSkills.forEach((s,i)=>{const tag=document.createElement('span');tag.className='skill-tag';tag.style.cssText='display:flex;align-items:center;gap:8px;';tag.innerHTML=`${s} <span onclick="removeSkill(${i})" style="color:var(--accent3);cursor:none;font-size:0.9rem;">×</span>`;cont.appendChild(tag);});}
function renderSoftTagsPortfolio(){const cont=document.getElementById('softSkillTags');cont.innerHTML='';store.softSkills.forEach(s=>{const tag=document.createElement('span');tag.className='skill-tag';tag.textContent=s;cont.appendChild(tag);});}
function addSkill(){const name=document.getElementById('newSkillName').value.trim();if(!name){showToast('⚠ Skill name required');return;}store.softSkills.push(name);renderAdminSoftTags();renderSoftTagsPortfolio();updateAdminStats();document.getElementById('newSkillName').value='';showToast('✓ Skill added!');}
function removeSkill(idx){store.softSkills.splice(idx,1);renderAdminSoftTags();renderSoftTagsPortfolio();updateAdminStats();showToast('✓ Skill removed');}
function renderAdminMessages(){const cont=document.getElementById('adminMessagesList');if(!store.messages.length){cont.innerHTML='<div class="msg-empty">&gt; No messages yet.</div>';return;}cont.innerHTML='';store.messages.slice().reverse().forEach(m=>{const card=document.createElement('div');card.className='msg-card';card.innerHTML=`<div class="msg-header"><div><div class="msg-from">${m.name}</div><div class="msg-email">${m.email}</div></div><div class="msg-time">${m.time}</div></div><div class="msg-subject">&gt; ${m.subject||'(no subject)'}</div><div class="msg-body">${m.message}</div>`;cont.appendChild(card);});}

/* ── CLICK CREATURES ── */
(function(){
  const pool=[
    {e:'🤖',t:'> beep boop!',  c:'#00f5d4'},
    {e:'🐱',t:'> nya~',        c:'#ff2d78'},
    {e:'👾',t:'> hello human!',c:'#7b2fff'},
    {e:'🦊',t:'> debug mode',  c:'#ff9900'},
    {e:'⚡',t:'> zap!!',       c:'#00f5d4'},
    {e:'🐸',t:'> ribbit.js',   c:'#00ff88'},
    {e:'🌸',t:'> kawaii~',     c:'#ff2d78'},
    {e:'🦋',t:'> flutter.exe', c:'#7b2fff'},
    {e:'🐙',t:'> 8 arms 8 tabs',c:'#00f5d4'},
    {e:'🚀',t:'> liftoff!',    c:'#ff9900'},
    {e:'🐼',t:'> nom nom nom',  c:'#ffffff'},
    {e:'🦄',t:'> magical!',    c:'#ff2d78'},
  ];
  let last=0;
  document.addEventListener('click',function(e){
    if(Date.now()-last<300)return;
    if(e.target.closest('a,button,input,textarea,select,label'))return;
    last=Date.now();
    const p=pool[Math.floor(Math.random()*pool.length)];
    const d=document.createElement('div');
    d.className='cc';
    d.style.cssText='left:'+e.clientX+'px;top:'+e.clientY+'px;';
    d.innerHTML='<div class="cc-face">'+p.e+'</div><div class="cc-text" style="border-color:'+p.c+';color:'+p.c+';">'+p.t+'</div>';
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),2600);
  },true);
})();
