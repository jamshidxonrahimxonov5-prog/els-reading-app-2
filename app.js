const UNITS = [
  ...(typeof UNIT1 !== 'undefined' ? [UNIT1] : []),
  ...(typeof UNIT2 !== 'undefined' ? [UNIT2] : []),
  ...(typeof UNIT3 !== 'undefined' ? [UNIT3] : []),
  ...(typeof UNIT4 !== 'undefined' ? [UNIT4] : []),
  ...(typeof UNIT5 !== 'undefined' ? [UNIT5] : []),
  ...(typeof UNIT6 !== 'undefined' ? [UNIT6] : []),
  ...(typeof UNIT7 !== 'undefined' ? [UNIT7] : []),
  ...(typeof UNIT8 !== 'undefined' ? [UNIT8] : []),
  ...(typeof UNIT9 !== 'undefined' ? [UNIT9] : []),
  ...(typeof UNIT10 !== 'undefined' ? [UNIT10] : []),
  ...(typeof UNIT11 !== 'undefined' ? [UNIT11] : []),
  ...(typeof UNIT12 !== 'undefined' ? [UNIT12] : []),
  ...(typeof UNIT13 !== 'undefined' ? [UNIT13] : []),
  ...(typeof UNIT14 !== 'undefined' ? [UNIT14] : []),
  ...(typeof UNIT15 !== 'undefined' ? [UNIT15] : []),
  ...(typeof UNIT16 !== 'undefined' ? [UNIT16] : []),
  ...(typeof UNIT17 !== 'undefined' ? [UNIT17] : []),
  ...(typeof UNIT18 !== 'undefined' ? [UNIT18] : []),
  ...(typeof UNIT19 !== 'undefined' ? [UNIT19] : []),
  ...(typeof UNIT20 !== 'undefined' ? [UNIT20] : []),
  ...(typeof UNIT21 !== 'undefined' ? [UNIT21] : []),
  ...(typeof UNIT22 !== 'undefined' ? [UNIT22] : []),
  ...(typeof UNIT23 !== 'undefined' ? [UNIT23] : []),
  ...(typeof UNIT24 !== 'undefined' ? [UNIT24] : []),
  ...(typeof UNIT25 !== 'undefined' ? [UNIT25] : []),
  ...(typeof UNIT26 !== 'undefined' ? [UNIT26] : []),
  ...(typeof UNIT27 !== 'undefined' ? [UNIT27] : []),
  ...(typeof UNIT28 !== 'undefined' ? [UNIT28] : []),
  ...(typeof UNIT29 !== 'undefined' ? [UNIT29] : []),
  ...(typeof UNIT30 !== 'undefined' ? [UNIT30] : [])
];


const STORAGE_KEY = 'els_progress_v1';
function loadProgress() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; } }
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
let progress = loadProgress(); 
let currentView = 'menu';

