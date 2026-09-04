// game.js — Core game engine with effects, endless replay

const TOTAL_ROUNDS = 20;
const STORAGE_KEY_IMG = 'trans_pool';
const STORAGE_KEY_DAY = 'trans_daily';

// --- Data helpers ---
async function loadStaticPool() {
  if (typeof DEFAULT_POOL === 'undefined' || !Array.isArray(DEFAULT_POOL) || DEFAULT_POOL.length === 0) {
    try {
      const res = await fetch('pool.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          window.DEFAULT_POOL = data;
        }
      }
    } catch (e) {
      // Ignore fetch errors
    }
  }
}

function getPool() {
  let local = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY_IMG));
    if (Array.isArray(parsed)) local = parsed;
  } catch {}

  const defaultPool = (typeof DEFAULT_POOL !== 'undefined' && Array.isArray(DEFAULT_POOL)) ? DEFAULT_POOL : [];

  if (defaultPool.length > local.length) {
    return defaultPool;
  }
  return local.length > 0 ? local : defaultPool;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getDaily() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY_DAY));
    if (d && d.date === getToday()) return d;
  } catch {}
  return null;
}

function saveDaily(state) {
  localStorage.setItem(STORAGE_KEY_DAY, JSON.stringify(state));
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick up to 20 from pool — does NOT remove them from pool
function pickDailyImages(pool) {
  if (pool.length === 0) return [];
  const count = Math.min(TOTAL_ROUNDS, pool.length);
  return shuffleArray(pool).slice(0, count);
}

// --- Effects ---
function fireConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#a855f7', '#ec4899', '#22d3ee', '#ffe033', '#22c55e', '#f97316', '#3b82f6'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? 'circle' : 'square';
    const size = 6 + Math.random() * 10;

    piece.style.cssText = `
      left: 50%; top: 50%;
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '2px'};
      --tx: ${(Math.random() - 0.5) * 600}px;
      --ty: ${(Math.random() - 0.5) * 600 - 100}px;
      --rot: ${Math.random() * 720}deg;
    `;
    piece.classList.add('burst');
    piece.style.animationDelay = (Math.random() * 0.15) + 's';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 2000);
}

