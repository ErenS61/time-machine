// --- Gestion des onglets ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    tabPanels.forEach((p) => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// --- Onglet Panne ---
document.getElementById('downtime-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const startValue = document.getElementById('start-time').value;
  const endValue = document.getElementById('end-time').value;

  if (!startValue || !endValue) return;

  const [startH, startM] = startValue.split(':').map(Number);
  const [endH, endM] = endValue.split(':').map(Number);

  const startTotal = startH * 60 + startM;
  let endTotal = endH * 60 + endM;

  const overnightNote = document.getElementById('overnight-note');

  // Si l'heure de fin est avant l'heure de départ, on considère que
  // l'arrêt s'est prolongé après minuit.
  if (endTotal < startTotal) {
    endTotal += 24 * 60;
    overnightNote.classList.remove('hidden');
  } else {
    overnightNote.classList.add('hidden');
  }

  const diffMinutes = endTotal - startTotal;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  let hmText;
  if (hours === 0) {
    hmText = `${minutes} min`;
  } else if (minutes === 0) {
    hmText = `${hours} h`;
  } else {
    hmText = `${hours} h ${minutes} min`;
  }

  document.getElementById('result-minutes').textContent = `${diffMinutes} minutes`;
  document.getElementById('result-hm').textContent = hmText;
  document.getElementById('result').classList.remove('hidden');
});

// --- Onglet Nettoyage ---
const presetButtons = document.querySelectorAll('.preset-btn');
const customField = document.getElementById('custom-minutes-field');
const customInput = document.getElementById('custom-minutes');

let selectedMinutes = 60;

presetButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    presetButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.minutes === 'custom') {
      customField.classList.remove('hidden');
      customInput.focus();
      selectedMinutes = null;
    } else {
      customField.classList.add('hidden');
      selectedMinutes = parseInt(btn.dataset.minutes, 10);
    }
  });
});

document.getElementById('cleaning-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const startValue = document.getElementById('cleaning-start-time').value;
  if (!startValue) return;

  let duration = selectedMinutes;
  if (duration === null) {
    duration = parseInt(customInput.value, 10);
    if (!duration || duration <= 0) return;
  }

  const [startH, startM] = startValue.split(':').map(Number);
  const startTotal = startH * 60 + startM;
  let endTotal = startTotal + duration;

  const overnightNote = document.getElementById('cleaning-overnight-note');

  if (endTotal >= 24 * 60) {
    endTotal -= 24 * 60;
    overnightNote.classList.remove('hidden');
  } else {
    overnightNote.classList.add('hidden');
  }

  const endH = Math.floor(endTotal / 60);
  const endM = endTotal % 60;
  const endTimeText = `${String(endH).padStart(2, '0')}h${String(endM).padStart(2, '0')}`;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  let durationText;
  if (hours === 0) {
    durationText = `Nettoyage de ${minutes} min`;
  } else if (minutes === 0) {
    durationText = `Nettoyage de ${hours} h`;
  } else {
    durationText = `Nettoyage de ${hours} h ${minutes} min`;
  }

  document.getElementById('cleaning-end-time').textContent = `Arrêt à ${endTimeText}`;
  document.getElementById('cleaning-duration-label').textContent = durationText;
  document.getElementById('cleaning-result').classList.remove('hidden');
});