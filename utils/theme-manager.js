class ThemeManager {
    constructor() {
        this.themes = [
            'default', 'japanese', 'cozy', 'lofi', 'forest', 'space',
            'minimalist', 'gaming', 'retro', 'spring', 'summer',
            'autumn', 'winter', 'ghibli', 'cyberpunk', 'harry-potter'
        ];
        this.currentTheme = localStorage.getItem('studyzen_theme') || 'default';
        this.loadTheme(this.currentTheme);
    }

    loadTheme(themeName) {
        // Remove existing theme styles
        document.querySelectorAll('link[data-theme]').forEach(link => link.remove());
        
        // Load theme CSS
        if (themeName !== 'default') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `themes/${themeName}.css`;
            link.dataset.theme = themeName;
            document.head.appendChild(link);
        }
        
        this.currentTheme = themeName;
        localStorage.setItem('studyzen_theme', themeName);
        
        // Update theme in user profile if logged in
        if (authManager.isLoggedIn()) {
            authManager.updateProfile({ theme: themeName });
        }
        
        // Show notification
        showNotification(`Theme changed to: ${themeName.replace('-', ' ')}`, 'info');
    }

    getThemes() {
        return this.themes;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    showThemeSelector() {
        const modal = document.getElementById('theme-modal');
        const themeGrid = modal.querySelector('.theme-grid');
        
        // Clear existing options
        themeGrid.innerHTML = '';
        
        // Add theme options
        this.themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = 'theme-option';
            option.dataset.theme = theme;
            option.textContent = theme.replace('-', ' ');
            
            if (theme === this.currentTheme) {
                option.style.background = '#667eea';
                option.style.color = 'white';
            }
            
            option.addEventListener('click', () => {
                this.loadTheme(theme);
                modal.classList.add('hidden');
            });
            
            themeGrid.appendChild(option);
        });
        
        modal.classList.remove('hidden');
    }
}

// Create global theme manager
const themeManager = new ThemeManager();
