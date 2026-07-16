// ============================================================
// Dominion Estates — Check-In page builder
// Renders a luxurious, passcode-gated check-in page whose content
// is ENCRYPTED with the passcode (PBKDF2 + AES-GCM). The sensitive
// details (codes, WiFi, address) never appear in the page source or
// search-engine cache — the page only decrypts when the correct
// passcode is entered.
//
// Usage:  node checkin/build.mjs newport-1945
// Reads:  checkin/_src/<slug>.json   (plaintext — git-ignored)
// Writes: checkin/<slug>/index.html  (encrypted — safe to commit)
// ============================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as crypto } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PBKDF2_ITERATIONS = 310000;

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node checkin/build.mjs <slug>   (e.g. newport-1945)');
  process.exit(1);
}

const data = JSON.parse(readFileSync(join(__dirname, '_src', `${slug}.json`), 'utf8'));

// ── Small HTML helpers ──────────────────────────────────────
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Body copy in the JSON may contain intentional <strong>/<em>; keep it.
const rich = (s = '') => String(s);

// ── Content renderer (the part that gets encrypted) ─────────
function renderContent(d) {
  const assets = `../assets/${d.slug}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.checkin.geo)}`;

  const codeChip = (value, note) =>
    value
      ? `<button class="code-chip" data-copy="${esc(value)}"><span class="code-chip-val">${esc(value)}</span><span class="code-chip-copy">Tap to copy</span></button>`
      : `<span class="code-chip code-chip-pending">${esc(note)}</span>`;

  const steps = d.steps
    .map((s, i) => {
      const body = s.body.map((p) => `<p>${rich(p)}</p>`).join('');
      const photo = s.photo
        ? `<figure class="step-figure">
             <img src="${assets}/${esc(s.photo)}" alt="${esc(s.caption || s.title)}" decoding="async" />
             ${s.caption ? `<figcaption>${esc(s.caption)}</figcaption>` : ''}
           </figure>`
        : '';
      return `
        <article class="step">
          <div class="step-num">${i + 1}</div>
          <div class="step-body">
            <h3>${esc(s.title)}</h3>
            ${body}
            ${photo}
          </div>
        </article>`;
    })
    .join('');

  const amenities = d.amenities
    .map(
      (a) => `
      <div class="info-card">
        <div class="info-card-head"><span class="info-ico">${a.icon}</span><h4>${esc(a.title)}</h4></div>
        ${a.lines.map((l) => `<p>${rich(l)}</p>`).join('')}
      </div>`
    )
    .join('');

  const rules = d.rules
    .map(
      (r) => `
      <div class="rule">
        <span class="rule-ico">${r.icon}</span>
        <div><strong>${esc(r.title)}</strong><span>${rich(r.text)}</span></div>
      </div>`
    )
    .join('');

  const fees = (d.departure.fees || [])
    .map((f) => `<li><span>${esc(f.item)}</span><span class="fee-amt">${esc(f.amount)}</span></li>`)
    .join('');

  return `
    <header class="ck-hero">
      <div class="ck-hero-inner">
        <div class="brandmark">${esc(d.brand)}</div>
        <span class="ck-eyebrow">📍 ${esc(d.unitTag)}</span>
        <h1>${esc(d.unitTitle)}</h1>
        <p class="ck-lead">${rich(d.welcomeLead)}</p>
      </div>
    </header>

    <div class="ck-wrap">

      <section class="facts">
        <div class="fact">
          <span class="fact-label">Self Check-In</span>
          <span class="fact-value">${esc(d.checkin.window)}</span>
        </div>
        <div class="fact">
          <span class="fact-label">Address</span>
          <span class="fact-value">${esc(d.checkin.address)}</span>
          <a class="fact-link" href="${mapsUrl}" target="_blank" rel="noopener">Open exact location in Google Maps →</a>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Access Codes</span>
        <h2>Your codes</h2>
        <div class="codes-row">
          <div class="code-item">
            <span class="code-label">Community Gate Code</span>
            ${codeChip(d.codes.gate, d.codes.gateNote)}
            <span class="code-hint">Enter on the keypad, then press <strong>#</strong></span>
          </div>
          <div class="code-item">
            <span class="code-label">Apartment Door Code</span>
            ${codeChip(d.codes.door, d.codes.doorNote)}
            <span class="code-hint">Apartment <strong>#${esc(d.unit.unitNumber)}</strong> · Spot <strong>${esc(d.unit.parkingSpot)}</strong></span>
          </div>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Step by Step</span>
        <h2>Getting inside</h2>
        <div class="steps">${steps}</div>
      </section>

      <section class="block wifi-block">
        <span class="block-eyebrow">Stay Connected</span>
        <h2>Wi-Fi</h2>
        <div class="wifi-card">
          <div class="wifi-row">
            <span class="wifi-label">Network</span>
            <button class="code-chip" data-copy="${esc(d.wifi.name)}"><span class="code-chip-val">${esc(d.wifi.name)}</span><span class="code-chip-copy">Tap to copy</span></button>
          </div>
          <div class="wifi-row">
            <span class="wifi-label">Password</span>
            <button class="code-chip" data-copy="${esc(d.wifi.pass)}"><span class="code-chip-val">${esc(d.wifi.pass)}</span><span class="code-chip-copy">Tap to copy</span></button>
          </div>
        </div>
      </section>

      <section class="block">
        <span class="block-eyebrow">The Community</span>
        <h2>Amenities</h2>
        <div class="info-grid">${amenities}</div>
      </section>

      <section class="block">
        <span class="block-eyebrow">Good Neighbours</span>
        <h2>House rules</h2>
        <div class="rules-grid">${rules}</div>
      </section>

      <section class="block depart-block">
        <span class="block-eyebrow">Before You Go</span>
        <h2>Checking out</h2>
        ${d.departure.lines.map((l) => `<p>${rich(l)}</p>`).join('')}
        ${fees ? `<ul class="fee-list">${fees}</ul>` : ''}
        ${d.departure.note ? `<p class="depart-note">${esc(d.departure.note)}</p>` : ''}
      </section>

      <footer class="ck-foot">
        <p class="ck-closing">${esc(d.closing)}</p>
        <p class="ck-sign">— The ${esc(d.brand)} Team</p>
      </footer>
    </div>`;
}

