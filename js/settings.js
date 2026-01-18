// settings.js - Управление настройками (упрощенный, без уведомлений)

const SettingsManager = {
    // Инициализация настроек
    init() {
        console.log('⚙️ Инициализация настроек...');
        
        // Загружаем сохраненные настройки
        this.loadSettings();
        
        // Настраиваем панель настроек
        this.setupSettingsPanel();
        
        // Настраиваем кнопки настроек
        this.setupSettingsButtons();
        
        console.log('✅ Настройки инициализированы');
    },
    
    // Загрузка сохраненных настроек
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.applySettings(settings);
                console.log('📁 Загружены настройки:', settings);
            } else {
                // Настройки по умолчанию
                const defaultSettings = this.getDefaultSettings();
                this.applySettings(defaultSettings);
                this.saveSettings(defaultSettings);
                console.log('📁 Созданы настройки по умолчанию');
            }
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            this.applySettings(this.getDefaultSettings());
        }
    },
    
    // Настройки по умолчанию
    getDefaultSettings() {
        return {
            theme: 'light',
            animations: true,
            timezone: 'auto',
            settingsVersion: '1.0',
            createdAt: new Date().toISOString()
        };
    },
    
    // Применение настроек
    applySettings(settings) {
        // Тема (уже применяется через theme.js)
        if (settings.theme) {
            localStorage.setItem('siteTheme', settings.theme);
        }
        
        // Анимации
        if (settings.animations !== undefined) {
            this.toggleAnimations(settings.animations);
        }
        
        // Обновляем UI элементов настроек
        this.updateSettingsUI(settings);
    },
    
    // Обновление UI настроек
    updateSettingsUI(settings) {
        // Тема
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            if (radio.value === settings.theme) {
                radio.checked = true;
            }
        });
        
        // Анимации
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = settings.animations !== false;
        }
        
        // Часовой пояс
        const timezoneSelect = document.getElementById('timezoneSelect');
        if (timezoneSelect && settings.timezone) {
            timezoneSelect.value = settings.timezone;
        }
    },
    
    // Включение/отключение анимаций
    // Включение/отключение анимаций (ИСПРАВЛЕННАЯ)
toggleAnimations(enabled) {
    console.log(`🎬 Анимации: ${enabled ? 'включены' : 'выключены'}`);
    
    if (enabled) {
        // Включить все анимации
        document.documentElement.style.removeProperty('--animation-speed');
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
            el.style.transition = '';
        });
    } else {
        // Отключить все анимации
        document.documentElement.style.setProperty('--animation-speed', '0s');
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transition = 'none';
        });
    }
    
    // Сохраняем в настройках
    const settings = this.getCurrentSettings();
    settings.animations = enabled;
    this.saveSettings(settings);
    
    // Немедленное применение
    if (window.AppAnimations) {
        if (enabled) {
            window.AppAnimations.restart();
        }
    }
},
    
    // Настройка панели настроек
    setupSettingsPanel() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        if (!panel) return;
        
        // Создаем оверлей если его нет
        if (!overlay) {
            this.createSettingsOverlay();
        }
        
        // Настраиваем кнопку закрытия
        const closeBtn = panel.querySelector('.settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }
        
        // Настраиваем сохранение настроек
        const saveBtn = panel.querySelector('#saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentSettings());
        }
        
        // Настраиваем сброс настроек
        const resetBtn = panel.querySelector('#resetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
        
        // Настраиваем переключатели
        const toggles = panel.querySelectorAll('input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                // Реальное время обновление настроек
                const settings = this.getCurrentSettings();
                
                if (toggle.id === 'animationsToggle') {
                    settings.animations = toggle.checked;
                    this.toggleAnimations(toggle.checked);
                }
                
                // Автосохранение при изменении
                this.saveSettings(settings);
            });
        });
        
        // Настраиваем выбор темы
        const themeRadios = panel.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const settings = this.getCurrentSettings();
                settings.theme = radio.value;
                
                if (radio.value === 'auto') {
                    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    ThemeManager.applyTheme(systemIsDark ? 'dark' : 'light');
                } else {
                    ThemeManager.applyTheme(radio.value);
                }
                
                this.saveSettings(settings);
            });
        });
        
        // Настраиваем выбор часового пояса
        const timezoneSelect = panel.querySelector('#timezoneSelect');
        if (timezoneSelect) {
            timezoneSelect.addEventListener('change', () => {
                const settings = this.getCurrentSettings();
                settings.timezone = timezoneSelect.value;
                this.saveSettings(settings);
                
                // Обновляем время на странице
                if (window.updateTime) {
                    window.updateTime();
                }
            });
        }
    },
    
    // Создание оверлея для настроек
    createSettingsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'settingsOverlay';
        overlay.className = 'settings-overlay';
        
        overlay.addEventListener('click', () => this.closeSettings());
        
        // Добавляем перед панелью настроек
        const panel = document.getElementById('settingsPanel');
        if (panel && panel.parentNode) {
            panel.parentNode.insertBefore(overlay, panel);
        } else {
            document.body.appendChild(overlay);
        }
    },
    
    // Настройка кнопок открытия настроек
    setupSettingsButtons() {
        const settingsButtons = document.querySelectorAll('#settingsBtn, .settings-btn');
        
        settingsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSettings();
            });
        });
    },
    
    // Открытие панели настроек
    openSettings() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        if (panel) {
            panel.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Фокус на первом элементе для доступности
            setTimeout(() => {
                const firstFocusable = panel.querySelector('button, input, select');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);
        }
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Закрытие по клавише ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    },
    
    // Закрытие панели настроек
    closeSettings() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        if (panel) {
            panel.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        if (overlay) {
            overlay.classList.remove('active');
        }
    },
    
    // Получение текущих настроек
    getCurrentSettings() {
        try {
            const saved = localStorage.getItem('userSettings');
            return saved ? JSON.parse(saved) : this.getDefaultSettings();
        } catch (error) {
            console.error('Ошибка получения настроек:', error);
            return this.getDefaultSettings();
        }
    },
    
    // Сохранение текущих настроек
    saveCurrentSettings() {
        const settings = {
            theme: document.querySelector('input[name="theme"]:checked')?.value || 'light',
            animations: document.getElementById('animationsToggle')?.checked ?? true,
            timezone: document.getElementById('timezoneSelect')?.value || 'auto',
            updatedAt: new Date().toISOString()
        };
        
        this.saveSettings(settings);
        this.showNotification('Настройки сохранены!');
        this.closeSettings();
    },
    
    // Сохранение настроек
    saveSettings(settings) {
        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            this.applySettings(settings);
            console.log('💾 Настройки сохранены:', settings);
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
        }
    },
    
    // Сброс настроек
    resetSettings() {
        if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
            const defaultSettings = this.getDefaultSettings();
            this.saveSettings(defaultSettings);
            this.applySettings(defaultSettings);
            this.showNotification('Настройки сброшены');
            this.closeSettings();
        }
    },
    
    // Показать уведомление
    showNotification(message, duration = 3000) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'settings-notification';
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        // Стили
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 12px 20px;
            border-radius: 10px;
            color: #333;
            font-size: 14px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            border: 1px solid rgba(0,0,0,0.1);
            max-width: 300px;
        `;
        
        // Для темной темы
        if (ThemeManager.isDark()) {
            notification.style.background = 'rgba(30, 30, 30, 0.95)';
            notification.style.color = 'rgba(255, 255, 255, 0.95)';
            notification.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        document.body.appendChild(notification);
        
        // Автоудаление
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    SettingsManager.init();
});

// Экспорт для использования
window.SettingsManager = SettingsManager;