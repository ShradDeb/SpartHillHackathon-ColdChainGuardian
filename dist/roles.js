// Presentation-only role switching; this is not account authentication.
(()=>{
const key='coldchain-selected-role';
let role;try{role=localStorage.getItem(key)}catch{}
if(!['user','pharmacist'].includes(role))role=location.hash==='#find'?'user':'pharmacist';
const pharmacistPages=new Set(['dashboard','response','inventory','storage','transfer','activity','frostgate']);
window.applyRoleGate=function(page){
 const content=document.getElementById('app')||(page==='frostgate'?document.querySelector('.app'):null);
 if(!content?.classList)return;
 const required=page==='find'?'user':pharmacistPages.has(page)?'pharmacist':null;
 const blocked=Boolean(required&&required!==role);
 content.classList.toggle('role-blurred',blocked);
 content.inert=blocked;
 if(blocked)content.setAttribute('aria-hidden','true');else content.removeAttribute('aria-hidden');
 let gate=document.getElementById('role-gate');
 if(!gate){gate=document.createElement('div');gate.id='role-gate';gate.className='role-gate frost-role-gate';document.body.appendChild(gate)}
 gate.hidden=!blocked;
 if(blocked){gate.innerHTML=`<div class="role-gate-card" role="status"><span class="eyebrow">${role==='user'?'USER':'PHARMACIST'} MODE</span><h2>${required==='user'?'User page':'Pharmacist workspace'}</h2><p>Switch to ${required==='user'?'User':'Pharmacist'} to view and interact with this page.</p><button class="primary" id="role-unlock">Switch to ${required==='user'?'User':'Pharmacist'}</button></div>`;gate.querySelector('button').onclick=()=>setRole(required,false)}
 document.querySelectorAll('[data-app-role]').forEach(a=>{const active=a.dataset.appRole===role;a.classList.toggle('role-selected',active);a.setAttribute('aria-pressed',String(active))});
};
function setRole(value,navigate){role=value;try{localStorage.setItem(key,role)}catch{}if(navigate){location.hash=role==='user'?'find':'response'}if(typeof render==='function')render();else window.applyRoleGate('frostgate')}
document.querySelectorAll('[data-app-role]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setRole(a.dataset.appRole,true)}));
window.addEventListener('storage',e=>{if(e.key===key&&['user','pharmacist'].includes(e.newValue)){role=e.newValue;if(typeof render==='function')render();else window.applyRoleGate('frostgate')}});
if(location.pathname.endsWith('/frostgate.html'))window.applyRoleGate('frostgate');
})();
