// ============================================================
// Dominion Estates — Private Video Tour page builder
// Same encryption approach as checkin/build.mjs: PBKDF2 + AES-GCM.
// Usage:  node tour/build.mjs newport-one-bedroom
// Reads:  tour/_src/<slug>.json   (plaintext — git-ignored)
// Writes: tour/<slug>/index.html  (encrypted — safe to commit)
// ============================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as crypto } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PBKDF2_ITERATIONS = 310000;

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node tour/build.mjs <slug>   (e.g. newport-one-bedroom)');
  process.exit(1);
}

const data = JSON.parse(readFileSync(join(__dirname, '_src', `${slug}.json`), 'utf8'));

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Content renderer ───────────────────────────────────────
function renderContent(d) {
  const greeting = `<p class="tour-prepared" id="guest-greeting" style="display:none"></p>`;

  const videos = d.videos
    .map(
      (v) => `
      <div class="video-wrapper">
        <div class="video-container" id="player-wrap-${esc(v.id)}">
          <div class="video-poster" id="poster-${esc(v.id)}" data-vid="${esc(v.id)}">
            <img src="https://img.youtube.com/vi/${esc(v.id)}/maxresdefault.jpg"
                 alt="${esc(v.title)}" loading="eager" />
            <button class="play-btn" aria-label="Play video">
              <svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#C5A880"/><path d="M45 24L27 14v20" fill="#0A1931"/></svg>
            </button>
          </div>
          <iframe id="iframe-${esc(v.id)}" style="display:none" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        ${v.title ? `<p class="video-title">${esc(v.title)}</p>` : ''}
      </div>`
    )
    .join('');

  const features = d.features
    .map((f) => `<li><span class="feat-ico">${f.icon}</span><span>${esc(f.text)}</span></li>`)
    .join('');

  const trustItems = d.trust
    .map((t) => `<li><span class="trust-ico">${t.icon}</span><span>${esc(t.text)}</span></li>`)
    .join('');

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const reviews = d.reviews
    .map(
      (r) => `
      <div class="review-card">
        <div class="review-head">
          <div class="review-avatar">${esc(r.name.charAt(0))}</div>
          <div>
            <div class="review-name">${esc(r.name)}</div>
            <div class="review-meta">${esc(r.date)}${r.platform ? ' · ' + esc(r.platform) : ''}</div>
          </div>
          <div class="review-stars">${stars(r.rating)}</div>
        </div>
        <p class="review-text">${esc(r.text)}</p>
      </div>`
    )
    .join('');

  return `
    <header class="tour-hero">
      <div class="tour-hero-inner">
        <div class="brandmark">${esc(d.brand)}</div>
        <span class="tour-eyebrow">🎥 ${esc(d.pageTitle)}</span>
        <h1>${esc(d.tagline)}</h1>
        ${greeting}
      </div>
    </header>

    <div class="tour-wrap">

      <section class="block intro-block">
        <p>${esc(d.intro)}</p>
        <p class="privacy-note">${esc(d.privacyNote)}</p>
      </section>

      <section class="block video-block">
        <span class="block-eyebrow">Video Tour</span>
        <h2>Take a look inside</h2>
        ${videos}
        <p class="disclaimer">${esc(d.disclaimer)}</p>
      </section>

      <section class="block">
        <span class="block-eyebrow">What's Included</span>
        <h2>Property overview</h2>
        <ul class="feat-list">${features}</ul>
      </section>

      <section class="block">
        <span class="block-eyebrow">Guest Reviews</span>
        <h2>What others are saying</h2>
        <div class="reviews-grid">${reviews}</div>
      </section>

      <section class="block trust-block">
        <span class="block-eyebrow">Your Confidence</span>
        <h2>Why guests trust us</h2>
        <ul class="trust-list">${trustItems}</ul>
      </section>

      <section class="block cta-block">
        <h2>Ready to take the next step?</h2>
        <p>We'd love to answer any remaining questions and help you secure your stay.</p>
        <div class="cta-row">
          <a class="cta-btn cta-primary" href="mailto:${esc(d.cta.email)}?subject=Inquiry%20—%20Newport%20Beach%20One-Bedroom">Ask a Question</a>
          <a class="cta-btn cta-secondary" href="${esc(d.cta.websiteUrl)}" target="_blank" rel="noopener">Visit Our Website</a>
        </div>
        ${d.cta.areaGuide ? `<a class="area-guide-link" href="${esc(d.cta.areaGuide)}" target="_blank" rel="noopener">🌴 Explore the Newport Beach area — beaches, dining, and more →</a>` : ''}
      </section>

      <footer class="tour-foot">
        <p class="tour-closing">${esc(d.closing)}</p>
        <p class="tour-sign">— The ${esc(d.brand)}</p>
        <a class="tour-home" href="${esc(d.cta.websiteUrl)}" target="_blank" rel="noopener">dominionestatesrentals.com</a>
      </footer>
    </div>`;
}

