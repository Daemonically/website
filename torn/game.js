// game.js — Clean rewrite

const STORAGE_KEY_DAY = 'trans_daily_v2'; // v2 = fresh key, ignores any old broken cache

let state = null;
let selectedVote = null;
let answered = false;

// ── Pool ──────────────────────────────────────────────────────────────────────
function getPool() {
  if (typeof window.DEFAULT_POOL !== 'undefined' &&
      Array.isArray(window.DEFAULT_POOL) &&
      window.DEFAULT_POOL.length > 0) {
    return window.DEFAULT_POOL;
  }
  return [];
}

// ── Shuffle ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── State ─────────────────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

function initState() {
  const pool = getPool();
  if (pool.length === 0) return false;

  // Always pick a fresh set — no localStorage restoration (that caused all the bugs)
  const images = shuffle(pool).slice(0, Math.min(16, pool.length));

  state = {
    date: today(),
    images: images,
    currentIndex: 0,
    score: 0,
    finished: false
  };

  return true;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const img       = document.getElementById('person-img');
  const frame     = document.getElementById('image-frame');
  const overlay   = document.getElementById('result-overlay');
  const btnTrans  = document.getElementById('btn-trans');
  const btnCis    = document.getElementById('btn-cis');
  const submitBtn = document.getElementById('submit-btn');
  const endScreen = document.getElementById('end-screen');
  const scoreEl   = document.getElementById('score');
  const maxEl     = document.getElementById('max-score');
  const roundEl   = document.getElementById('round-num');
  const bar       = document.getElementById('progress-bar');
  const voteBtns  = document.getElementById('vote-buttons');
  const roundLbl  = document.querySelector('.round-label');
  const barWrap   = document.querySelector('.progress-bar-wrap');

  scoreEl.textContent = state.score;
  maxEl.textContent   = state.images.length;
  roundEl.textContent = Math.min(state.currentIndex + 1, state.images.length);
  bar.style.width     = (state.currentIndex / state.images.length * 100) + '%';

  if (state.finished || state.currentIndex >= state.images.length) {
    frame.style.display     = 'none';
    voteBtns.style.display  = 'none';
    submitBtn.style.display = 'none';
    roundLbl.style.display  = 'none';
    barWrap.style.display   = 'none';
    endScreen.style.display = 'block';
    document.getElementById('final-score').textContent =
      state.score + ' / ' + state.images.length;
    startCountdown();
    return;
  }

  frame.style.display     = '';
  voteBtns.style.display  = '';
  submitBtn.style.display = '';
  roundLbl.style.display  = '';
  barWrap.style.display   = '';
  endScreen.style.display = 'none';

  const current = state.images[state.currentIndex];
  img.src = current.url;

  // Clean up previous round's effects
  frame.classList.remove('reveal');
  frame.querySelectorAll('.wrong-x, .spray-splash, .graffiti-text').forEach(e => e.remove());
  overlay.className   = 'result-overlay';
  overlay.textContent = '';

  // Reset vote UI
  selectedVote = null;
  answered     = false;
  btnTrans.classList.remove('selected');
  btnCis.classList.remove('selected');
  btnTrans.style.opacity  = '1';
  btnCis.style.opacity    = '1';
  submitBtn.disabled      = true;
  submitBtn.textContent   = 'Transgender or Not Trans?';
}

// ── Vote ──────────────────────────────────────────────────────────────────────
function vote(choice) {
  if (answered) return;
  selectedVote = choice;
  document.getElementById('btn-trans').classList.toggle('selected', choice === 'trans');
  document.getElementById('btn-cis').classList.toggle('selected', choice === 'cis');
  const btn = document.getElementById('submit-btn');
  btn.disabled = false;
  btn.textContent = 'Submit';
}

