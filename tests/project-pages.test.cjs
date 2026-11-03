const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { renderPage, projectIds, projects, resources } = require('../tools/build-project-pages.cjs');

const root = path.join(__dirname, '..');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[ch]);

test('Every poster-backed project has exactly one generated, directly addressable page', () => {
  assert.deepEqual([...projectIds].sort(), ['clinical-nlp', 'moe-dugan', 'perfrunbench']);
  for (const id of projectIds) {
    const resource = resources[id][0];
    assert.equal(resource.pageUrl, `projects/${id}/`);
    const file = path.join(root, resource.pageUrl, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    assert.equal(html.replace(/\r\n/g, '\n'), renderPage(id), `${id}: regenerate the committed static page`);
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="https://xuwwwww.github.io/${resource.pageUrl}">`));
    assert.ok(html.includes(`property="og:url" content="https://xuwwwww.github.io/${resource.pageUrl}"`));
    assert.doesNotMatch(html, /<iframe\b|src="[^\"]*scripts\.js|data-project=/);
    for (const language of ['en', 'zh']) {
      const data = projects[id][language];
      for (const text of [data.title, data.summary, ...data.sections.flatMap(s => s.bullets || [])]) {
        assert.ok(html.includes(escape(text)), `${id}: static ${language} content must match the portfolio`);
      }
    }
  }
});

test('All local page links, assets, and anchors resolve without an application router', () => {
  for (const id of projectIds) {
    const directory = path.join(root, 'projects', id);
    const html = renderPage(id);
    for (const [, attribute] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:)/.test(attribute)) continue;
      if (attribute.startsWith('#')) {
        assert.ok(html.includes(`id="${attribute.slice(1)}"`));
        continue;
      }
      const relative = attribute.split(/[?#]/)[0];
      const target = path.resolve(directory, relative);
      assert.ok(target.startsWith(root + path.sep));
      assert.ok(fs.existsSync(target), `${id}: missing ${relative}`);
      if (fs.statSync(target).isDirectory()) assert.ok(fs.existsSync(path.join(target, 'index.html')));
    }
    for (const [, attributes] of html.matchAll(/<a\b([^>]+)>/g)) {
      if (attributes.includes('target="_blank"')) assert.match(attributes, /rel="noopener"/);
    }
  }
});

test('Each poster preview preserves its image dimensions and opens the matching original PDF', () => {
  for (const id of projectIds) {
    const html = renderPage(id);
    const [, src, width, height] = html.match(/<img src="([^"]+)" width="(\d+)" height="(\d+)"/);
    const image = fs.readFileSync(path.resolve(root, 'projects', id, src));
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.equal(image.readUInt32BE(16), Number(width));
    assert.equal(image.readUInt32BE(20), Number(height));
    assert.equal(Number(height), 1800);
    const pdf = resources[id][0].url;
    assert.ok(html.includes(`class="poster-image" href="../../${pdf}"`));
    assert.ok(fs.readFileSync(path.join(root, pdf)).subarray(0, 5).equals(Buffer.from('%PDF-')));
  }
});

test('Language control updates visible language, document title, and accessible label in both directions', () => {
  let click;
  const button = { hidden: true, addEventListener: (event, handler) => { assert.equal(event, 'click'); click = handler; }, setAttribute(name, value) { this[name] = value; } };
  const label = {};
  const classes = new Set(['lang-en']);
  const document = {
    documentElement: { lang: 'en' },
    body: {
      dataset: { titleEn: 'English project | Louis Wu', titleZh: '中文專案 | Louis 吳定栩' },
      classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    },
    getElementById: id => id === 'project-language' ? button : label,
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'project-pages.js'), 'utf8'), { document });
  assert.equal(button.hidden, false);
  click();
  assert.equal(document.documentElement.lang, 'zh-TW');
  assert.equal(document.title, document.body.dataset.titleZh);
  assert.deepEqual([...classes], ['lang-zh-TW']);
  assert.equal(label.textContent, 'English');
  assert.equal(button['aria-label'], 'Switch to English');
  click();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(document.title, document.body.dataset.titleEn);
  assert.deepEqual([...classes], ['lang-en']);
  assert.equal(label.textContent, '中文');
  assert.equal(button['aria-label'], 'Switch to Chinese');
});

test('All generated and shared project files preserve valid UTF-8', () => {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const files = ['project-pages.css', 'project-pages.js', 'tools/build-project-pages.cjs', ...projectIds.map(id => `projects/${id}/index.html`)];
  for (const file of files) assert.ok(!decoder.decode(fs.readFileSync(path.join(root, file))).includes('\uFFFD'), file);
});
