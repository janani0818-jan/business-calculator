const THEME_KEY = 'biz_calc_pro_theme';

const themeModule = {
    init() {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'theme-light';
        this.setTheme(savedTheme);
        this.setupEventListeners();
    },

    setTheme(themeName) {
        document.body.className = `${themeName} bg-app text-primary min-h-screen font-sans`;
        localStorage.setItem(THEME_KEY, themeName);
        
        // Update UI 
        this.updateThemeUI(themeName);
    },

    toggleTheme() {
        const currentTheme = document.body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
        const newTheme = currentTheme === 'theme-light' ? 'theme-dark' : 'theme-light';
        this.setTheme(newTheme);
    },

    setupEventListeners() {
        //  button in sidebar / footer
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Quick theme in Dashboard actions 
        const quickThemeBtn = document.getElementById('quickThemeToggle');
        if (quickThemeBtn) {
            quickThemeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // theme pickers cards
        const btnLightSelect = document.getElementById('themePickLight');
        const btnDarkSelect = document.getElementById('themePickDark');

        if (btnLightSelect) {
            btnLightSelect.addEventListener('click', () => this.setTheme('theme-light'));
        }
        if (btnDarkSelect) {
            btnDarkSelect.addEventListener('click', () => this.setTheme('theme-dark'));
        }
    },

    updateThemeUI(themeName) {
        const themeText = document.getElementById('themeText');
        const sunIcon = document.getElementById('themeIconSun');
        const moonIcon = document.getElementById('themeIconMoon');

        const isLight = themeName === 'theme-light';

        if (themeText) {
            themeText.textContent = isLight ? 'Light Theme' : 'Dark Theme';
        }

        if (sunIcon && moonIcon) {
            if (isLight) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }

        //  Card states 
        const pickLightCard = document.getElementById('themePickLight');
        const pickDarkCard = document.getElementById('themePickDark');
        const indLight = document.getElementById('indicatorLight');
        const indDark = document.getElementById('indicatorDark');

        if (pickLightCard && pickDarkCard && indLight && indDark) {
            if (isLight) {
                pickLightCard.classList.add('active');
                pickDarkCard.classList.remove('active');
                indLight.classList.remove('hidden-icon');
                indDark.classList.add('hidden-icon');
            } else {
                pickLightCard.classList.remove('active');
                pickDarkCard.classList.add('active');
                indLight.classList.add('hidden-icon');
                indDark.classList.remove('hidden-icon');
            }
        }
    }
};

// Auto boot ehile on load
themeModule.init();
window.themeModule = themeModule;
