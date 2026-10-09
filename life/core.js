/* LifeCore — dependency-free search, filters and local reading preferences. */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'better-life:preferences:v1';
  var themes = [
    { id: 'health', label: '身体与健康', shortLabel: '健康', description: '照顾身体，了解就医与日常健康。', icon: 'heart', chapters: [1, 2, 13, 16, 22, 24, 28, 33, 34] },
    { id: 'money', label: '钱与生活', shortLabel: '生活', description: '从日常开销到居住，把钱花得更明白。', icon: 'wallet', chapters: [5, 6, 7, 15] },
    { id: 'growth', label: '时间与成长', shortLabel: '成长', description: '管理时间与精力，积累有用的技能。', icon: 'sparkles', chapters: [3, 4, 14, 23] },
    { id: 'rights', label: '法律与职场', shortLabel: '权益', description: '认识权利与责任，处理工作中的问题。', icon: 'scale', chapters: [8, 9, 11, 19, 26] },
    { id: 'family', label: '关系与家庭', shortLabel: '关系', description: '从亲密关系到照顾家人，一起面对生活。', icon: 'users', chapters: [10, 17, 18, 20, 25, 27, 29, 30] },
    { id: 'world', label: '人生新阶段', shortLabel: '阶段', description: '面对升学、创业与远行，提前了解选择。', icon: 'compass', chapters: [12, 21, 31, 32] }
  ];
  var themeByChapter = Object.create(null);
  themes.forEach(function (theme) {
    theme.chapters.forEach(function (chapter) { themeByChapter[chapter] = theme.id; });
  });

  // Normalize an index copy only. Every original content field is preserved.
  function normalize(value) {
    var text = value == null ? '' : String(value);
    return text.normalize('NFKC').toLocaleLowerCase('en')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  }

  function collectText(value) {
    if (value == null) return '';
    if (Array.isArray(value)) return value.map(collectText).join(' ');
    if (typeof value === 'object') return Object.keys(value).map(function (key) { return collectText(value[key]); }).join(' ');
    return String(value);
  }

  function prepare(corpus) {
    corpus = corpus && typeof corpus === 'object' ? corpus : {};
    var rawChapters = Array.isArray(corpus.chapters) ? corpus.chapters : [];
    var chapterMap = Object.create(null);
    var chapters = rawChapters.map(function (chapter) {
      var enriched = Object.assign({}, chapter, { theme: themeByChapter[chapter.sectionNumber] || null });
      chapterMap[chapter.sectionNumber] = enriched;
      return enriched;
    });
    var entryMap = Object.create(null);
    var entries = (Array.isArray(corpus.entries) ? corpus.entries : []).map(function (entry, index) {
      var chapter = chapterMap[entry.sectionNumber];
      var themeId = themeByChapter[entry.sectionNumber] || null;
      var theme = themes.find(function (item) { return item.id === themeId; });
      var title = normalize(entry.title);
      var plain = normalize(entry.plain);
      var other = normalize(collectText([
        entry.cost, entry.gain, entry.evidence, entry.source, entry.note,
        entry.tags, entry.ratio, entry.rawMarkdown, entry.sourcePath,
        entry.sourceUrl, chapter && chapter.title, theme && theme.label
      ]));
      var enriched = Object.assign({}, entry, {
        theme: themeId,
        chapterTitle: chapter ? chapter.title : '',
        searchable: [title, plain, other].join(' '),
        searchFields: { title: title, plain: plain, other: other },
        sourceOrder: index
      });
      entryMap[entry.id] = enriched;
      return enriched;
    });
    var docMap = Object.create(null);
    (Array.isArray(corpus.documents) ? corpus.documents : []).forEach(function (document) {
      docMap[document.id] = document;
    });
    return { entries: entries, chapters: chapters, entryMap: entryMap, docMap: docMap, meta: corpus.meta || {} };
  }

  function selectedValues(value) {
    if (value == null || value === '' || value === 'all') return null;
    var values = Array.isArray(value) ? value : [value];
    if (!values.length || values.indexOf('all') !== -1) return null;
    return values.map(String);
  }

  function matches(value, selected) {
    return !selected || selected.indexOf(String(value)) !== -1;
  }

  function search(catalog, filters) {
    filters = filters || {};
    var tokens = Array.from(new Set(normalize(filters.query).split(' ').filter(Boolean)));
    var theme = selectedValues(filters.theme);
    var chapter = selectedValues(filters.chapter);
    if (chapter) chapter = chapter.map(function (value) { return value.replace(/^s/i, ''); });
    var evidence = selectedValues(filters.evidence);
    var money = selectedValues(filters.money);
    var time = selectedValues(filters.time);
    var will = selectedValues(filters.will);
    var ratio = selectedValues(filters.ratio);
    var saved = new Set(Array.isArray(filters.savedIds) ? filters.savedIds : []);
    var matchesFound = [];
    var entries = catalog && Array.isArray(catalog.entries) ? catalog.entries : [];
    entries.forEach(function (entry, index) {
      var tags = entry.tags || {};
      if (!matches(entry.theme, theme) || !matches(entry.sectionNumber, chapter) ||
          !matches(entry.evidence, evidence) || !matches(tags.money, money) ||
          !matches(tags.time, time) || !matches(tags.will, will) ||
          !matches(entry.ratio, ratio) || (filters.savedOnly && !saved.has(entry.id))) return;
      if (!tokens.every(function (token) { return entry.searchable.indexOf(token) !== -1; })) return;
      var score = 0;
      if (tokens.length) {
        var fields = entry.searchFields;
        tokens.forEach(function (token) {
          if (fields.title.indexOf(token) !== -1) score += 100;
          else if (fields.plain.indexOf(token) !== -1) score += 20;
          else score += 1;
        });
        var phrase = tokens.join(' ');
        if (fields.title === phrase) score += 1000;
        else if (fields.title.indexOf(phrase) !== -1) score += 100;
        if (fields.plain.indexOf(phrase) !== -1) score += 10;
      }
      matchesFound.push({ entry: entry, score: score, index: index });
    });
    if (tokens.length) matchesFound.sort(function (a, b) { return b.score - a.score || a.index - b.index; });
    return matchesFound.map(function (match) { return match.entry; });
  }

  function defaults() {
    return { savedIds: [], readIds: [], fontScale: 1, theme: 'light' };
  }

  function normalizeIds(value) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter(function (id) {
      return typeof id === 'string' && id.length > 0 && id.length <= 100;
    }))).slice(0, 10000);
  }

  function sanitizePreferences(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults();
    var fontScale = typeof value.fontScale === 'number' && Number.isFinite(value.fontScale) ? value.fontScale : 1;
    return {
      savedIds: normalizeIds(value.savedIds),
      readIds: normalizeIds(value.readIds),
      fontScale: Math.min(1.5, Math.max(0.85, fontScale)),
      theme: value.theme === 'dark' ? 'dark' : 'light'
    };
  }

  var memoryPreferences = defaults();
  var pendingStorage = null;
  var hasPendingWrite = false;

  function resolveStorage(storage) {
    if (storage !== undefined) return storage;
    try { return root.localStorage; } catch (_) { return null; }
  }

  function readPreferences(storage) {
    var target = resolveStorage(storage);
    if (!target || (hasPendingWrite && target === pendingStorage)) return sanitizePreferences(memoryPreferences);
    try {
      var raw = target.getItem(STORAGE_KEY);
      memoryPreferences = raw == null ? defaults() : sanitizePreferences(JSON.parse(raw));
    } catch (_) {
      // Private browsing, corrupt JSON, or denied storage never blocks reading.
    }
    return sanitizePreferences(memoryPreferences);
  }

  function writePreferences(preferences, storage) {
    memoryPreferences = sanitizePreferences(preferences);
    var target = resolveStorage(storage);
    try {
      if (!target) throw new Error('Storage unavailable');
      target.setItem(STORAGE_KEY, JSON.stringify(memoryPreferences));
      pendingStorage = null;
      hasPendingWrite = false;
      return true;
    } catch (_) {
      pendingStorage = target;
      hasPendingWrite = true;
      return false;
    }
  }

  root.LifeCore = {
    themes: themes,
    storageKey: STORAGE_KEY,
    prepare: prepare,
    search: search,
    readPreferences: readPreferences,
    writePreferences: writePreferences
  };
})(globalThis);