function fireSprayPaint(frame) {
  const colors = ['#a855f7', '#22c55e', '#22d3ee', '#ffe033', '#ec4899'];

  for (let i = 0; i < 8; i++) {
    const splash = document.createElement('div');
    splash.className = 'spray-splash';
    const size = 30 + Math.random() * 60;
    splash.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${20 + Math.random() * 60}%;
      top: ${20 + Math.random() * 60}%;
    `;
    splash.classList.add('show');
    splash.style.animationDelay = (Math.random() * 0.2) + 's';
    frame.appendChild(splash);
    setTimeout(() => splash.remove(), 1200);
  }

  const graffiti = document.createElement('div');
  graffiti.className = 'graffiti-text';
  graffiti.textContent = 'NICE!';
  graffiti.style.color = '#22c55e';
  frame.appendChild(graffiti);
  requestAnimationFrame(() => graffiti.classList.add('show'));
  setTimeout(() => graffiti.remove(), 1500);
}

function showWrongX(frame) {
  const x = document.createElement('div');
  x.className = 'wrong-x';
  x.textContent = 'X';
  frame.appendChild(x);
  requestAnimationFrame(() => x.classList.add('show'));
  setTimeout(() => x.remove(), 1200);
}

// --- Game state ---
let state = null;
let selectedVote = null;
let answered = false;

function initState() {
  const pool = getPool();

  if (pool.length === 0) return 0;

  const existing = getDaily();
  const targetCount = Math.min(TOTAL_ROUNDS, pool.length);

  // Keep existing daily progress ONLY if it has valid images AND matches current target pool count AND is not finished
  if (existing && Array.isArray(existing.images) && existing.images.length === targetCount && !existing.finished) {
    state = existing;
    return pool.length;
  }

  // New day, first time, pool size changed, or finished — pick fresh images from pool
  const chosen = pickDailyImages(pool);

  state = {
    date: getToday(),
    images: chosen,
    poolSize: pool.length,
    currentIndex: 0,
    score: 0,
    votes: [],
    finished: false
  };
  saveDaily(state);
  return pool.length;
}

function render() {
  const scoreEl = document.getElementById('score');
  const roundEl = document.getElementById('round-num');
  const maxEl = document.getElementById('max-score');
  const img = document.getElementById('person-img');
  const frame = document.getElementById('image-frame');
  const overlay = document.getElementById('result-overlay');
  const btnTrans = document.getElementById('btn-trans');
  const btnCis = document.getElementById('btn-cis');
  const submitBtn = document.getElementById('submit-btn');
  const endScreen = document.getElementById('end-screen');
  const progressBar = document.getElementById('progress-bar');
  const voteBtns = document.getElementById('vote-buttons');
  const roundLabel = document.querySelector('.round-label');
  const progressWrap = document.querySelector('.progress-bar-wrap');

  maxEl.textContent = state.images.length;
  scoreEl.textContent = state.score;
  roundEl.textContent = Math.min(state.currentIndex + 1, state.images.length);

  const pct = (state.currentIndex / state.images.length) * 100;
  progressBar.style.width = pct + '%';

  if (state.finished || state.currentIndex >= state.images.length) {
    // Show end screen
    frame.style.display = 'none';
    voteBtns.style.display = 'none';
    submitBtn.style.display = 'none';
    roundLabel.style.display = 'none';
    progressWrap.style.display = 'none';
    endScreen.style.display = 'block';
    document.getElementById('final-score').textContent = state.score + ' / ' + state.images.length;
    startCountdown();
    return;
  }

  // Show game elements
  frame.style.display = '';
  voteBtns.style.display = '';
  submitBtn.style.display = '';
  roundLabel.style.display = '';
  progressWrap.style.display = '';
  endScreen.style.display = 'none';

  const current = state.images[state.currentIndex];
  img.src = current.url;
  frame.classList.remove('reveal');
  overlay.className = 'result-overlay';
  overlay.textContent = '';

  // Clean up old effects
  frame.querySelectorAll('.wrong-x, .spray-splash, .graffiti-text').forEach(e => e.remove());

  frame.setAttribute('data-tooltip', 'Gender: ' + (current.gender === 'M' ? 'Male' : 'Female') + ' — Is this person transgender?');

  selectedVote = null;
  answered = false;
  btnTrans.classList.remove('selected');
  btnCis.classList.remove('selected');
  btnTrans.style.opacity = '1';
  btnCis.style.opacity = '1';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Select your Vote';
}

function vote(choice) {
  if (answered) return;
  selectedVote = choice;
  document.getElementById('btn-trans').classList.toggle('selected', choice === 'trans');
  document.getElementById('btn-cis').classList.toggle('selected', choice === 'cis');
  document.getElementById('submit-btn').disabled = false;
}

function submitVote() {
  if (!selectedVote || answered) return;
  answered = true;

  const current = state.images[state.currentIndex];
  const isTrans = current.trans === true;
  const guess = selectedVote === 'trans';
  const correct = guess === isTrans;

  if (correct) state.score++;

  const overlay = document.getElementById('result-overlay');
  const frame = document.getElementById('image-frame');
  const submitBtn = document.getElementById('submit-btn');

  frame.classList.add('reveal');
  overlay.textContent = correct ? 'Correct!' : 'Wrong!';
  overlay.classList.add('show', correct ? 'correct' : 'wrong');

  if (correct) {
    fireConfetti();
    fireSprayPaint(frame);
  } else {
    showWrongX(frame);
  }

  document.getElementById('btn-trans').style.opacity = '0.5';
  document.getElementById('btn-cis').style.opacity = '0.5';

  submitBtn.textContent = state.currentIndex < state.images.length - 1 ? 'Next' : 'See Results';
  submitBtn.disabled = false;

  state.votes.push({
    imageId: current.id,
    vote: selectedVote,
    correct: correct,
    answer: isTrans ? 'trans' : 'cis'
  });

  saveDaily(state);
}

function nextRound() {
  if (!answered) { submitVote(); return; }

  state.currentIndex++;
  if (state.currentIndex >= state.images.length) {
    state.finished = true;
  }
  saveDaily(state);
  render();
}

function restartDay() {
  console.log('restartDay called');
  const pool = getPool();
  const chosen = pickDailyImages(pool);

  state = {
    date: getToday(),
    images: chosen.length > 0 ? chosen : (state ? state.images : []),
    poolSize: pool.length,
    currentIndex: 0,
    score: 0,
    votes: [],
    finished: false
  };
  saveDaily(state);

  document.getElementById('image-frame').style.display = '';
  document.getElementById('vote-buttons').style.display = '';
  document.getElementById('submit-btn').style.display = '';
  document.querySelector('.round-label').style.display = '';
  document.querySelector('.progress-bar-wrap').style.display = '';
  document.getElementById('end-screen').style.display = 'none';

  render();
}

// --- Countdown ---
function startCountdown() {
  const el = document.getElementById('countdown');
  function tick() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = h + 'h ' + m + 'm ' + s + 's';
  }
  tick();
  setInterval(tick, 1000);
}

// --- Share ---
function shareScore() {
  const text = 'Transgender or Not — ' + state.score + '/' + state.images.length;
  if (navigator.share) {
    navigator.share({ text: text });
  } else {
    navigator.clipboard.writeText(text).then(function() { alert('Copied to clipboard!'); });
  }
}

// --- Init ---
window.addEventListener('DOMContentLoaded', async function() {
  await loadStaticPool();
  var poolCount = initState();

  if (poolCount === 0) {
    document.querySelector('.image-frame').innerHTML =
      '<p class="no-images">No images in pool. Go to <a href="admin.html" style="color:#a855f7">Admin Panel</a> to add some.</p>';
    document.getElementById('vote-buttons').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.querySelector('.round-label').style.display = 'none';
    document.querySelector('.progress-bar-wrap').style.display = 'none';
    return;
  }

  render();
});
