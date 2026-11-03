const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');
const registryStart = source.indexOf('const PROJECTS =');
const registryEnd = source.indexOf('/* ---------------- Language Switch', registryStart);
assert.ok(registryStart >= 0 && registryEnd > registryStart);
const { details, resources } = new Function(`${source.slice(registryStart, registryEnd)}
  return { details: DETAILS, resources: DETAIL_RESOURCE_LINKS };`)();

test('PerfRunbench uses the same project card and modal entry as its peers', () => {
  const grid = html.match(/<div class="project-grid">([\s\S]*?)<\/div>\s*<h3 class="subsection-title">/)[1];
  const cards = [...grid.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, 5);
  assert.ok(cards.every(([, attributes]) => /class="project-card"/.test(attributes)));
  const matches = cards.filter(([, attributes]) => /data-project="perfrunbench"/.test(attributes));
  assert.equal(matches.length, 1);
  const [, attributes, body] = matches[0];
  assert.match(attributes, /tabindex="0"/);
  assert.match(attributes, /role="button"/);
  assert.match(attributes, /id="ai-featured"/);
  for (const name of ['project-card-top', 'project-title', 'project-org', 'project-summary', 'tag-row', 'project-cta']) {
    assert.ok(body.includes(`class="${name}"`));
  }
  assert.doesNotMatch(body, /<(?:a|iframe)\b/);
  assert.doesNotMatch(html, /class="featured-portfolio"/);
  for (const [, attributes] of cards) {
    const id = attributes.match(/data-project="([^"]+)"/)[1];
    assert.ok(details[id]?.en && details[id]?.zh, `Bilingual modal content for ${id}`);
  }
});

test('Homepage poster actions stay inside the existing project modal', () => {
  assert.equal(resources.perfrunbench.length, 1);
  const poster = resources.perfrunbench[0];
  assert.equal(poster.url, 'assets/research/perfrunbench-poster.pdf');
  assert.ok(fs.readFileSync(path.join(root, poster.url)).subarray(0, 5).equals(Buffer.from('%PDF-')));
  assert.doesNotMatch(html, /perfrunbench-poster\.pdf|<iframe\b/);
  for (const lang of ['en', 'zh']) {
    const links = details.perfrunbench[lang].sections.flatMap(section => section.links || []);
    assert.ok(links.some(link => link.url === 'https://github.com/xuwwwww/PerfRunbench'));
    assert.ok(links.some(link => link.url === 'ai-systems.html'));
  }
  assert.equal(resources['moe-dugan'][0].url, 'assets/research/CS_poster.pdf');
  assert.equal(resources['clinical-nlp'][0].url, 'assets/research/EE_poster.pdf');
});

test('Opening each poster project keeps its preview and adds its standalone page in either language', () => {
  const start = source.indexOf('function renderDetail(id) {');
  const end = source.indexOf('function openDetail(', start);
  assert.ok(start >= 0 && end > start);
  const createElement = tag => ({ tag, children: [], appendChild(child) { this.children.push(child); } });
  for (const lang of ['en', 'zh-TW']) {
    for (const id of ['perfrunbench', 'moe-dugan', 'clinical-nlp', 'emg']) {
      const nodes = Object.fromEntries(['modalPeriod', 'modalTitle', 'modalOrg', 'modalTags', 'modalSummary', 'modalSections']
        .map(name => [name, createElement('div')]));
      new Function('DETAILS', 'DETAIL_RESOURCE_LINKS', 'currentLang', 'document', ...Object.keys(nodes),
        `${source.slice(start, end)}\nrenderDetail('${id}');`)(
        details, resources, lang, { createElement }, ...Object.values(nodes));
      assert.equal(nodes.modalTitle.textContent, details[id][lang === 'en' ? 'en' : 'zh'].title);
      const descendants = [];
      const collect = node => { descendants.push(node); node.children.forEach(collect); };
      collect(nodes.modalSections);
      const frames = descendants.filter(node => node.tag === 'iframe');
      const resource = resources[id]?.[0];
      assert.equal(frames.length, resource ? 1 : 0);
      if (!resource) {
        assert.ok(!descendants.some(node => node.href?.startsWith('projects/')));
        continue;
      }
      assert.equal(frames[0].src, `${resource.url}#page=1&view=FitH`);
      const pageLink = descendants.find(node => node.tag === 'a' && node.href === resource.pageUrl);
      assert.ok(pageLink);
      assert.equal(pageLink.textContent, lang === 'en' ? 'Open project page' : '開啟專案獨立頁');
      const link = descendants.find(node => node.tag === 'a' && node.href === resource.url);
      assert.ok(link);
      assert.equal(link.target, '_blank');
      assert.ok(link.textContent.includes(lang === 'en' ? 'Open full' : '完整開啟'));
    }
  }
});

test('Both language entries show the requested TOEFL score', () => {
  assert.match(html, /English — TOEFL iBT 5\.0 \(100\/120 equivalent\)/);
  assert.match(html, /英文：托福 iBT 5\.0（換算 100\/120）/);
  assert.doesNotMatch(html, /TOEFL 95|托福 95/);
});

test('Updated pages load the same script revision and retain valid UTF-8', () => {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  for (const file of ['index.html', 'ai-systems.html', 'scripts.js', 'styles.css']) {
    const text = decoder.decode(fs.readFileSync(path.join(root, file)));
    assert.ok(!text.includes('\uFFFD'), file);
    if (file.endsWith('.html')) {
      assert.match(text, /scripts\.js\?v=project-pages-20261103-r17/);
      assert.match(text, /styles\.css\?v=snake-size-20261102-r15/);
    }
  }
});