// ── Encrypt ────────────────────────────────────────────────
async function encrypt(plaintext, passcode) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passcode), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  const b64 = (buf) => Buffer.from(buf).toString('base64');
  return { salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}

// ── Page shell ─────────────────────────────────────────────
function shell(payload, d) {
  const digits = String(d.passcode).length;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Private Video Tour · ${esc(d.brand)}</title>
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

  /* ── Hero ── */
  .tour-hero{background:radial-gradient(900px 500px at 50% -30%, #163158 0%, var(--navy) 60%, #06101f 100%);color:#fff;padding:64px 24px 72px;text-align:center}
  .tour-hero-inner{max-width:760px;margin:0 auto}
  .brandmark{font-family:var(--serif);font-size:1.25rem;letter-spacing:.5px;color:#fff;opacity:.95}
  .tour-eyebrow{display:inline-block;margin:22px 0 12px;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
  .tour-hero h1{font-family:var(--serif);font-size:2.5rem;line-height:1.15;font-weight:700}
  .tour-prepared{margin-top:16px;font-size:1.05rem;color:var(--gold);font-weight:400}

  /* ── Shared block ── */
  .tour-wrap{max-width:760px;margin:-40px auto 0;padding:0 20px 80px}
  .block{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:32px 28px;margin-top:20px;box-shadow:0 4px 20px rgba(10,25,49,.05)}
  .block-eyebrow{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-dk);font-weight:700}
  .block h2{font-family:var(--serif);font-size:1.7rem;color:var(--navy);margin:6px 0 22px;font-weight:700}
  .block p{color:#3c4552;margin-bottom:12px}
  .block p:last-child{margin-bottom:0}

  /* ── Intro ── */
  .intro-block{position:relative;z-index:2}
  .privacy-note{font-size:.9rem;color:var(--muted);border-left:3px solid var(--gold);padding-left:16px;margin-top:16px}

  /* ── Video ── */
  .video-wrapper{margin-bottom:20px}
  .video-container{position:relative;padding-bottom:56.25%;height:0;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 8px 30px rgba(10,25,49,.15)}
  .video-poster{position:absolute;inset:0;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .video-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .video-poster::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,25,49,.1),rgba(10,25,49,.35))}
  .play-btn{position:relative;z-index:2;border:none;background:none;cursor:pointer;filter:drop-shadow(0 4px 12px rgba(0,0,0,.35));transition:transform .2s}
  .play-btn:hover{transform:scale(1.1)}
  .video-container iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
  .video-title{font-family:var(--serif);font-size:1.05rem;color:var(--navy);text-align:center;margin-top:12px;font-weight:600}
  .disclaimer{font-size:.82rem;color:var(--muted);font-style:italic;margin-top:4px}

  /* ── Features ── */
  .feat-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .feat-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;color:#3c4552}
  .feat-ico{font-size:1.2rem;line-height:1.5;flex-shrink:0}

  /* ── Reviews ── */
  .reviews-grid{display:flex;flex-direction:column;gap:16px}
  .review-card{border:1px solid var(--border);border-radius:14px;padding:22px 24px;background:var(--cream)}
  .review-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap}
  .review-avatar{width:44px;height:44px;border-radius:50%;background:var(--navy);color:var(--gold);font-family:var(--serif);
    font-size:1.2rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .review-name{font-family:var(--serif);font-size:1.05rem;color:var(--navy);font-weight:600}
  .review-meta{font-size:.78rem;color:var(--muted)}
  .review-stars{margin-left:auto;font-size:1.1rem;color:var(--gold-dk);letter-spacing:2px}
  .review-text{font-size:.92rem;color:#3c4552;line-height:1.65}

  /* ── Trust ── */
  .trust-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .trust-list li{display:flex;align-items:flex-start;gap:12px;font-size:.95rem;color:#3c4552}
  .trust-ico{font-size:1.2rem;line-height:1.5;flex-shrink:0}

  /* ── CTA ── */
  .cta-block{text-align:center;background:linear-gradient(180deg,var(--white),#faf7f2);border:1.5px solid var(--gold)}
  .cta-block h2{margin-bottom:10px}
  .cta-block p{color:var(--muted);margin-bottom:24px}
  .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .cta-btn{display:inline-block;padding:15px 30px;border-radius:12px;font-family:var(--sans);font-size:.95rem;font-weight:600;
    text-decoration:none;letter-spacing:.02em;transition:.2s;cursor:pointer;border:none}
  .cta-primary{background:var(--navy);color:#fff}
  .cta-primary:hover{background:#12294c}
  .cta-secondary{background:transparent;color:var(--navy);border:1.5px solid var(--navy)}
  .cta-secondary:hover{background:var(--navy);color:#fff}

  /* ── Area guide link ── */
  .area-guide-link{display:block;margin-top:22px;padding:16px 24px;border:1.5px solid var(--gold);border-radius:12px;
    text-decoration:none;color:var(--navy);font-weight:600;font-size:.95rem;text-align:center;transition:.2s;background:linear-gradient(180deg,#fffdf8,#fbf6ec)}
  .area-guide-link:hover{background:var(--navy);color:#fff;border-color:var(--navy)}

  /* ── Footer ── */
  .tour-foot{text-align:center;padding:44px 20px 8px}
  .tour-closing{font-family:var(--serif);font-size:1.5rem;color:var(--navy)}
  .tour-sign{color:var(--gold-dk);font-weight:600;margin-top:6px}
  .tour-home{display:inline-block;margin-top:14px;font-size:.85rem;color:var(--muted);text-decoration:none}
  .tour-home:hover{color:var(--gold-dk)}

  @media(max-width:620px){
    .tour-hero h1{font-size:2rem}
    .feat-list,.trust-list{grid-template-columns:1fr}
    .block{padding:26px 20px}
    .pin input{width:52px;height:62px}
    .cta-row{flex-direction:column;align-items:center}
    .cta-btn{width:100%;text-align:center}
  }
</style>
</head>
<body>

  <div id="lock">
    <form class="lock-card" id="lock-form" autocomplete="off">
      <div class="lock-brand">${esc(d.brand)}<span>Private Video Tour</span></div>
      <div class="lock-rule"></div>
      <h2 class="lock-h">Welcome</h2>
      <p class="lock-sub">Enter the ${digits}-digit access code to view your private video tour.</p>
      <div class="pin" id="pin">
        ${Array.from({ length: digits }).map(() => `<input type="tel" inputmode="numeric" maxlength="1" pattern="[0-9]" aria-label="code digit" />`).join('')}
      </div>
      <div class="lock-err" id="err">That code doesn't match. Please try again.</div>
      <button class="lock-btn" id="unlock" type="submit">View Video Tour</button>
      <p class="lock-hint">This access code was included in your message from the Dominion Team.</p>
    </form>
  </div>

  <main id="content" aria-live="polite"></main>

<script>
(function(){
  var PAYLOAD = ${JSON.stringify(payload)};
  var ITER = ${PBKDF2_ITERATIONS};

  window.addEventListener('pageshow', function(e){
    if(e.persisted && document.getElementById('content').classList.contains('show')){
      location.reload();
    }
  });

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
    document.title = ${JSON.stringify('Private Video Tour · ' + esc(d.brand))};
    window.scrollTo(0,0);
    wireContent();
  }

  function wireContent(){
    var guestParam = new URLSearchParams(window.location.search).get('guest');
    if(guestParam){
      var el = document.getElementById('guest-greeting');
      if(el){
        var safe = guestParam.replace(/[<>"'&]/g,'');
        el.innerHTML = 'Prepared for <strong>' + safe + '</strong>';
        el.style.display = '';
      }
    }
    document.querySelectorAll('.video-poster').forEach(function(poster){
      poster.addEventListener('click', function(){
        var vid = poster.getAttribute('data-vid');
        var iframe = document.getElementById('iframe-' + vid);
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
        iframe.style.display = 'block';
        poster.style.display = 'none';
      });
    });
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
      btn.disabled = false; btn.textContent = 'View Video Tour';
    }
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); submit(); });
})();
</script>
</body>
</html>`;
}

// ── Build ──────────────────────────────────────────────────
const contentHtml = renderContent(data);
const payload = await encrypt(contentHtml, String(data.passcode));
const outDir = join(__dirname, data.slug);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), shell(payload, data), 'utf8');
console.log(`✓ Built tour/${data.slug}/index.html  (passcode: ${data.passcode}, content encrypted)`);