// ── Encrypt the content with the passcode ───────────────────
async function encrypt(plaintext, passcode) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  const b64 = (buf) => Buffer.from(buf).toString('base64');
  return { salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}

// ── Page shell (unlock UI + decryptor) ──────────────────────
function shell(payload, d) {
  const digits = String(d.passcode).length;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Private Check-In · ${esc(d.brand)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500..800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#0A1931; --gold:#C5A880; --gold-dk:#B8975F;
    --beige:#F8F5F0; --cream:#FDFBF7; --white:#fff; --ink:#1A1D20; --muted:#64748B;
    --border:#e7e1d6; --shadow:0 10px 40px rgba(10,25,49,.10);
    --serif:'Playfair Display',Georgia,serif; --sans:'Plus Jakarta Sans',system-ui,sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--sans);color:var(--ink);background:var(--beige);-webkit-font-smoothing:antialiased;line-height:1.6}
  img{max-width:100%;display:block}

  /* ── Lock screen ── */
  #lock{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px;
    background:radial-gradient(1200px 600px at 50% -10%, #14294a 0%, var(--navy) 55%, #06101f 100%)}
  .lock-card{width:100%;max-width:420px;background:var(--cream);border-radius:18px;box-shadow:var(--shadow);
    padding:44px 34px;text-align:center;border:1px solid rgba(197,168,128,.35)}
  .lock-brand{font-family:var(--serif);font-size:1.5rem;color:var(--navy);letter-spacing:.5px}
  .lock-brand span{display:block;font-family:var(--sans);font-size:.62rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-dk);margin-top:6px;font-weight:600}
  .lock-rule{width:54px;height:2px;background:var(--gold);margin:22px auto}
  .lock-h{font-family:var(--serif);font-size:1.45rem;color:var(--ink);margin-bottom:6px}
  .lock-sub{font-size:.9rem;color:var(--muted);margin-bottom:26px}
  .pin{display:flex;gap:10px;justify-content:center;margin-bottom:8px}
  .pin input{width:56px;height:66px;text-align:center;font-size:1.7rem;font-weight:600;font-family:var(--serif);
    color:var(--navy);background:var(--white);border:1.5px solid var(--border);border-radius:12px;outline:none;transition:.15s}
  .pin input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(197,168,128,.2)}
  .lock-err{min-height:20px;color:#b4232a;font-size:.85rem;margin:10px 0 4px;opacity:0;transition:.2s}
  .lock-err.show{opacity:1}
  .lock-btn{width:100%;margin-top:14px;padding:15px;border:none;border-radius:12px;background:var(--navy);color:#fff;
    font-family:var(--sans);font-size:.95rem;font-weight:600;letter-spacing:.02em;cursor:pointer;transition:.2s}
  .lock-btn:hover{background:#12294c}
  .lock-btn:disabled{opacity:.6;cursor:default}
  .lock-hint{margin-top:18px;font-size:.78rem;color:var(--muted)}

  /* ── Content ── */
  #content{display:none}
  #content.show{display:block;animation:fade .5s ease}
  @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

  .ck-hero{background:radial-gradient(900px 500px at 50% -30%, #163158 0%, var(--navy) 60%, #06101f 100%);color:#fff;padding:64px 24px 72px;text-align:center}
  .ck-hero-inner{max-width:760px;margin:0 auto}
  .brandmark{font-family:var(--serif);font-size:1.25rem;letter-spacing:.5px;color:#fff;opacity:.95}
  .ck-eyebrow{display:inline-block;margin:22px 0 12px;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
  .ck-hero h1{font-family:var(--serif);font-size:2.5rem;line-height:1.15;font-weight:700}
  .ck-lead{margin:20px auto 0;max-width:600px;color:#cdd6e4;font-size:1.02rem;font-weight:300}

  .ck-wrap{max-width:760px;margin:-40px auto 0;padding:0 20px 80px}
  .facts{display:grid;grid-template-columns:1fr 1.4fr;gap:16px;background:var(--white);border:1px solid var(--border);
    border-radius:16px;padding:24px;box-shadow:var(--shadow)}
  .fact-label{display:block;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-dk);font-weight:600;margin-bottom:6px}
  .fact-value{display:block;font-family:var(--serif);font-size:1.12rem;color:var(--navy);line-height:1.35}
  .fact-link{display:inline-block;margin-top:8px;font-size:.85rem;color:var(--gold-dk);text-decoration:none;font-weight:600}
  .fact-link:hover{text-decoration:underline}

  .block{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:32px 28px;margin-top:20px;box-shadow:0 4px 20px rgba(10,25,49,.05)}
  .block-eyebrow{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-dk);font-weight:700}
  .block h2{font-family:var(--serif);font-size:1.7rem;color:var(--navy);margin:6px 0 22px;font-weight:700}
  .block p{color:#3c4552;margin-bottom:12px}
  .block p:last-child{margin-bottom:0}

  /* codes */
  .codes-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .code-item{display:flex;flex-direction:column;gap:10px}
  .code-label{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600}
  .code-hint{font-size:.82rem;color:var(--muted)}
  .code-chip{appearance:none;text-align:left;cursor:pointer;border:1.5px dashed var(--gold);background:linear-gradient(180deg,#fffdf8,#fbf6ec);
    border-radius:12px;padding:14px 16px;transition:.18s;font-family:inherit}
  .code-chip:hover{border-style:solid;transform:translateY(-1px)}
  .code-chip-val{display:block;font-family:var(--serif);font-size:1.7rem;font-weight:700;letter-spacing:.14em;color:var(--navy)}
  .code-chip-copy{display:block;font-size:.72rem;color:var(--gold-dk);font-weight:600;margin-top:2px}
  .code-chip.copied .code-chip-copy::after{content:' ✓ copied'}
  .code-chip-pending{border-style:solid;border-color:var(--border);background:var(--beige);cursor:default}
  span.code-chip-pending{display:block;font-size:.92rem;color:var(--muted);font-family:var(--sans);font-weight:500;letter-spacing:normal}

  /* steps */
  .steps{display:flex;flex-direction:column;gap:26px}
  .step{display:grid;grid-template-columns:44px 1fr;gap:18px}
  .step-num{width:44px;height:44px;border-radius:50%;background:var(--navy);color:var(--gold);font-family:var(--serif);
    font-size:1.25rem;font-weight:700;display:flex;align-items:center;justify-content:center}
  .step-body h3{font-family:var(--serif);font-size:1.28rem;color:var(--navy);margin-bottom:8px}
  .step-figure{margin-top:14px;border-radius:12px;overflow:hidden;border:1px solid var(--border);cursor:zoom-in}
  .step-figure img{width:100%;height:auto}
  .step-figure figcaption{font-size:.8rem;color:var(--muted);padding:10px 14px;background:var(--beige)}

  /* wifi */
  .wifi-card{display:flex;flex-direction:column;gap:16px}
  .wifi-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .wifi-label{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600}
  .wifi-row .code-chip{flex:1;max-width:320px}
  .wifi-row .code-chip-val{font-size:1.15rem;letter-spacing:.06em}

  /* info grid + rules */
  .info-grid{display:grid;grid-template-columns:1fr;gap:16px}
  .info-card{border:1px solid var(--border);border-radius:12px;padding:18px 20px;background:var(--cream)}
  .info-card-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .info-ico{font-size:1.3rem}
  .info-card h4{font-family:var(--serif);font-size:1.15rem;color:var(--navy)}
  .info-card p{font-size:.92rem}
  .rules-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .rule{display:flex;gap:12px;align-items:flex-start}
  .rule-ico{font-size:1.25rem;line-height:1.4}
  .rule strong{display:block;font-size:.95rem;color:var(--navy)}
  .rule span{font-size:.86rem;color:var(--muted)}

  /* departure */
  .fee-list{list-style:none;margin:16px 0 0;border-top:1px solid var(--border)}
  .fee-list li{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);font-size:.92rem}
  .fee-amt{font-weight:700;color:var(--navy)}
  .depart-note{margin-top:16px;font-size:.85rem;color:var(--muted);font-style:italic}

  .ck-foot{text-align:center;padding:44px 20px 8px}
  .ck-closing{font-family:var(--serif);font-size:1.5rem;color:var(--navy)}
  .ck-sign{color:var(--gold-dk);font-weight:600;margin-top:6px}

  /* lightbox */
  #lightbox{position:fixed;inset:0;z-index:200;background:rgba(6,16,31,.92);display:none;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
  #lightbox.show{display:flex}
  #lightbox img{max-width:100%;max-height:92vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5)}

  @media(max-width:620px){
    .ck-hero h1{font-size:2rem}
    .facts,.codes-row,.rules-grid{grid-template-columns:1fr}
    .block{padding:26px 20px}
    .pin input{width:52px;height:62px}
  }
</style>
</head>
<body>

  <div id="lock">
    <form class="lock-card" id="lock-form" autocomplete="off">
      <div class="lock-brand">${esc(d.brand)}<span>Private Check-In</span></div>
      <div class="lock-rule"></div>
      <h2 class="lock-h">Welcome</h2>
      <p class="lock-sub">Enter the ${digits}-digit access code from your booking message to view your check-in guide.</p>
      <div class="pin" id="pin">
        ${Array.from({ length: digits }).map(() => `<input type="tel" inputmode="numeric" maxlength="1" pattern="[0-9]" aria-label="code digit" />`).join('')}
      </div>
      <div class="lock-err" id="err">That code doesn't match. Please try again.</div>
      <button class="lock-btn" id="unlock" type="submit">Unlock my guide</button>
      <p class="lock-hint">Trouble getting in? Message your host and we'll help right away.</p>
    </form>
  </div>

  <main id="content" aria-live="polite"></main>
  <div id="lightbox"><img alt="" /></div>

<script>
(function(){
  var PAYLOAD = ${JSON.stringify(payload)};
  var ITER = ${PBKDF2_ITERATIONS};
  var pin = document.getElementById('pin');
  var inputs = Array.prototype.slice.call(pin.querySelectorAll('input'));
  var err = document.getElementById('err');
  var btn = document.getElementById('unlock');
  var form = document.getElementById('lock-form');

  inputs[0].focus();
  inputs.forEach(function(inp, i){
    inp.addEventListener('input', function(){
      inp.value = inp.value.replace(/[^0-9]/g,'').slice(0,1);
      if(inp.value && i < inputs.length-1) inputs[i+1].focus();
      err.classList.remove('show');
    });
    inp.addEventListener('keydown', function(e){
      if(e.key==='Backspace' && !inp.value && i>0) inputs[i-1].focus();
    });
    inp.addEventListener('paste', function(e){
      e.preventDefault();
      var t=(e.clipboardData||window.clipboardData).getData('text').replace(/[^0-9]/g,'');
      inputs.forEach(function(x,j){ x.value = t[j]||''; });
      (inputs[Math.min(t.length,inputs.length-1)]||inputs[0]).focus();
    });
  });

  function b64ToBytes(b64){ var s=atob(b64); var a=new Uint8Array(s.length); for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i); return a; }

  async function tryUnlock(code){
    var enc = new TextEncoder();
    var km = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      { name:'PBKDF2', salt:b64ToBytes(PAYLOAD.salt), iterations:ITER, hash:'SHA-256' },
      km, { name:'AES-GCM', length:256 }, false, ['decrypt']);
    var pt = await crypto.subtle.decrypt({ name:'AES-GCM', iv:b64ToBytes(PAYLOAD.iv) }, key, b64ToBytes(PAYLOAD.ct));
    return new TextDecoder().decode(pt);
  }

  function reveal(html){
    var c = document.getElementById('content');
    c.innerHTML = html;
    document.getElementById('lock').style.display='none';
    c.classList.add('show');
    document.title = ${JSON.stringify('Check-In Guide · ' + esc(d.brand))};
    window.scrollTo(0,0);
    wireContent();
  }

  function wireContent(){
    // copy-to-clipboard chips
    document.querySelectorAll('.code-chip[data-copy]').forEach(function(el){
      el.addEventListener('click', function(){
        var v = el.getAttribute('data-copy');
        navigator.clipboard && navigator.clipboard.writeText(v);
        el.classList.add('copied');
        setTimeout(function(){ el.classList.remove('copied'); }, 1600);
      });
    });
    // image lightbox
    var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
    document.querySelectorAll('.step-figure').forEach(function(fig){
      fig.addEventListener('click', function(){
        var img = fig.querySelector('img'); if(!img) return;
        lbImg.src = img.src; lb.classList.add('show');
      });
    });
    lb.addEventListener('click', function(){ lb.classList.remove('show'); lbImg.src=''; });
  }

  async function submit(){
    var code = inputs.map(function(i){return i.value;}).join('');
    if(code.length < inputs.length){ err.textContent="Please enter all "+inputs.length+" digits."; err.classList.add('show'); return; }
    btn.disabled = true; btn.textContent = 'Unlocking…';
    try {
      var html = await tryUnlock(code);
      reveal(html);
    } catch(e){
      err.textContent = "That code doesn't match. Please try again.";
      err.classList.add('show');
      inputs.forEach(function(i){ i.value=''; }); inputs[0].focus();
      btn.disabled = false; btn.textContent = 'Unlock my guide';
    }
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); submit(); });
})();
</script>
</body>
</html>`;
}

// ── Build ───────────────────────────────────────────────────
const contentHtml = renderContent(data);
const payload = await encrypt(contentHtml, String(data.passcode));
const outDir = join(__dirname, data.slug);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), shell(payload, data), 'utf8');
console.log(`✓ Built checkin/${data.slug}/index.html  (passcode: ${data.passcode}, content encrypted)`);
