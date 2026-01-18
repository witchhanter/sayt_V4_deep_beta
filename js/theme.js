// theme.js - Управление темой на ВСЕХ страницах (исправленный)

const ThemeManager = {
    // Инициализация темы
    init() {
        console.log('🎨 Инициализация темы...');
        
        // Загружаем тему
        this.loadTheme();
        
        // Создаем плавающую кнопку
        this.createFloatingToggle();
        
        // Настраиваем кнопки темы
        this.setupThemeButtons();
        
        // Настраиваем радио-кнопки в настройках
        this.setupThemeRadios();
        
        // Слушаем изменения системной темы (для auto режима)
        this.setupSystemThemeListener();
        
        console.log('✅ Тема инициализирована');
    },
    
    // Загрузка сохраненной темы
    loadTheme() {
        // Получаем сохраненную тему или используем светлую по умолчанию
        const savedTheme = localStorage.getItem('siteTheme') || 'light';
        
        // Применяем тему
        this.applyTheme(savedTheme);
        
        // Обновляем UI
        this.updateUI(savedTheme);
        
        console.log(`📁 Загружена тема: ${savedTheme}`);
        
        return savedTheme;
    },
    
    // Применение темы
    // applyTheme(theme) {
    //     // Устанавливаем атрибут data-theme
    //     document.documentElement.setAttribute('data-theme', theme);
        
    //     // Обновляем градиентный фон
    //     this.updateGradient(theme);
        
    //     // Сохраняем в localStorage
    //     localStorage.setItem('siteTheme', theme);
        
    //     // Сохраняем в настройках пользователя
    //     this.saveToUserSettings(theme);
    // },
    applyTheme(theme) {
    console.log(`🎨 Применение темы: ${theme}`);
    
    // Устанавливаем атрибут data-theme на html
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновляем градиентный фон
    this.updateGradient(theme);
    
    // Сохраняем в localStorage ДЛЯ ВСЕХ СТРАНИЦ
    localStorage.setItem('siteTheme', theme);
    
    // Сохраняем в настройках пользователя
    this.saveToUserSettings(theme);
    
    // Обновляем UI на текущей странице
    this.updateUI(theme);
    
    // Принудительное обновление мета-тега theme-color
    this.updateThemeColor(theme);
},
    // Обновление градиентного фона
    updateGradient(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.style.background = 'linear-gradient(-45deg, #121212, #1a1a1a, #0d1a26, #15261f)';
        } else {
            html.style.background = 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
        }
        
        html.style.backgroundSize = '400% 400%';
        html.style.animation = 'gradientMove 20s ease infinite';
    },
    
    // Переключение темы
    toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log(`🔄 Мгновенное переключение темы: ${currentTheme} → ${newTheme}`);
    
    // НЕМЕДЛЕННО применяем тему
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // НЕМЕДЛЕННО сохраняем
    localStorage.setItem('siteTheme', newTheme);
    
    // Быстрое обновление градиента
    this.updateGradient(newTheme);
    
    // Быстрое обновление UI
    this.updateUI(newTheme);
    
    // Немедленно обновляем мета-тег
    this.updateThemeColor(newTheme);
},
    
    // Обновление UI элементов
    updateUI(theme) {
        // Обновляем плавающую кнопку
        this.updateFloatingToggle(theme);
        
        // Обновляем все кнопки темы на странице
        this.updateThemeButtons(theme);
        
        // Обновляем радио-кнопки в настройках
        this.updateThemeRadios(theme);
        
        // Обновляем мета-тег theme-color
        this.updateThemeColor(theme);
    },
    
    // Обновление плавающей кнопки
    updateFloatingToggle(theme) {
        const toggle = document.getElementById('themeToggleFloating');
        if (!toggle) return;
        
        // Обновляем иконку
        toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        toggle.title = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
        
        // Обновляем tooltip
        toggle.setAttribute('aria-label', toggle.title);
    },
    
    // Обновление всех кнопок темы
    updateThemeButtons(theme) {
        const buttons = document.querySelectorAll('#themeToggle, .theme-toggle');
        
        buttons.forEach(button => {
            if (button.id === 'themeToggleFloating') return; // Плавающую кнопку уже обновили
            
            // Обновляем текст
            const textElement = button.querySelector('.theme-text');
            if (textElement) {
                textElement.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
            } else {
                button.textContent = theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная';
            }
            
            // Обновляем иконку если есть
            const iconElement = button.querySelector('.theme-icon');
            if (iconElement) {
                iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        });
    },
    
    // Обновление радио-кнопок
    updateThemeRadios(theme) {
        const radios = document.querySelectorAll('input[name="theme"]');
        
        radios.forEach(radio => {
            radio.checked = radio.value === theme;
        });
    },
    
    // Обновление мета-тега theme-color
    updateThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#121212' : '#e73c7e';
        }
    },
    
    // Создание плавающей кнопки темы
    createFloatingToggle() {
        // Проверяем, не создана ли уже кнопка
        if (document.getElementById('themeToggleFloating')) return;
        
        // Создаем кнопку
        const toggle = document.createElement('button');
        toggle.id = 'themeToggleFloating';
        toggle.className = 'theme-toggle-floating';
        toggle.setAttribute('aria-label', 'Сменить тему');
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        
        // Добавляем на страницу
        document.body.appendChild(toggle);
        
        // Устанавливаем начальную иконку
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        
        // Настраиваем обработчики
        this.setupFloatingToggle(toggle);
    },
    
    // Настройка плавающей кнопки
    setupFloatingToggle(toggle) {
        // Клик
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Клавиши клавиатуры
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Эффекты при наведении (только на десктопе)
        if (window.innerWidth > 768) {
            toggle.addEventListener('mouseenter', () => {
                toggle.style.transform = 'scale(1.1) rotate(10deg)';
            });
            
            toggle.addEventListener('mouseleave', () => {
                toggle.style.transform = 'scale(1) rotate(0deg)';
            });
        }
        
        // Эффект нажатия
        toggle.addEventListener('mousedown', () => {
            toggle.style.transform = 'scale(0.95)';
        });
        
        toggle.addEventListener('mouseup', () => {
            toggle.style.transform = 'scale(1)';
        });
    },
    
    // Настройка кнопок темы на странице
    setupThemeButtons() {
        const buttons = document.querySelectorAll('#themeToggle:not(#themeToggleFloating), .theme-toggle');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        });
    },
    
    // Настройка радио-кнопок в настройках
    setupThemeRadios() {
        const radios = document.querySelectorAll('input[name="theme"]');
        
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                const theme = radio.value;
                
                if (theme === 'auto') {
                    // Автоматическое определение темы системы
                    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    this.applyTheme(systemIsDark ? 'dark' : 'light');
                } else {
                    this.applyTheme(theme);
                }
                
                this.updateUI(theme);
            });
        });
    },
    
    // Слушатель изменения системной темы
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Проверяем, используется ли auto режим
            const currentRadio = document.querySelector('input[name="theme"]:checked');
            if (currentRadio && currentRadio.value === 'auto') {
                this.applyTheme(e.matches ? 'dark' : 'light');
                this.updateUI(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    // Сохранение в настройках пользователя
    saveToUserSettings(theme) {
        try {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            settings.theme = theme;
            settings.themeUpdated = new Date().toISOString();
            localStorage.setItem('userSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Ошибка сохранения настроек темы:', error);
        }
    },
    
    // Анимация переключения темы
    playToggleAnimation() {
        // Минимальная анимация для обратной связи
        const toggle = document.getElementById('themeToggleFloating');
        if (toggle) {
            toggle.style.transform = 'scale(1.2)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 200);
        }
    },
    
    // Получение текущей темы
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme');
    },
    
    // Проверка, используется ли темная тема
    isDark() {
        return this.getCurrentTheme() === 'dark';
    },
    
    // Сброс темы к значениям по умолчанию
    reset() {
        localStorage.removeItem('siteTheme');
        this.init();
    }
};

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// Экспорт для использования в других скриптах
window.ThemeManager = ThemeManager;
window.theme = ThemeManager; // Для обратной совместимости