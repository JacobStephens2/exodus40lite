(function () {
  'use strict';

  var STORAGE_KEY = 'exodus40lite-data';
  var LENT_START = '2026-02-18';
  var LENT_END = '2026-04-04';

  var CATEGORIES = [
    {
      id: 'prayer',
      name: 'Prayer',
      icon: '\u{1F64F}',
      items: [
        { id: 'prayer-readings', label: 'Read the Mass readings and Psalm', freq: 'daily' },
        { id: 'prayer-holyhour', label: 'Make a holy half hour', freq: 'daily' },
        { id: 'prayer-lordsday', label: "Celebrate the Lord\u2019s Day by relaxing one discipline", freq: 'sunday' }
      ]
    },
    {
      id: 'fasting',
      name: 'Fasting',
      icon: '\u{1F35E}',
      items: [
        { id: 'fasting-fast', label: 'Fast', freq: 'fasting' },
        { id: 'fasting-abstain', label: 'Abstain from meat', freq: 'abstinence' }
      ]
    },
    {
      id: 'almsgiving',
      name: 'Almsgiving & Works of Charity',
      icon: '\u{1FAF4}',
      items: [
        { id: 'almsgiving-alms', label: 'Give alms', freq: 'weekly' },
        {
          id: 'charity-work',
          label: 'Perform one work of charity',
          freq: 'daily',
          expandable: true,
          details: [
            { heading: 'Corporal', list: 'Feed the hungry, give drink to the thirsty, clothe the naked, shelter the homeless, visit the sick, visit the imprisoned, bury the dead' },
            { heading: 'Spiritual', list: 'Instruct the ignorant, counsel the doubtful, admonish the sinner, bear wrongs patiently, forgive offenses willingly, comfort the afflicted, pray for the living and the dead' }
          ]
        }
      ]
    },
    {
      id: 'fraternity',
      name: 'Fraternity',
      icon: '\u{1FAC2}',
      items: [
        { id: 'fraternity-anchor', label: 'Anchor check-in', freq: 'daily' },
        { id: 'fraternity-meeting', label: 'Fraternity meeting with the group', freq: 'sunday' }
      ]
    },
    {
      id: 'stewardship',
      name: 'Stewardship',
      icon: '\u{1F3DB}\uFE0F',
      items: [
        { id: 'stewardship-sleep', label: 'Full night\u2019s sleep (7+ hours)', freq: 'daily' },
        { id: 'stewardship-exercise', label: 'Exercise', freq: 'weekly', weeklyGoal: 3 }
      ]
    },
    {
      id: 'asceticism',
      name: 'Asceticism',
      icon: '\u{1F4AA}',
      items: [
        { id: 'asceticism-screentime', label: 'No unnecessary screen time', freq: 'daily' },
        { id: 'asceticism-alcohol', label: 'No alcohol', freq: 'daily' },
        { id: 'asceticism-soda', label: 'No soda or sweet drinks', freq: 'daily' },
        { id: 'asceticism-snacking', label: 'No snacking between meals', freq: 'daily' },
        { id: 'asceticism-desserts', label: 'No desserts or sweets', freq: 'daily' },
        { id: 'asceticism-music', label: 'Only music that lifts the soul to God', freq: 'daily' },
        { id: 'asceticism-purchases', label: 'No unnecessary purchases', freq: 'daily' }
      ]
    }
  ];

  // ========== DATE HELPERS ==========

  var currentDate;

  function todayStr() {
    var d = new Date();
    return toDateStr(d);
  }

  function toDateStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function parseDate(str) {
    var parts = str.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2], 12, 0, 0);
  }

  function formatDate(str) {
    return parseDate(str).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  function addDays(str, n) {
    var d = parseDate(str);
    d.setDate(d.getDate() + n);
    return toDateStr(d);
  }

  function dayOfWeek(str) {
    return parseDate(str).getDay();
  }

  function lentDayNumber(str) {
    var start = parseDate(LENT_START);
    var cur = parseDate(str);
    return Math.round((cur - start) / 864e5) + 1;
  }

  function totalLentDays() {
    return Math.round((parseDate(LENT_END) - parseDate(LENT_START)) / 864e5) + 1;
  }

  function getWeekDates(str) {
    var d = parseDate(str);
    var dow = d.getDay();
    d.setDate(d.getDate() - dow);
    var dates = [];
    for (var i = 0; i < 7; i++) {
      var ds = toDateStr(d);
      if (ds >= LENT_START && ds <= LENT_END) dates.push(ds);
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  // ========== ITEM VISIBILITY ==========

  function shouldShow(item, dateStr) {
    switch (item.freq) {
      case 'daily':
        return true;
      case 'sunday':
        return dayOfWeek(dateStr) === 0;
      case 'weekly':
        return true;
      case 'fasting':
        if (dateStr === '2026-02-18') return true;
        if (dayOfWeek(dateStr) !== 5) return false;
        if (dateStr === '2026-02-20') return false;
        return true;
      case 'abstinence':
        if (dateStr === '2026-02-18') return true;
        return dayOfWeek(dateStr) === 5;
      default:
        return true;
    }
  }

  // ========== LOCALSTORAGE ==========

  function loadData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function isChecked(dateStr, itemId) {
    var data = loadData();
    return !!(data[dateStr] && data[dateStr][itemId]);
  }

  function toggleItem(dateStr, itemId) {
    var data = loadData();
    if (!data[dateStr]) data[dateStr] = {};
    data[dateStr][itemId] = !data[dateStr][itemId];
    if (!data[dateStr][itemId]) delete data[dateStr][itemId];
    if (Object.keys(data[dateStr]).length === 0) delete data[dateStr];
    saveData(data);
    return !!(data[dateStr] && data[dateStr][itemId]);
  }

  function weeklyCount(itemId, dateStr) {
    var dates = getWeekDates(dateStr);
    var data = loadData();
    var count = 0;
    for (var i = 0; i < dates.length; i++) {
      if (data[dates[i]] && data[dates[i]][itemId]) count++;
    }
    return count;
  }

  // ========== DOM HELPERS ==========

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === 'className') e.className = attrs[k];
        else if (k === 'textContent') e.textContent = attrs[k];
        else if (k === 'innerHTML') e.innerHTML = attrs[k];
        else if (k === 'hidden') e.hidden = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (var i = 0; i < children.length; i++) {
        if (typeof children[i] === 'string') e.appendChild(document.createTextNode(children[i]));
        else if (children[i]) e.appendChild(children[i]);
      }
    }
    return e;
  }

  // ========== RENDERING ==========

  function render() {
    var main = document.getElementById('checklist');
    var dateEl = document.getElementById('current-date');
    var dayEl = document.getElementById('lent-day');
    var todayBtn = document.getElementById('today-btn');
    var prevBtn = document.getElementById('prev-day');
    var nextBtn = document.getElementById('next-day');

    dateEl.textContent = formatDate(currentDate);
    dayEl.textContent = 'Day ' + lentDayNumber(currentDate) + ' of ' + totalLentDays();

    todayBtn.hidden = (currentDate === todayStr());
    prevBtn.disabled = (currentDate <= LENT_START);
    nextBtn.disabled = (currentDate >= LENT_END);

    var inLent = currentDate >= LENT_START && currentDate <= LENT_END;
    if (!inLent) {
      main.innerHTML = '';
      main.appendChild(el('div', { className: 'message', textContent: 'This date is outside of Lent 2026.' }));
      updateProgress(0, 0);
      return;
    }

    main.innerHTML = '';
    var totalItems = 0;
    var checkedItems = 0;

    for (var c = 0; c < CATEGORIES.length; c++) {
      var cat = CATEGORIES[c];
      var visible = [];
      for (var j = 0; j < cat.items.length; j++) {
        if (shouldShow(cat.items[j], currentDate)) visible.push(cat.items[j]);
      }
      if (visible.length === 0) continue;

      var section = el('section', { className: 'category' });
      var hdr = el('div', { className: 'category-header' }, [
        el('span', { className: 'category-icon', textContent: cat.icon }),
        el('h2', { textContent: cat.name })
      ]);
      section.appendChild(hdr);

      for (var k = 0; k < visible.length; k++) {
        var item = visible[k];
        var checked = isChecked(currentDate, item.id);
        if (checked) checkedItems++;
        totalItems++;
        section.appendChild(buildItemRow(item, checked));
      }

      main.appendChild(section);
    }

    updateProgress(checkedItems, totalItems);

    if (totalItems > 0 && checkedItems === totalItems) {
      main.appendChild(el('div', { className: 'all-done', textContent: 'All disciplines kept today. Well done.' }));
    }
  }

  function buildItemRow(item, checked) {
    var row = el('label', { className: 'item' + (checked ? ' checked' : '') });

    var cb = el('input', { type: 'checkbox' });
    cb.checked = checked;
    cb.addEventListener('change', function () {
      var newState = toggleItem(currentDate, item.id);
      row.classList.toggle('checked', newState);
      recalcProgress();
    });

    var textDiv = el('div', { className: 'item-text' });
    textDiv.appendChild(el('span', { className: 'item-label', textContent: item.label }));

    if (item.hint) {
      textDiv.appendChild(el('span', { className: 'item-hint', textContent: item.hint }));
    }

    if (item.freq === 'weekly') {
      var count = weeklyCount(item.id, currentDate);
      var goal = item.weeklyGoal || 1;
      var badgeText = item.weeklyGoal
        ? count + '/' + goal + ' this week'
        : (count > 0 ? '\u2713 this week' : 'this week');
      var badge = el('span', {
        className: 'weekly-badge' + (count >= goal ? ' complete' : ''),
        textContent: badgeText
      });
      textDiv.appendChild(badge);
    }

    if (item.expandable && item.details) {
      var detailsDiv = el('div', { className: 'item-details', hidden: true });
      for (var i = 0; i < item.details.length; i++) {
        detailsDiv.appendChild(el('p', {
          innerHTML: '<strong>' + item.details[i].heading + ':</strong> ' + item.details[i].list
        }));
      }

      var toggle = el('button', {
        className: 'details-toggle',
        textContent: 'Show examples',
        type: 'button'
      });
      toggle.addEventListener('click', (function (dDiv, tBtn) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();
          dDiv.hidden = !dDiv.hidden;
          tBtn.textContent = dDiv.hidden ? 'Show examples' : 'Hide examples';
        };
      })(detailsDiv, toggle));

      textDiv.appendChild(toggle);
      textDiv.appendChild(detailsDiv);
    }

    row.appendChild(cb);
    row.appendChild(textDiv);
    return row;
  }

  function updateProgress(checked, total) {
    var fill = document.getElementById('progress-fill');
    var text = document.getElementById('progress-text');
    var pct = total > 0 ? (checked / total) * 100 : 0;
    fill.style.width = pct + '%';
    text.textContent = total > 0 ? checked + ' / ' + total : '';
  }

  function recalcProgress() {
    var boxes = document.querySelectorAll('#checklist input[type="checkbox"]');
    var total = boxes.length;
    var checked = 0;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) checked++;
    }
    updateProgress(checked, total);

    var allDone = document.querySelector('.all-done');
    if (checked === total && total > 0) {
      if (!allDone) {
        document.getElementById('checklist').appendChild(
          el('div', { className: 'all-done', textContent: 'All disciplines kept today. Well done.' })
        );
      }
    } else if (allDone) {
      allDone.remove();
    }
  }

  // ========== EVENT HANDLERS ==========

  document.getElementById('prev-day').addEventListener('click', function () {
    if (currentDate > LENT_START) {
      currentDate = addDays(currentDate, -1);
      render();
    }
  });

  document.getElementById('next-day').addEventListener('click', function () {
    if (currentDate < LENT_END) {
      currentDate = addDays(currentDate, 1);
      render();
    }
  });

  document.getElementById('today-btn').addEventListener('click', function () {
    currentDate = clampToLent(todayStr());
    render();
  });

  // ========== SERVICE WORKER ==========

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }

  // ========== INIT ==========

  function clampToLent(dateStr) {
    if (dateStr < LENT_START) return LENT_START;
    if (dateStr > LENT_END) return LENT_END;
    return dateStr;
  }

  currentDate = clampToLent(todayStr());
  render();
})();
