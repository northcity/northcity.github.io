/* Interface code for the independent HowToLiveBetter reading edition. MIT. */
(function () {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const iconPaths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4m6 6-6-6 6-6"/>',
    'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
    'arrow-down': '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    'arrow-up': '<path d="M12 20V4m-6 6 6-6 6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    leaf: '<path d="M20 4C11 2 3 6 4 13c.8 6 8 8 12 4 3-3 4-7 4-13Z"/><path d="M4 21 15 10"/>',
    health: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/><path d="M3 11h5l2-4 4 9 2-5h5"/>',
    wallet: '<path d="M20 8V5a2 2 0 0 0-2-2L4 6a2 2 0 0 0-1 2v11a2 2 0 0 0 2 2h15V8H5"/><path d="M20 12h-5v5h5"/><path d="M16.8 14.5h.1"/>',
    money: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18m-6 5h3M7 5V3"/>',
    growth: '<path d="M12 20V8M12 14C4 15 3 9 4 4c6 0 9 4 8 10Zm0 3c0-7 5-10 9-9 0 6-3 9-9 9Z"/>',
    rights: '<path d="M12 3v18M5 21h14M4 7l8-3 8 3M5 7l-3 8h6L5 7Zm14 0-3 8h6l-3-8Z"/>',
    family: '<path d="m3 11 9-8 9 8v10H3V11Z"/><path d="M9 21v-7h6v7"/>',
    world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
    sliders: '<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    list: '<path d="M9 5h11M9 12h11M9 19h11M4 5h.1M4 12h.1M4 19h.1"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    book: '<path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    share: '<path d="M12 16V3m-4 4 4-4 4 4M7 10H4v11h16V10h-3"/>',
    moon: '<path d="M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/>',
    external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
    github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.3 4a5.3 5.3 0 0 0-.2-4s-1.3-.4-4.3 1.6a15.3 15.3 0 0 0-7.8 0C4 .2 2.7.6 2.7.6a5.3 5.3 0 0 0-.2 4A5.7 5.7 0 0 0 1 8.5c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 7 18v4" transform="translate(1 0) scale(.95)"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>'
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.leaf}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

  if (!globalThis.LIFE_DATA || !globalThis.LifeCore) {
    $('#entry-grid').innerHTML = '<p class="empty-state">内容未能载入。请确认网站文件上传完整，或使用随包附带的离线单文件。</p>';
    return;
  }
  const data = globalThis.LIFE_DATA;
  const catalog = LifeCore.prepare(data);
  const prefs = LifeCore.readPreferences();
  const themes = LifeCore.themes;
  const fields = ['evidence', 'money', 'time', 'will', 'ratio'];
  const moneyLabels = { '0': '不花钱', '少': '花一点钱', '多': '需要投入' };
  const timeLabels = { '少': '顺手做', '中': '花些时间', '多': '持续投入' };
  const willLabels = { '否': '不用毅力', '些': '一点毅力', '是': '需要毅力' };
  const filterLabels = { evidence: '证据', money: '花钱', time: '时间', will: '毅力', ratio: '性价比' };
  const reader = $('#reader');
  let currentEntry = null;
  let lastBaseHash = '#/';
  let toastTimer;
  let visibleCount = 12;
  let layout = 'grid';
  let searchTimer;
  let filterPreviousFocus = null;
  let readerPreviousFocus = null;
  let readerReturnState = null;
  let replacedHash = null;
  let warnedStorage = false;
  const emptyFilters = () => ({ query: '', theme: 'all', chapter: 'all', evidence: [], money: [], time: [], will: [], ratio: [], quick: 'all', disputed: false, unverified: false, savedOnly: false });
  let filters = emptyFilters();

  function notify(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2600);
  }
  function persist() {
    const saved = LifeCore.writePreferences(prefs);
    if (!saved && !warnedStorage) { warnedStorage = true; notify('浏览器暂不允许本地存储，记录仅在本次打开期间保留。'); }
    return saved;
  }
  function setTheme() {
    document.documentElement.dataset.theme = prefs.theme;
    $('#theme-toggle').innerHTML = icon(prefs.theme === 'dark' ? 'sun' : 'moon');
    $('#theme-toggle').setAttribute('aria-label', prefs.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    $('#theme-toggle').title = $('#theme-toggle').getAttribute('aria-label');
    $('meta[name="theme-color"]').content = prefs.theme === 'dark' ? '#1b211b' : '#f7f8f2';
    reader.style.setProperty('--reading-scale', String(prefs.fontScale));
  }
  function savedCount() {
    const count = prefs.savedIds.filter(id => catalog.entryMap[id]).length;
    $('#saved-count').textContent = count;
    $('#saved-count').hidden = count === 0;
    return count;
  }
  function snapshot() { return new Date(catalog.meta.commitDate).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.'); }
  $$('[data-stat="entries"]').forEach(el => { el.textContent = catalog.entries.length; });
  $$('[data-stat="chapters"]').forEach(el => { el.textContent = catalog.chapters.length; });
  $('#snapshot-label').textContent = `内容快照 · ${snapshot()}`;
  setTheme(); savedCount();

  function themeById(id) { return themes.find(theme => theme.id === id) || themes[0]; }
  function plainText(value) { return String(value || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<https?:\/\/[^>]+>/g, '').replace(/\*\*|__|`/g, ''); }
  function excerpt(value, max = 100) { const text = plainText(value); return text.length > max ? text.slice(0, max).replace(/[，、；：\s]+$/, '') + '…' : text; }
  function chapterByNumber(number) { return catalog.chapters.find(chapter => chapter.sectionNumber === Number(String(number).replace(/^s/, ''))); }
  function themeCount(id) { return catalog.entries.filter(entry => entry.theme === id).length; }
  function makeRoute(nextFilters = filters) {
    const params = new URLSearchParams();
    if (nextFilters.query) params.set('q', nextFilters.query);
    for (const key of ['theme', 'chapter']) if (nextFilters[key] && nextFilters[key] !== 'all') params.set(key, nextFilters[key]);
    fields.forEach(key => { if (nextFilters[key].length) params.set(key, nextFilters[key].join(',')); });
    if (nextFilters.quick !== 'all') params.set('quick', nextFilters.quick);
    if (nextFilters.disputed) params.set('disputed', '1');
    if (nextFilters.unverified) params.set('unverified', '1');
    return `#/${nextFilters.savedOnly ? 'saved' : 'explore'}${params.size ? '?' + params.toString() : ''}`;
  }
  function navigate(hash) { if (location.hash === hash) handleRoute(); else location.hash = hash; }
  function replaceRoute(hash) {
    try { history.replaceState(null, '', hash); }
    catch {
      // Some browsers deny the History API on file://. Hash routing still works.
      if (location.hash !== hash) {
        replacedHash = hash;
        try { location.replace(hash); } catch (_) { location.hash = hash; }
      }
    }
  }
  function applyFilters(scroll = false, push = false) {
    visibleCount = 12;
    const hash = makeRoute();
    if (push) { navigate(hash); return; }
    replaceRoute(hash); lastBaseHash = hash;
    renderResults();
    if (scroll) $('#explorer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function findDocument(fragment) { return data.documents.find(doc => doc.sourcePath.includes(fragment)); }
  const scenarios = [
    { file: '被裁了之后', label: '换工作 / 被裁了' },
    { file: '孩子出生', label: '准备迎接宝宝' },
    { file: '家庭应急', label: '为家里做点准备' }
  ];
  $('#scenario-links').innerHTML = scenarios.map(scenario => { const doc = findDocument(scenario.file); return doc ? `<a href="#/doc/${escape(doc.id)}">${escape(scenario.label)} ${icon('arrow-up-right')}</a>` : ''; }).join('');
  $('#theme-grid').innerHTML = themes.map(theme => `<a class="theme-card theme-${escape(theme.id)}" href="#/explore?theme=${encodeURIComponent(theme.id)}"><span class="theme-icon">${icon(theme.id)}</span><h3 class="theme-name">${escape(theme.label)}</h3><p class="theme-description">${escape(theme.description)}</p><span class="theme-count">${themeCount(theme.id)} 条建议 ${icon('arrow-up-right', 'theme-arrow')}</span></a>`).join('');
  $('#chapter-select').insertAdjacentHTML('beforeend', catalog.chapters.map(chapter => `<option value="s${chapter.sectionNumber}">${String(chapter.sectionNumber).padStart(2, '0')} · ${escape(chapter.title)}</option>`).join(''));
  $('.filter-note').insertAdjacentHTML('beforebegin', '<div class="filter-group filter-flags"><label class="filter-checkbox"><input id="disputed-filter" type="checkbox">只看标注争议的</label><label class="filter-checkbox"><input id="unverified-filter" type="checkbox">只看待核实的</label></div>');
  function renderDirectory() {
    $('#directory-grid').innerHTML = themes.map(theme => `<section class="directory-group theme-${theme.id}"><div class="directory-heading"><span class="theme-icon">${icon(theme.id)}</span><div><h2>${escape(theme.label)}</h2><p>${themeCount(theme.id)} 条建议</p></div></div><div class="chapter-links">${catalog.chapters.filter(chapter => theme.chapters.includes(chapter.sectionNumber)).map(chapter => `<a class="chapter-link" href="#/explore?chapter=s${chapter.sectionNumber}"><span class="chapter-number">${String(chapter.sectionNumber).padStart(2, '0')}</span><span class="chapter-title">${escape(chapter.title)}</span><span class="chapter-count">${chapter.count} ${icon('arrow-up-right')}</span></a>`).join('')}</div></section>`).join('');
    $('#documents-grid').innerHTML = data.documents.map((doc, index) => `<a class="document-card" href="#/doc/${escape(doc.id)}"><span class="doc-number">GUIDE ${String(index + 1).padStart(2, '0')}</span><h3 class="doc-title">${escape(doc.title)}</h3><p class="doc-description">${escape(doc.excerpt || '按原文完整阅读，查看相关步骤、说明与证据来源。')}</p><span class="doc-footer">${Math.max(1, Math.ceil(doc.markdown.length / 600))} 分钟阅读 ${icon('arrow-up-right')}</span></a>`).join('');
  }
  renderDirectory();

  function activeFilterChips() {
    const result = [];
    if (filters.theme !== 'all') result.push({ key: 'theme', value: filters.theme, label: themeById(filters.theme).label });
    if (filters.chapter !== 'all') { const ch = chapterByNumber(filters.chapter); if (ch) result.push({ key: 'chapter', value: filters.chapter, label: `第 ${ch.sectionNumber} 章 · ${ch.title}` }); }
    fields.forEach(key => filters[key].forEach(value => result.push({ key, value, label: `${filterLabels[key]} · ${key === 'money' ? moneyLabels[value] : key === 'time' ? timeLabels[value] : key === 'will' ? willLabels[value] : value}` })));
    if (filters.disputed) result.push({ key: 'disputed', value: '1', label: '标注争议' });
    if (filters.unverified) result.push({ key: 'unverified', value: '1', label: '待核实' });
    return result;
  }
  function syncControls() {
    $('#chapter-select').value = filters.chapter;
    $$('[data-filter]').forEach(button => { const active = filters[button.dataset.filter].includes(button.dataset.value); button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $$('[data-quick]').forEach(button => { const active = button.dataset.quick === filters.quick; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#disputed-filter').checked = filters.disputed;
    $('#unverified-filter').checked = filters.unverified;
    const chips = activeFilterChips();
    $('#active-filters').innerHTML = chips.map(chip => `<button class="active-chip" type="button" data-remove-filter="${escape(chip.key)}" data-value="${escape(chip.value)}" aria-label="移除筛选：${escape(chip.label)}">${escape(chip.label)} ${icon('close')}</button>`).join('');
    $('#filter-count').textContent = chips.length ? ` ${chips.length}` : '';
    $('#active-filters').hidden = chips.length === 0;
    for (const input of [$('#hero-search'), $('#results-search')]) if (document.activeElement !== input) input.value = filters.query;
    $('#clear-search').hidden = !filters.query;
    $('#export-saved').hidden = !filters.savedOnly || savedCount() === 0;
    $('#results-order').textContent = filters.query ? '按搜索相关度' : '按原文章节顺序';
  }
  function visibleEntries() {
    let result = LifeCore.search(catalog, { ...filters, savedIds: prefs.savedIds });
    if (filters.quick === 'easy') result = result.filter(entry => entry.tags.money === '0' && entry.tags.will === '否');
    if (filters.quick === 'unread') result = result.filter(entry => !prefs.readIds.includes(entry.id));
    if (filters.disputed) result = result.filter(entry => entry.disputed);
    if (filters.unverified) result = result.filter(entry => entry.needsVerification);
    return result;
  }
  function cardMarkup(entry) {
    const theme = themeById(entry.theme);
    const saved = prefs.savedIds.includes(entry.id);
    const read = prefs.readIds.includes(entry.id);
    return `<article class="entry-card${read ? ' is-read' : ''}" data-entry-id="${entry.id}"><div class="entry-topline"><span class="category-label theme-${theme.id}">${icon(theme.id)}${escape(theme.label)}<span class="entry-chapter">${String(entry.sectionNumber).padStart(2, '0')}.${String(entry.itemNumber).padStart(2, '0')}</span></span><button type="button" class="bookmark-button${saved ? ' is-saved' : ''}" data-bookmark="${entry.id}" aria-pressed="${saved}" aria-label="${saved ? '取消收藏' : '收藏'}：${escape(entry.title)}">${icon('bookmark')}</button></div><a class="entry-open" href="#/entry/${entry.id}"><h3>${escape(entry.title)}</h3><p class="entry-excerpt">${escape(excerpt(entry.plain, 120))}</p></a><div class="entry-meta"><span class="evidence-badge evidence-${entry.evidence.toLowerCase()}" title="原作者证据分级，点击阅读全文可查看定义">${entry.evidence} 级证据</span><span class="ratio-badge" title="原作者性价比分档，只在同一收益口径内比较">性价比${escape(entry.ratio)}</span>${entry.disputed ? '<span class="caution-badge">有争议</span>' : ''}${entry.needsVerification ? '<span class="caution-badge">待核实</span>' : ''}</div><div class="entry-bottom"><span class="cost-label">${icon('wallet')}${moneyLabels[entry.tags.money]}${read ? '<span class="read-status">' + icon('check') + '已读</span>' : ''}</span><a class="read-link" href="#/entry/${entry.id}" aria-label="阅读全文：${escape(entry.title)}">阅读全文 ${icon('arrow-right')}</a></div></article>`;
  }
  function renderResults() {
    syncControls();
    const result = visibleEntries();
    $('#entry-grid').classList.toggle('list-layout', layout === 'list');
    $('#entry-grid').innerHTML = result.slice(0, visibleCount).map(cardMarkup).join('');
    const mode = filters.savedOnly ? '收藏' : '建议';
    $('#results-count').innerHTML = `找到 <strong>${result.length}</strong> 条${mode}${filters.query ? ` · “${escape(filters.query)}”` : ''}`;
    $('#empty-state').hidden = result.length > 0;
    if (!result.length) {
      const noSaved = filters.savedOnly && !savedCount();
      $('#empty-state').innerHTML = `${icon(noSaved ? 'bookmark' : 'search')}<h3>${noSaved ? '先把一条有用的建议留在这里' : '这次没有找到合适的内容'}</h3><p>${noSaved ? '点击建议右上角的收藏图标，下次需要时就能找到。收藏保存在当前浏览器。' : '试试更短的关键词，或放宽一项筛选条件。'}</p><button class="secondary-button" type="button" data-action="${noSaved ? 'explore' : 'reset'}">${noSaved ? '去探索指南' : '清空筛选'}</button>`;
    }
    $('#load-more-wrap').hidden = !result.length;
    $('#load-more').hidden = visibleCount >= result.length;
    $('#loaded-count').textContent = `已显示 ${Math.min(visibleCount, result.length)} / ${result.length} 条${visibleCount >= result.length ? ' · 已经看到这里的全部内容了' : ''}`;
    const chapter = chapterByNumber(filters.chapter);
    $('#chapter-intro').hidden = !chapter;
    $('#chapter-intro').innerHTML = chapter ? `<details><summary><span>第 ${chapter.sectionNumber} 章 · ${escape(chapter.title)}</span><span>阅读章节说明 ${icon('chevron-down')}</span></summary><div class="article-prose">${chapter.introductionHtml || ''}${chapter.footerHtml || ''}</div></details>` : '';
  }

  function openFilters() {
    filterPreviousFocus = document.activeElement;
    document.body.classList.add('filters-open');
    $('#filter-panel').classList.add('is-open');
    $('#mobile-filter-backdrop').hidden = false;
    $('#close-filters').focus();
  }
  function closeFilters() {
    if (!document.body.classList.contains('filters-open')) return;
    document.body.classList.remove('filters-open');
    $('#filter-panel').classList.remove('is-open');
    $('#mobile-filter-backdrop').hidden = true;
    filterPreviousFocus?.focus();
  }
  function closeReader() { navigate(lastBaseHash); }
  function captureFocus(element) {
    if (!element) return null;
    const card = element.closest?.('.entry-card');
    return {
      element,
      id: element.id,
      entryId: card?.dataset.entryId,
      cardIndex: card ? $$('.entry-card', $('#entry-grid')).indexOf(card) : -1,
      control: element.matches?.('[data-bookmark]') ? 'bookmark' : element.matches?.('.read-link') ? 'read' : 'open'
    };
  }
  function restoreFocus(state) {
    if (!state) return;
    let target = state.element?.isConnected ? state.element : state.id ? document.getElementById(state.id) : null;
    if (!target && state.entryId) {
      const cards = $$('.entry-card', $('#entry-grid'));
      const card = cards.find(item => item.dataset.entryId === state.entryId) || cards[Math.min(state.cardIndex, cards.length - 1)];
      const selector = state.control === 'bookmark' ? '[data-bookmark]' : state.control === 'read' ? '.read-link' : '.entry-open';
      target = card ? $(selector, card) : $('#results-search');
    }
    if (target && !target.closest('[hidden]')) target.focus({ preventScroll: true });
  }
  function hideReader() {
    if (reader.open) reader.close();
    const toast = $('#toast');
    if (toast.parentElement === reader) document.body.append(toast);
    document.body.classList.remove('reader-open');
    currentEntry = null;
  }
  function activateReader() {
    closeFilters();
    $('.copy-link-fallback', reader)?.remove();
    const toast = $('#toast');
    if (toast.parentElement !== reader) reader.append(toast);
    if (!reader.open) {
      readerPreviousFocus = captureFocus(document.activeElement);
      readerReturnState = { hash: lastBaseHash, visibleCount, scrollY: window.scrollY, focus: readerPreviousFocus };
      reader.showModal();
    }
    document.body.classList.add('reader-open');
    $('#reader-scroll').scrollTop = 0;
    $('#reader-progress-bar').style.width = '0%';
    $('#reader-close').focus();
  }
  function sourceFooter(url) {
    return `<div class="reader-source-credit"><p>原文：${escape(catalog.meta.author)} · 《高性价比人生指南》</p><p>内容快照 ${snapshot()} · <a href="${escape(url || catalog.meta.repositoryUrl)}" target="_blank" rel="noopener noreferrer">查看对应版本原文 ${icon('external')}</a></p></div>`;
  }
  function openEntry(id) {
    const entry = catalog.entryMap[id];
    if (!entry) { openMissing(); return; }
    currentEntry = entry;
    const chapter = chapterByNumber(entry.sectionNumber);
    const theme = themeById(entry.theme);
    const index = catalog.entries.findIndex(item => item.id === entry.id);
    const prev = catalog.entries[index - 1];
    const next = catalog.entries[index + 1];
    const html = entry.html || {};
    document.title = `${entry.title} · 高性价比人生指南`;
    $('#reader-content').innerHTML = `<div class="reader-eyebrow"><span class="category-label theme-${theme.id}">${icon(theme.id)} ${escape(theme.label)}</span><a href="#/explore?chapter=s${entry.sectionNumber}">第 ${entry.sectionNumber} 章 · ${escape(chapter.title)}</a><span>第 ${entry.itemNumber} 条</span></div><h1 id="reader-title" class="reader-title">${escape(entry.title)}</h1><div class="reader-badges"><a href="#/guide" class="evidence-badge evidence-${entry.evidence.toLowerCase()}">原作者证据分级 · ${entry.evidence}</a><span class="ratio-badge">性价比${escape(entry.ratio)} · ${escape(entry.tags.lens)}口径</span>${entry.disputed ? '<span class="caution-badge">原文标注争议</span>' : ''}${entry.needsVerification ? '<span class="caution-badge">含待核实内容</span>' : ''}</div><section class="reader-summary"><span class="section-kicker">先看 · 说人话</span><div class="article-prose">${html.plain || escape(entry.plain)}</div></section><div class="reader-facts"><div class="summary-item"><span>${icon('wallet')}金钱投入</span><strong>${moneyLabels[entry.tags.money]}</strong></div><div class="summary-item"><span>${icon('clock')}时间投入</span><strong>${timeLabels[entry.tags.time]}</strong></div><div class="summary-item"><span>${icon('spark')}毅力投入</span><strong>${willLabels[entry.tags.will]}</strong></div></div><section class="reader-section"><h2>需要付出什么</h2><div class="article-prose">${html.cost || escape(entry.cost)}</div></section><section class="reader-section"><h2>能换回什么</h2><div class="article-prose">${html.gain || escape(entry.gain)}</div></section><section class="reader-section reader-note"><h2>${entry.disputed ? '争议、适用条件与备注' : '适用条件与备注'}</h2><div class="article-prose">${html.note || escape(entry.note)}</div></section><section class="reader-section"><h2>证据与原始来源 <span class="evidence-badge evidence-${entry.evidence.toLowerCase()}">${entry.evidence} 级</span></h2><p class="evidence-explainer">等级沿用原作者定义。A 级可能含观察研究或法条原文；是否适用于你，请结合收益、备注和原始来源判断。</p><div class="source-list article-prose">${html.source || escape(entry.source)}</div><a class="text-link" href="#/guide">了解证据分级与性价比 ${icon('arrow-up-right')}</a></section>${sourceFooter(entry.sourceUrl)}<div class="reader-end"><span>${icon('leaf')}不用全部做到，记住适合自己的这一条就好。</span><button type="button" class="secondary-button" data-mark-read="${entry.id}">${icon('check')}${prefs.readIds.includes(entry.id) ? '已读 · 点击取消' : '标记读过'}</button></div><nav class="reader-navigation" aria-label="相邻建议">${prev ? `<a class="previous" href="#/entry/${prev.id}"><span>${icon('arrow-left')} 上一条</span><strong>${escape(prev.title)}</strong></a>` : '<span></span>'}${next ? `<a class="next" href="#/entry/${next.id}"><span>下一条 ${icon('arrow-right')}</span><strong>${escape(next.title)}</strong></a>` : ''}</nav>`;
    $('#reader-save').hidden = false;
    $('#reader-share').hidden = false;
    updateReaderSave();
    activateReader();
  }
  function updateReaderSave() {
    if (!currentEntry) return;
    const saved = prefs.savedIds.includes(currentEntry.id);
    $('#reader-save').classList.toggle('is-saved', saved);
    $('#reader-save').setAttribute('aria-pressed', String(saved));
    $('#reader-save').setAttribute('aria-label', saved ? '取消收藏这条建议' : '收藏这条建议');
    $('#reader-save').title = saved ? '已收藏，点击取消' : '收藏这条建议';
  }
  function openDocument(id) {
    const doc = catalog.docMap[id];
    if (!doc) { openMissing(); return; }
    currentEntry = null;
    document.title = `${doc.title} · 高性价比人生指南`;
    $('#reader-content').innerHTML = `<div class="reader-eyebrow"><span>${icon('book')}专题长文</span><span>约 ${Math.max(1, Math.ceil(doc.markdown.length / 600))} 分钟阅读</span></div><h1 id="reader-title" class="reader-title">${escape(doc.title)}</h1><div class="article-prose longform-prose">${doc.html || escape(doc.markdown)}</div>${sourceFooter(doc.sourceUrl)}`;
    $('#reader-save').hidden = true;
    $('#reader-share').hidden = false;
    activateReader();
  }
  function openMissing() {
    currentEntry = null;
    $('#reader-content').innerHTML = `<div class="empty-state"><h1 id="reader-title">这条内容暂时找不到了</h1><p>链接可能有误，或内容属于其他版本。可以返回目录按标题搜索。</p><a href="#/topics" class="secondary-button">查看全部章节</a></div>`;
    $('#reader-save').hidden = true; $('#reader-share').hidden = true;
    activateReader();
  }
  function openAbout(guideOnly = false) {
    currentEntry = null;
    const title = guideOnly ? '读懂证据，也读懂它的边界。' : '让好的生活知识，更容易被找到。';
    document.title = `${guideOnly ? '阅读说明' : '关于与许可'} · 高性价比人生指南`;
    $('#reader-content').innerHTML = `<div class="reader-eyebrow">${guideOnly ? 'HOW TO READ' : 'ABOUT THIS EDITION'}</div><h1 id="reader-title" class="reader-title">${title}</h1>${guideOnly ? '' : `<section class="reader-summary"><div class="article-prose"><p>这是《高性价比人生指南》的独立阅读界面，由北城发起重新设计。我们把原文章节整理为六个生活主题，加入搜索、组合筛选、收藏与专注阅读。</p><p>内容作者是 <a href="${catalog.meta.repositoryUrl}" target="_blank" rel="noopener noreferrer">eternity4719 及项目贡献者</a>。新版保留原文的建议、证据、来源与限制条件，改动的是信息分类与界面呈现。</p></div></section><div class="about-facts"><div><strong>${catalog.entries.length}</strong><span>条建议</span></div><div><strong>${catalog.chapters.length}</strong><span>个章节</span></div><div><strong>${data.documents.length}</strong><span>篇专题长文</span></div></div><section class="reader-section"><h2>内容版本与更新</h2><p>当前收录 ${snapshot()} 的原仓库快照。本文内容不会自动随上游更新；部署者可以手动同步并重新构建。</p><p>原文提交：<a href="${catalog.meta.repositoryUrl}/commit/${catalog.meta.commit}" target="_blank" rel="noopener noreferrer">${catalog.meta.commit.slice(0, 12)}</a>。法律、医保、社保等制度内容以原文注明的地区与日期为准，相关政策可能变化。</p></section><section class="reader-section"><h2>收藏与阅读记录</h2><p>收藏、已读标记、字号和深浅色偏好只保存在当前浏览器。没有账号或服务器同步；清理浏览器数据会移除这些记录。你可以在「我的收藏」中导出一份含原文与来源的文件。</p></section>`}<div class="article-prose guide-prose">${data.guideHtml.evidence}${data.guideHtml.ratio}${data.guideHtml.glossary}${guideOnly ? '' : data.guideHtml.attribution}</div>${guideOnly ? '' : `<section class="reader-section"><h2>本次改动</h2><p>新增六大主题导航、生活场景入口、组合筛选、独立阅读视图、收藏、阅读标记和深色模式；保留 34 个原文章节及条目编号，正文文字未改写。所有性价比标签沿用原作者公式。</p><p>本站内容按 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> 使用；新增界面代码按 MIT 发布。本站为独立改编版本，与原作者的官方站点分别维护。</p></section>`}${sourceFooter(catalog.meta.repositoryUrl)}`;
    $('#reader-save').hidden = true; $('#reader-share').hidden = false;
    activateReader();
  }
  function toggleSaved(id) {
    if (!catalog.entryMap[id]) return;
    const index = prefs.savedIds.indexOf(id);
    if (index === -1) prefs.savedIds.push(id); else prefs.savedIds.splice(index, 1);
    const persisted = persist();
    const previousFocus = captureFocus(document.activeElement);
    savedCount(); renderResults(); updateReaderSave();
    restoreFocus(previousFocus);
    if (persisted) notify(index === -1 ? '已收藏，留给需要的时候。' : '已取消收藏');
  }
  function readRoute(hash) {
    const [path, search = ''] = hash.replace(/^#/, '').split('?');
    const params = new URLSearchParams(search);
    const next = emptyFilters();
    next.query = (params.get('q') || '').slice(0, 250);
    next.theme = themes.some(theme => theme.id === params.get('theme')) ? params.get('theme') : 'all';
    const chapter = chapterByNumber(params.get('chapter'));
    next.chapter = chapter ? `s${chapter.sectionNumber}` : 'all';
    const allowed = { evidence: ['A', 'B', 'C'], money: ['0', '少', '多'], time: ['少', '中', '多'], will: ['否', '些', '是'], ratio: ['极高', '高', '一般'] };
    fields.forEach(key => { next[key] = [...new Set((params.get(key) || '').split(',').filter(value => allowed[key].includes(value)))]; });
    next.quick = ['easy', 'unread'].includes(params.get('quick')) ? params.get('quick') : 'all';
    next.disputed = params.get('disputed') === '1'; next.unverified = params.get('unverified') === '1';
    next.savedOnly = path === '/saved';
    return { path: path || '/', filters: next };
  }
  function handleRoute() {
    clearTimeout(searchTimer);
    const hash = location.hash || '#/';
    const { path, filters: nextFilters } = readRoute(hash);
    if (path.startsWith('/entry/')) { openEntry(path.slice('/entry/'.length)); return; }
    if (path.startsWith('/doc/')) {
      const id = path.slice('/doc/'.length);
      openDocument(id);
      const anchor = new URLSearchParams(hash.slice(hash.indexOf('?') + 1)).get('anchor');
      const heading = anchor ? document.getElementById(`${id}--${anchor}`) : null;
      if (heading && reader.contains(heading)) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: 'instant' }); }
      return;
    }
    if (path === '/about' || path === '/guide') { openAbout(path === '/guide'); return; }
    const returning = reader.open && readerReturnState?.hash === hash ? readerReturnState : null;
    hideReader(); closeFilters(); filters = nextFilters; visibleCount = returning ? returning.visibleCount : 12; lastBaseHash = hash;
    readerReturnState = null;
    const topics = path === '/topics';
    $('#home-intro').hidden = path !== '/';
    $('#topics-page').hidden = !topics;
    $('#explorer').hidden = topics;
    $('#closing-note').hidden = filters.savedOnly;
    $('#explorer-title').textContent = filters.savedOnly ? '把有用的，留给需要的时候。' : '把有用的，慢慢装进生活';
    $('#explorer-kicker').textContent = filters.savedOnly ? 'YOUR LITTLE COLLECTION' : 'THE GUIDE';
    $('#explorer-description').textContent = filters.savedOnly ? '收藏保存在当前浏览器，无需登录。' : '不用全部做到。先看看，此刻哪一条适合你。';
    document.title = `${topics ? '主题目录' : filters.savedOnly ? '我的收藏' : '好好生活，有据可查'} · 高性价比人生指南`;
    $$('[data-nav]').forEach(link => { const active = link.dataset.nav === (topics ? 'topics' : filters.savedOnly ? 'saved' : 'explore'); link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    renderResults();
    if (returning) { restoreFocus(returning.focus); window.scrollTo({ top: returning.scrollY, behavior: 'instant' }); }
    else if (path !== '/') window.scrollTo({ top: 0, behavior: 'instant' });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button, a');
    if (!button) return;
    if (button.matches('.skip-link')) {
      event.preventDefault();
      const main = $('#main-content'); main.tabIndex = -1; main.focus({ preventScroll: true }); main.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    if (button.dataset.query !== undefined) { filters = emptyFilters(); filters.query = button.dataset.query; navigate(makeRoute()); }
    if (button.dataset.bookmark) toggleSaved(button.dataset.bookmark);
    if (button.dataset.filter) {
      const key = button.dataset.filter; const value = button.dataset.value;
      filters[key] = filters[key].includes(value) ? filters[key].filter(item => item !== value) : [...filters[key], value]; applyFilters();
    }
    if (button.dataset.removeFilter) {
      const key = button.dataset.removeFilter;
      if (fields.includes(key)) filters[key] = filters[key].filter(item => item !== button.dataset.value);
      else if (['disputed', 'unverified'].includes(key)) filters[key] = false;
      else filters[key] = 'all';
      applyFilters();
    }
    if (button.dataset.quick) { filters.quick = button.dataset.quick; applyFilters(); }
    if (button.dataset.layout) {
      layout = button.dataset.layout;
      $$('[data-layout]').forEach(el => { el.classList.toggle('active', el.dataset.layout === layout); el.setAttribute('aria-pressed', String(el.dataset.layout === layout)); });
      renderResults();
    }
    if (button.dataset.action === 'reset') { clearTimeout(searchTimer); const savedOnly = filters.savedOnly; filters = emptyFilters(); filters.savedOnly = savedOnly; applyFilters(); }
    if (button.dataset.action === 'explore') navigate('#/');
    if (button.dataset.action === 'guide') navigate('#/guide');
    if (button.dataset.markRead) {
      const id = button.dataset.markRead; const index = prefs.readIds.indexOf(id);
      if (index === -1) prefs.readIds.push(id); else prefs.readIds.splice(index, 1);
      const persisted = persist(); button.innerHTML = icon('check') + (index === -1 ? '已读 · 点击取消' : '标记读过'); renderResults();
      if (persisted) notify(index === -1 ? '已标记读过' : '已取消已读标记');
    }
  });
  $('#hero-search-form').addEventListener('submit', event => { event.preventDefault(); filters = emptyFilters(); filters.query = $('#hero-search').value.trim(); navigate(makeRoute()); });
  $('#results-search').addEventListener('input', event => { clearTimeout(searchTimer); const value = event.target.value; searchTimer = setTimeout(() => { filters.query = value.trim(); applyFilters(); }, 180); });
  $('#results-search').addEventListener('keydown', event => { if (event.key !== 'Enter' || event.isComposing) return; event.preventDefault(); clearTimeout(searchTimer); filters.query = event.target.value.trim(); applyFilters(); });
  $('#clear-search').addEventListener('click', () => { clearTimeout(searchTimer); filters.query = ''; $('#results-search').value = ''; applyFilters(); $('#results-search').focus(); });
  $('#chapter-select').addEventListener('change', event => { filters.chapter = event.target.value; filters.theme = 'all'; applyFilters(); });
  $('#disputed-filter').addEventListener('change', event => { filters.disputed = event.target.checked; applyFilters(); });
  $('#unverified-filter').addEventListener('change', event => { filters.unverified = event.target.checked; applyFilters(); });
  $('#load-more').addEventListener('click', () => { const count = visibleCount; visibleCount += 12; renderResults(); const next = $(`#entry-grid .entry-card:nth-child(${count + 1}) .entry-open`); next?.focus({ preventScroll: true }); });
  $('#theme-toggle').addEventListener('click', () => { prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark'; setTheme(); persist(); });
  $('#open-filters').addEventListener('click', openFilters);
  $('#close-filters').addEventListener('click', closeFilters);
  $('#mobile-filter-backdrop').addEventListener('click', closeFilters);
  $('#reader-close').addEventListener('click', closeReader);
  reader.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
  reader.addEventListener('click', event => { if (event.target !== reader) return; const rect = reader.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeReader(); });
  $('#reader-save').addEventListener('click', () => { if (currentEntry) toggleSaved(currentEntry.id); });
  function changeFont(delta) { prefs.fontScale = Math.round(Math.min(1.5, Math.max(0.85, prefs.fontScale + delta)) * 100) / 100; setTheme(); persist(); }
  $('#font-smaller').addEventListener('click', () => changeFont(-0.1));
  $('#font-larger').addEventListener('click', () => changeFont(0.1));
  $('#reader-scroll').addEventListener('scroll', event => { const el = event.target; const max = el.scrollHeight - el.clientHeight; $('#reader-progress-bar').style.width = (max > 0 ? Math.min(100, el.scrollTop / max * 100) : 100) + '%'; }, { passive: true });
  $('#reader-share').addEventListener('click', async () => {
    const url = location.href;
    if (location.protocol === 'file:') { notify('离线文件没有公共网址。部署到网站后即可分享直达链接。'); return; }
    try { await navigator.clipboard.writeText(url); notify('直达链接已复制'); }
    catch {
      let fallback = $('.copy-link-fallback', reader);
      if (!fallback) { fallback = document.createElement('div'); fallback.className = 'copy-link-fallback'; fallback.innerHTML = '<label for="share-url">复制下面的直达链接</label><input id="share-url" readonly><button type="button" class="icon-button" aria-label="关闭链接框">' + icon('close') + '</button>'; $('.reader-toolbar').after(fallback); $('button', fallback).onclick = () => fallback.remove(); }
      $('input', fallback).value = url; $('input', fallback).focus(); $('input', fallback).select();
    }
  });
  $('#export-saved').addEventListener('click', () => {
    const items = catalog.entries.filter(entry => prefs.savedIds.includes(entry.id));
    const header = `# 我的生活指南收藏\n\n内容：《高性价比人生指南》 · ${catalog.meta.author}\n原项目：${catalog.meta.repositoryUrl}\n许可：${catalog.meta.contentLicenseUrl}\n内容快照：${snapshot()}\n界面重新设计，正文保留原文。\n\n`;
    const body = items.map(entry => `## 第 ${entry.sectionNumber} 章第 ${entry.itemNumber} 条 · ${entry.title}\n\n- 说人话：${entry.plain}\n- 成本：${entry.cost}\n- 收益：${entry.gain}\n- 原作者证据等级：${entry.evidenceText}\n- 备注：${entry.note}\n- 来源：${entry.source}\n- 原文：${entry.sourceUrl}\n`).join('\n---\n\n');
    const url = URL.createObjectURL(new Blob([header + body], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = '我的生活指南收藏.md'; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`已导出 ${items.length} 条收藏，含完整原文与来源`);
  });
  document.addEventListener('keydown', event => {
    const editable = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (event.key === 'Escape' && document.body.classList.contains('filters-open')) { event.preventDefault(); closeFilters(); return; }
    if (event.key === 'Tab' && document.body.classList.contains('filters-open')) {
      const focusable = $$('button:not([hidden]),select,input', $('#filter-panel')).filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (!reader.open && (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !editable))) {
      event.preventDefault();
      closeFilters();
      if ($('#explorer').hidden) { navigate('#/explore'); setTimeout(() => $('#results-search').focus(), 0); }
      else if (!$('#home-intro').hidden && window.scrollY < 400) $('#hero-search').focus();
      else $('#results-search').focus();
    }
  });
  $('#back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  window.addEventListener('scroll', () => { $('#back-to-top').hidden = window.scrollY < 650; }, { passive: true });
  window.addEventListener('hashchange', event => {
    const changedHash = event.newURL ? new URL(event.newURL).hash : location.hash;
    if (replacedHash === changedHash) { replacedHash = null; return; }
    replacedHash = null;
    handleRoute();
  });
  window.addEventListener('storage', event => { if (event.key !== LifeCore.storageKey) return; Object.assign(prefs, LifeCore.readPreferences()); setTheme(); savedCount(); renderResults(); updateReaderSave(); });
  // Populate the underlying page before honoring a direct article URL.
  renderResults();
  handleRoute();
}());
