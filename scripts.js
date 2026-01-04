const langSwitchButton = document.getElementById('lang-switch');
const bodyElement = document.body;
const htmlElement = document.documentElement;
let currentLang = localStorage.getItem('preferredLang') || 'en';

function updateCopyTooltips(lang) {
  const triggers = document.querySelectorAll('.copy-trigger');
  triggers.forEach((el) => {
    const tooltip = lang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
    el.dataset.tooltip = tooltip || '';
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function attachCopyHandlers() {
  const triggers = document.querySelectorAll('.copy-trigger');
  triggers.forEach((el) => {
    if (el.dataset.copyBound === '1') return;
    el.dataset.copyBound = '1';

    el.addEventListener('click', async (e) => {
      // Allow users to open mail client with modifiers
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      const textToCopy = el.dataset.copy || el.textContent || '';
      try {
        await copyTextToClipboard(textToCopy);
        const copiedMsg = currentLang === 'en' ? el.dataset.copiedEn : el.dataset.copiedZh;
        const normalMsg = currentLang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;

        el.dataset.tooltip = copiedMsg || '';
        el.classList.add('show-tooltip');
        setTimeout(() => {
          el.dataset.tooltip = normalMsg || '';
          el.classList.remove('show-tooltip');
        }, 900);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLang', lang);
  bodyElement.classList.remove('lang-en', 'lang-zh-TW');
  bodyElement.classList.add(`lang-${lang}`);
  langSwitchButton.textContent = lang === 'en' ? '\u4E2D\u6587' : 'English';
  htmlElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-TW');
  // Update page title dynamically
  try {
    const newTitle = document.querySelector(`title.lang-${lang}`).textContent;
    document.title = newTitle;
  } catch (e) {
    console.error("Error updating title:", e);
  }

  updateCopyTooltips(lang);
}

// Initialize language
setLanguage(currentLang);
attachCopyHandlers();

// Add click event listener
langSwitchButton.addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'zh-TW' : 'en';

  // Add class for button click animation
  langSwitchButton.classList.add('active-switch');
  setTimeout(() => {
    langSwitchButton.classList.remove('active-switch');
  }, 300); // Duration matches CSS animation for button

  // Start fading out the body and changing html background
  htmlElement.classList.add('page-lang-switching');
  bodyElement.classList.add('page-lang-switching');

  // After elements start transitioning, switch language
  setTimeout(() => {
    setLanguage(newLang);
    // After language is set, start fading body back in and revert html background
    setTimeout(() => {
        htmlElement.classList.remove('page-lang-switching');
        bodyElement.classList.remove('page-lang-switching');
    }, 50); // Short delay before fade-in
  }, 280); // Switch language just before full fade-out (0.3s transition duration)
}); 