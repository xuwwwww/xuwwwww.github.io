const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'scripts.js'), 'utf8');
const start = source.indexOf('const PROJECTS =');
const end = source.indexOf('/* ---------------- Language Switch', start);
if (start < 0 || end <= start) throw new Error('Project registry not found');
const { projects, resources } = new Function(`${source.slice(start, end)}
  return { projects: PROJECTS, resources: DETAIL_RESOURCE_LINKS };`)();
const origin = 'https://xuwwwww.github.io/';
const revision = '20261103-r1';
const names = { perfrunbench: 'PerfRunbench', 'moe-dugan': 'MoE-DUGAN', 'clinical-nlp': 'Clinical NLP / RAG' };
const escape = value => String(value).replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[ch]);
const bilingual = (en, zh) => `<span class="lang-en" lang="en">${escape(en)}</span><span class="lang-zh-TW" lang="zh-TW">${escape(zh)}</span>`;
const href = url => /^(https?:|mailto:)/.test(url) ? escape(url) : `../../${escape(url)}`;
const projectIds = Object.keys(resources).filter(id => resources[id].some(link => link.pageUrl));

function sections(data) {
  return data.sections.map(section => `<section>
            <h2>${escape(section.heading)}</h2>${section.bullets ? `
            <ul>${section.bullets.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : ''}${section.stack ? `
            <ul class="project-tags">${section.stack.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : ''}${section.links ? `
            <div class="text-links">${section.links.map(link => `<a href="${href(link.url)}">${escape(link.label)}</a>`).join('')}</div>` : ''}
          </section>`).join('\n          ');
}

function renderPage(id) {
  const project = projects[id];
  const resource = resources[id].find(link => link.pageUrl);
  if (!project?.en || !project.zh || !resource) throw new Error(`Incomplete project: ${id}`);
  const preview = `assets/research/${id}-preview.png`;
  const image = fs.readFileSync(path.join(root, preview));
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  const canonical = new URL(resource.pageUrl, origin).href;
  const title = `${project.en.title} | Louis Wu`;
  const pdf = href(resource.url);
  return `<!DOCTYPE html>
<!-- Generated from the portfolio registry by tools/build-project-pages.cjs. -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(project.en.summary)}">
  <meta name="author" content="Louis Wu (DingXu Wu)">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(project.en.summary)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${new URL(preview, origin).href}">
  <meta property="og:image:alt" content="${escape(project.en.title)} research poster">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600;700&family=Sora:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../project-pages.css?v=${revision}">
  <script src="../../project-pages.js?v=${revision}" defer></script>
</head>
<body class="lang-en" data-title-en="${escape(title)}" data-title-zh="${escape(project.zh.title)} | Louis 吳定栩">
  <a class="skip-link" href="#project-content">${bilingual('Skip to content', '跳至主要內容')}</a>
  <header class="project-header">
    <a class="project-brand" href="../../index.html"><span class="brand-symbol" aria-hidden="true">lw.</span><span>Louis Wu</span></a>
    <nav aria-label="Primary">
      <a href="../../index.html#projects">${bilingual('All projects', '所有專案')}</a>
      <button id="project-language" type="button" aria-label="Switch to Chinese" hidden>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4.5" ry="9"/><path d="M3 12h18"/></svg>
        <span id="project-language-label" lang="zh-TW">中文</span>
      </button>
    </nav>
  </header>
  <main id="project-content" tabindex="-1">
    <article>
      <header class="project-intro">
        <p class="project-context">${bilingual('Research project', '研究專案')}<span aria-hidden="true">/</span>${bilingual(project.en.period, project.zh.period)}</p>
        <div class="intro-columns">
          <div>
            <h1>${bilingual(project.en.title, project.zh.title)}</h1>
            <p class="project-affiliation">${bilingual(project.en.org, project.zh.org)}</p>
            <p class="project-owner">${bilingual('From the portfolio of Louis (DingXu) Wu', 'Louis 吳定栩的專案作品集')}</p>
          </div>
          <div class="intro-summary">
            <p>${bilingual(project.en.summary, project.zh.summary)}</p>
            <div class="project-actions">
              <a class="action-primary" href="#poster">${bilingual('View poster', '查看海報')}</a>
              <a class="action-secondary" href="${pdf}" target="_blank" rel="noopener">${bilingual('Open full PDF', '開啟完整 PDF')}</a>
            </div>
          </div>
        </div>
        <ul class="project-tags">${project.en.tags.map((tag, i) => `<li>${bilingual(tag, project.zh.tags[i] || tag)}</li>`).join('')}</ul>
      </header>
      <div class="project-body">
        <div class="project-narrative">
          <div class="lang-en" lang="en">
          ${sections(project.en)}
          </div>
          <div class="lang-zh-TW" lang="zh-TW">
          ${sections(project.zh)}
          </div>
        </div>
        <section class="project-poster" id="poster" aria-labelledby="poster-title">
          <div class="poster-heading">
            <h2 id="poster-title">${bilingual('Research poster', '研究海報')}</h2>
            <span>PDF</span>
          </div>
          <figure>
            <a class="poster-image" href="${pdf}" target="_blank" rel="noopener" aria-label="Open ${escape(names[id])} poster PDF in a new tab">
              <img src="../../${preview}" width="${width}" height="${height}" alt="${escape(project.en.title)}: research poster with methods, figures, and results." decoding="async">
            </a>
            <figcaption>${bilingual('Select the poster to open the original PDF at full resolution.', '點選海報即可開啟原始 PDF，查看完整解析度。')}</figcaption>
          </figure>
        </section>
      </div>
    </article>
    <nav class="related-projects" aria-labelledby="related-title">
      <h2 id="related-title">${bilingual('More research', '其他研究')}</h2>
      <div>${projectIds.filter(other => other !== id).map(other => `<a href="../${other}/"><span>${escape(names[other])}</span><span class="related-subject">${escape(projects[other].en.tags.slice(0, 2).join(' / '))}</span></a>`).join('')}</div>
    </nav>
  </main>
  <footer class="project-footer"><span>Louis Wu <span class="footer-name">/ 吳定栩</span></span><a href="../../index.html#projects">${bilingual('Back to portfolio', '回到作品集')}</a></footer>
</body>
</html>
`;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  for (const id of projectIds) {
    const output = path.join(root, resources[id].find(link => link.pageUrl).pageUrl, 'index.html');
    const html = renderPage(id);
    if (check) {
      if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8').replace(/\r\n/g, '\n') !== html) {
        throw new Error(`Stale project page: ${id}. Run node tools/build-project-pages.cjs`);
      }
    } else {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, html, 'utf8');
    }
    console.log(`${check ? 'Checked' : 'Generated'} ${path.relative(root, output)}`);
  }
}

module.exports = { renderPage, projectIds, projects, resources };