function submitVote() {
  if (!selectedVote || answered) return;
  answered = true;

  const current = state.images[state.currentIndex];
  const isTrans = current.trans === true;
  const correct = (selectedVote === 'trans') === isTrans;

  if (correct) state.score++;
  document.getElementById('score').textContent = state.score;

  const overlay   = document.getElementById('result-overlay');
  const frame     = document.getElementById('image-frame');
  const submitBtn = document.getElementById('submit-btn');

  frame.classList.add('reveal');
  overlay.textContent = correct ? 'Correct!' : 'Wrong!';
  overlay.className   = 'result-overlay show ' + (correct ? 'correct' : 'wrong');

  if (correct) {
    fireConfetti();
    fireSprayPaint(frame);
  } else {
    showWrongX(frame);
  }

  document.getElementById('btn-trans').style.opacity = '0.5';
  document.getElementById('btn-cis').style.opacity   = '0.5';

  const isLast = state.currentIndex >= state.images.length - 1;
  submitBtn.textContent = isLast ? 'See Results' : 'Next →';
  submitBtn.disabled = false;
}

function nextRound() {
  state.currentIndex++;
  if (state.currentIndex >= state.images.length) {
    state.finished = true;
  }
  render();
}

// The one button in HTML calls this every time
function handleMainButton() {
  if (!answered) {
    if (selectedVote) submitVote();
  } else {
    nextRound();
  }
}

function restartDay() {
  const pool = getPool();
  if (pool.length === 0) return;
  state = {
    date: today(),
    images: shuffle(pool).slice(0, Math.min(16, pool.length)),
    currentIndex: 0,
    score: 0,
    finished: false
  };
  document.getElementById('end-screen').style.display = 'none';
  render();
}

// ── Effects ───────────────────────────────────────────────────────────────────
function fireConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#a855f7','#ec4899','#22d3ee','#ffe033','#22c55e','#f97316','#3b82f6'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = 6 + Math.random() * 10;
    piece.style.cssText = `
      left:${Math.random()*100}%;top:-10px;
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      --tx:${(Math.random()-0.5)*600}px;
      --ty:${400+Math.random()*400}px;
      --rot:${Math.random()*720}deg;
    `;
    piece.classList.add('burst');
    piece.style.animationDelay = (Math.random()*0.3)+'s';
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 2500);
}

function fireSprayPaint(frame) {
  const colors = ['#a855f7','#22c55e','#22d3ee','#ffe033','#ec4899'];
  for (let i = 0; i < 8; i++) {
    const splash = document.createElement('div');
    splash.className = 'spray-splash';
    const size = 30 + Math.random()*60;
    splash.style.cssText = `
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${20+Math.random()*60}%;top:${20+Math.random()*60}%;
    `;
    splash.classList.add('show');
    frame.appendChild(splash);
    setTimeout(() => splash.remove(), 1200);
  }
  const g = document.createElement('div');
  g.className   = 'graffiti-text';
  g.textContent = 'NICE!';
  g.style.color = '#22c55e';
  frame.appendChild(g);
  requestAnimationFrame(() => g.classList.add('show'));
  setTimeout(() => g.remove(), 1500);
}

function showWrongX(frame) {
  const x = document.createElement('div');
  x.className   = 'wrong-x';
  x.textContent = 'X';
  frame.appendChild(x);
  requestAnimationFrame(() => x.classList.add('show'));
  setTimeout(() => x.remove(), 1200);
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function startCountdown() {
  const el = document.getElementById('countdown');
  function tick() {
    const now      = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    const diff = tomorrow - now;
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = h+'h '+m+'m '+s+'s';
  }
  tick();
  setInterval(tick, 1000);
}

// ── Share ─────────────────────────────────────────────────────────────────────
function shareScore() {
  const text = 'Transgender or Not — '+state.score+'/'+state.images.length;
  if (navigator.share) {
    navigator.share({text});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Copied!'));
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function() {
  const ok = initState();
  if (!ok) {
    document.getElementById('image-frame').innerHTML =
      '<p style="color:#c084fc;text-align:center;padding:20px">No images found.<br>Open <a href="admin.html" style="color:#a855f7">Admin Panel</a> and export pool.js.</p>';
    document.getElementById('vote-buttons').style.display   = 'none';
    document.getElementById('submit-btn').style.display     = 'none';
    document.querySelector('.round-label').style.display    = 'none';
    document.querySelector('.progress-bar-wrap').style.display = 'none';
    return;
  }
  render();
});
