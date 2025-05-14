const langSwitchButton = document.getElementById('lang-switch');
const bodyElement = document.body;
const htmlElement = document.documentElement;
let currentLang = localStorage.getItem('preferredLang') || 'en';

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
}

// Initialize language
setLanguage(currentLang);

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