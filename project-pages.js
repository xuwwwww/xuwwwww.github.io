(() => {
  const button = document.getElementById('project-language');
  const label = document.getElementById('project-language-label');
  if (!button || !label) return;

  button.hidden = false;
  button.addEventListener('click', () => {
    const chinese = document.documentElement.lang !== 'zh-TW';
    document.documentElement.lang = chinese ? 'zh-TW' : 'en';
    document.body.classList.toggle('lang-en', !chinese);
    document.body.classList.toggle('lang-zh-TW', chinese);
    document.title = chinese ? document.body.dataset.titleZh : document.body.dataset.titleEn;
    label.textContent = chinese ? 'English' : '中文';
    label.lang = chinese ? 'en' : 'zh-TW';
    button.setAttribute('aria-label', chinese ? 'Switch to English' : 'Switch to Chinese');
  });
})();
