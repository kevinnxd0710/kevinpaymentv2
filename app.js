import {payments,qris} from "./data/payments.js";

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const typeName=t=>t==="bank"?"BANK":"E-WALLET";
const state={filter:"all",search:""};

function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function maskNumber(n){if(!n)return "Tidak tersedia"; if(n.length<=4)return "••••"; return "•••• •••• "+n.slice(-4)}
function card(p){
  const available=p.status==="available";
  return `<article class="payment-card ${available?"":"unavailable"}">
    <div class="payment-top"><img class="pay-icon" src="${p.logo}" alt="${escapeHtml(p.name)}"><span class="type-pill">${typeName(p.type)}</span></div>
    ${p.favorite?'<span class="favorite">★</span>':""}
    <h3>${escapeHtml(p.name)}</h3><div class="owner">${escapeHtml(p.owner)}</div>
    <div class="number">${available?maskNumber(p.number):"Tidak tersedia"}</div>
    <div class="status-row"><span class="status ${available?"available":"unavailable"}">${available?"● Tersedia":"● Tidak tersedia"}</span>
    ${available?`<button class="copy-btn" data-copy="${escapeHtml(p.number)}">Copy</button>`:""}</div>
  </article>`
}
function qrisCard(q){
  return `<article class="qris-card">
    <div class="qris-image-wrap"><img src="${q.image}" alt="${escapeHtml(q.name)} QRIS"></div>
    <div class="qris-info"><span class="eyebrow">${q.label}</span><h3>${escapeHtml(q.name)}</h3><p>NMID ${q.nmid} · Kode ${q.kode}</p>
      <div class="qris-actions"><button class="primary-btn open-qr" data-id="${q.id}">Buka QRIS</button><button class="secondary-btn open-qr" data-id="${q.id}">Layar penuh</button></div>
    </div>
  </article>`
}
function render(){
  const available=payments.filter(p=>p.status==="available").length;
  $("#statTotal").textContent=payments.length; $("#statAvailable").textContent=available; $("#statUnavailable").textContent=payments.length-available;
  const fav=payments.filter(p=>p.favorite&&p.status==="available"); const quick=(fav.length?fav:payments.filter(p=>p.status==="available")).slice(0,4);
  $("#quickGrid").innerHTML=quick.length?quick.map(card).join(""):'<div class="payment-card"><h3>Belum ada payment aktif</h3><div class="owner">Edit status di data/payments.js</div></div>';
  $("#qrisPreview").innerHTML=qris.map(qrisCard).join("");
  const filtered=payments.filter(p=>(state.filter==="all"||p.type===state.filter)&&(`${p.name} ${p.type} ${p.owner}`.toLowerCase().includes(state.search)));
  $("#paymentGrid").innerHTML=filtered.map(card).join("");
  $("#qrisGrid").innerHTML=qris.map(qrisCard).join("");
  $("#directory").innerHTML=payments.map(p=>`<div class="dir-row"><img class="dir-icon" src="${p.logo}" alt=""><div class="dir-name"><strong>${escapeHtml(p.name)}</strong><small>${typeName(p.type)}</small></div><div class="dir-status ${p.status==="available"?"available":"unavailable"}">${p.status==="available"?"Tersedia":"Tidak tersedia"}</div><div class="dir-copy">${p.status==="available"?`<button class="copy-btn" data-copy="${escapeHtml(p.number)}">Copy</button>`:"—"}</div></div>`).join("");
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
function openQR(id){
  const q=qris.find(x=>x.id===id); if(!q)return;
  $("#modalQrName").textContent=q.name; $("#modalQrImage").src=q.image;
  $("#modalQrMeta").textContent=`${q.label} · NMID ${q.nmid} · Kode ${q.kode}`;
  $("#downloadQr").dataset.file=q.image; $("#downloadQr").dataset.name=q.name.replace(/\s+/g,"-").toLowerCase();
  $("#shareQr").dataset.share=q.id; $("#qrModal").classList.remove("hidden");
}
function go(page){
  $$(".page").forEach(x=>x.classList.add("hidden")); $(`#page-${page}`).classList.remove("hidden");
  $$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  $("#pageSubtitle").textContent={home:"Your payment hub",payments:"Bank & e-wallet directory",qris:"Two QRIS payment profiles",all:"Complete payment directory"}[page];
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-page]"); if(nav)go(nav.dataset.page);
  const copy=e.target.closest("[data-copy]"); if(copy){navigator.clipboard?.writeText(copy.dataset.copy);toast("Nomor payment berhasil disalin");}
  const qr=e.target.closest(".open-qr"); if(qr)openQR(qr.dataset.id);
  if(e.target.matches("[data-close]"))$("#qrModal").classList.add("hidden");
});
$("#searchInput").addEventListener("input",e=>{state.search=e.target.value.toLowerCase();render()});
$("#filters").addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;state.filter=b.dataset.filter;$$(".filter").forEach(x=>x.classList.toggle("active",x===b));render()});
$("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("vintav-theme",document.body.classList.contains("light")?"light":"dark")});
$("#mobileMenu").addEventListener("click",()=>$(".sidebar").classList.toggle("open"));
$("#downloadQr").addEventListener("click",()=>{const a=document.createElement("a");a.href=$("#downloadQr").dataset.file;a.download=`${$("#downloadQr").dataset.name}-qris`;a.click()});
$("#shareQr").addEventListener("click",async()=>{const q=qris.find(x=>x.id===$("#shareQr").dataset.share);try{if(navigator.share){await navigator.share({title:`QRIS ${q.name}`,text:`QRIS ${q.name}`})}else{await navigator.clipboard.writeText(location.href+"#"+q.id);toast("Link QRIS disalin")}}catch{}});
if(localStorage.getItem("vintav-theme")==="light")document.body.classList.add("light");
render();