function normalize(s) { return s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,;:!?'"]/g, ''); }
function isUnitCompleted(unitId) { const p = progress[unitId]; return p && p.ex1 && p.ex2 && p.ex3; }
function isUnitUnlocked(unitId) { const idx = UNITS.findIndex(u => u.id === unitId); if (idx === 0) return true; return isUnitCompleted(UNITS[idx - 1].id); }
function completedCount() { return UNITS.filter(u => isUnitCompleted(u.id)).length; }

function renderMenu() {
  const app = document.getElementById('app');
  const done = completedCount();
  const total = UNITS.length;
  const levels = {};
  UNITS.forEach(u => { if (!levels[u.level]) levels[u.level] = []; levels[u.level].push(u); });

  let html = `<div class="welcome"><h1>📚 ELS English Through Reading</h1><p>200 ta reading passage, interaktiv mashqlar bilan</p><div class="topbar" style="justify-content:center;"><span class="progress">${done} / ${total} unit tugatilgan</span></div></div><div class="unit-list">`;

  Object.keys(levels).forEach(levelName => {
    html += `<h3>${levelName}</h3>`;
    levels[levelName].forEach(u => {
      const completed = isUnitCompleted(u.id);
      const unlocked = isUnitUnlocked(u.id);
      const cls = completed ? 'completed' : (unlocked ? '' : 'locked');
      const status = completed ? '✓ Tugatilgan' : (unlocked ? '▶ Boshlash' : '🔒 Yopiq');
      html += `<div class="unit-item ${cls}" onclick="${unlocked ? `openUnit(${u.id})` : ''}"><span class="unit-num">Unit ${u.id}</span><span class="unit-title">${u.title}</span><span class="unit-status">${status}</span></div>`;
    });
  });
  html += `</div>`;
  app.innerHTML = html;
  currentView = 'menu';
}

function openUnit(unitId) {
  const unit = UNITS.find(u => u.id === unitId);
  if (!unit) return;
  if (!isUnitUnlocked(unitId)) { alert("Bu unit hali yopiq. Oldingi unitni to'liq tugatishingiz kerak."); return; }
  currentView = unitId;
  const app = document.getElementById('app');
  const done = completedCount();
  const total = UNITS.length;

  let html = `<div class="topbar"><button class="prev-btn" style="padding:8px 16px;border:none;border-radius:5px;cursor:pointer;font-weight:600;font-family:'Segoe UI',Arial,sans-serif;font-size:0.9em;" onclick="renderMenu()">← Mundarija</button><span class="level">${unit.level}</span><span class="progress">${done}/${total}</span></div><h1>Unit ${unit.id} — ${unit.title}</h1><div class="passage">${unit.passage}</div>`;

  html += `<div class="exercise"><div class="ex-title">Exercise 1 — Fill in the gaps</div><div id="ex1-items"></div><button class="submit-btn" onclick="checkEx(1)">✓ Tekshirish</button><div class="result" id="ex1-result"></div></div>`;
  html += `<div class="exercise"><div class="ex-title">Exercise 2 — Choose the correct answer</div><div id="ex2-items"></div><button class="submit-btn" onclick="checkEx(2)">✓ Tekshirish</button><div class="result" id="ex2-result"></div></div>`;
  html += `<div class="exercise"><div class="ex-title">Exercise 3 — Complete the sentences</div><div id="ex3-items"></div><button class="submit-btn" onclick="checkEx(3)">✓ Tekshirish</button><div class="result" id="ex3-result"></div></div>`;
  
  html += `<div class="nav-buttons"><button class="nav-btn prev-btn" onclick="renderMenu()">← Mundarija</button><button class="nav-btn next-btn" id="nextBtn" disabled onclick="openUnit(${unitId + 1})">Keyingi unit →<small id="nextHint"></small></button></div>`;
  app.innerHTML = html;

  renderEx1(unit); renderEx2(unit); renderEx3(unit);
  const p = progress[unitId];
  if (p) { state.ex1 = !!p.ex1; state.ex2 = !!p.ex2; state.ex3 = !!p.ex3; } else { state.ex1 = state.ex2 = state.ex3 = false; }
  updateNextButton();
  window.scrollTo(0, 0);
}

const state = { ex1: false, ex2: false, ex3: false };
function getCurrentUnit() { return UNITS.find(u => u.id === currentView); }
function updateNextButton() {
  const btn = document.getElementById('nextBtn'); if (!btn) return;
  const hint = document.getElementById('nextHint'); const unit = getCurrentUnit(); if (!unit) return;
  if (state.ex1 && state.ex2 && state.ex3) {
    const nextUnit = UNITS.find(u => u.id === unit.id + 1);
    if (nextUnit) { btn.disabled = false; hint.textContent = "✅ Barcha mashqlar bajarildi!"; } 
    else { btn.disabled = true; hint.textContent = "🎉 Bu oxirgi unit!"; }
  } else {
    const done = [state.ex1, state.ex2, state.ex3].filter(Boolean).length;
    btn.disabled = true; hint.textContent = `${done}/3 ta exercise bajarildi`;
  }
}
function saveUnitProgress() { if (typeof currentView === 'number') { progress[currentView] = { ex1: state.ex1, ex2: state.ex2, ex3: state.ex3 }; saveProgress(progress); } }

function renderEx1(unit) { const container = document.getElementById('ex1-items'); container.innerHTML = ''; unit.ex1.forEach((item, i) => { const div = document.createElement('div'); div.className = 'item gap-text'; div.innerHTML = `<span class="gap-label">${String.fromCharCode(97 + i)})</span> ${item.q} &nbsp;&rarr;&nbsp; <input type="text" class="gap-input" id="ex1-${i}" autocomplete="off" spellcheck="false" placeholder="..."><span class="gap-feedback" id="ex1-fb-${i}" style="display:none;"></span><span class="gap-answer" id="ex1-ans-${i}" style="display:none;"></span>`; container.appendChild(div); }); }
function renderEx2(unit) { const container = document.getElementById('ex2-items'); container.innerHTML = ''; unit.ex2.forEach((item, i) => { const wrap = document.createElement('div'); wrap.className = 'item'; let html = `<div class="mcq-num">${item.q}</div>`; item.opts.forEach((opt, j) => { const letter = String.fromCharCode(65 + j); html += `<label class="mcq-option" id="ex2-opt-${i}-${j}"><input type="radio" name="ex2-q${i}" value="${j}"><strong>${letter})</strong> ${opt}</label>`; }); wrap.innerHTML = html; container.appendChild(wrap); }); }
function renderEx3(unit) { const container = document.getElementById('ex3-items'); container.innerHTML = ''; unit.ex3.forEach((item, i) => { const div = document.createElement('div'); div.className = 'item gap-text'; div.innerHTML = `${item.before} <input type="text" class="gap-input" id="ex3-${i}" autocomplete="off" spellcheck="false" placeholder="..."> ${item.after}<span class="gap-feedback" id="ex3-fb-${i}" style="display:none;"></span><span class="gap-answer" id="ex3-ans-${i}" style="display:none;"></span>`; container.appendChild(div); }); }

function checkEx(exNum) {
  const unit = getCurrentUnit(); if (!unit) return;
  const items = unit['ex' + exNum]; let correct = 0;
  if (exNum === 2) {
    items.forEach((item, i) => {
      const selected = document.querySelector(`input[name="ex2-q${i}"]:checked`);
      const selVal = selected ? parseInt(selected.value) : -1;
      item.opts.forEach((_, j) => {
        const optLabel = document.getElementById(`ex2-opt-${i}-${j}`);
        optLabel.classList.remove('correct', 'wrong');
        if (j === item.correct) optLabel.classList.add('correct');
        if (j === selVal && selVal !== item.correct) optLabel.classList.add('wrong');
      });
      if (selVal === item.correct) correct++;
    });
  } else {
    items.forEach((item, i) => {
      const input = document.getElementById(`ex${exNum}-${i}`);
      const fb = document.getElementById(`ex${exNum}-fb-${i}`);
      const ans = document.getElementById(`ex${exNum}-ans-${i}`);
      if (normalize(input.value) === normalize(item.a)) {
        correct++; input.className = 'gap-input correct'; fb.textContent = '✓'; fb.className = 'gap-feedback ok'; fb.style.display = 'inline'; ans.style.display = 'none';
      } else {
        input.className = 'gap-input wrong'; fb.textContent = '✗'; fb.className = 'gap-feedback no'; fb.style.display = 'inline'; ans.textContent = '→ ' + item.a; ans.style.display = 'inline';
      }
    });
  }
  const total = items.length; const pass = correct === total; const res = document.getElementById(`ex${exNum}-result`);
  res.className = 'result show ' + (pass ? 'pass' : 'fail'); res.textContent = `${correct}/${total} to'g'ri` + (pass ? ' — Barakalla! ✅' : ' — Qaytadan urinib ko\'ring');
  state['ex' + exNum] = pass; saveUnitProgress(); updateNextButton();
}
renderMenu();

// ==================== HIGHLIGHT VA NOTE FUNKSIYASI ====================
document.addEventListener('mouseup', function() {
  const passage = document.querySelector('.passage');
  if (!passage) return;

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Agar matn tanlangan bo'lsa va u passage ichida bo'lsa
  if (selectedText.length > 0 && passage.contains(selection.anchorNode)) {
    // 1. Matnni sariq rangga bo'yash (Highlight)
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'highlighted';
    range.surroundContents(span);
    selection.removeAllRanges();

    // 2. Izoh (Note) yozish oynasini chiqarish
    const note = prompt("Ushbu matn uchun izohingizni yozing (Bekor qilish uchun 'Cancel' bosing):");
    if (note && note.trim() !== "") {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'custom-note-box';
      noteDiv.innerHTML = `<span class="note-delete" onclick="this.parentElement.remove()">×</span> <b>Eslatma:</b> ${note}`;
      
      // Izohni xat boshlangan joyning tagiga qo'shish
      const parentNode = span.parentNode;
      if (parentNode) {
        parentNode.insertBefore(noteDiv, span.nextSibling);
      }
    }
  }
});