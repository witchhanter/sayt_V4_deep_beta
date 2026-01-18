// animations.js - Единая система анимаций для ВСЕХ страниц

const Animations = {
    // Инициализация всех анимаций
    init() {
        console.log('🚀 Инициализация анимаций...');
        
        // Запускаем анимации после загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
        
        // Реинициализация при изменении размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Отключение анимаций при предпочтении reduced-motion
        this.handleMotionPreference();
    },
    
    // Основной запуск анимаций
    start() {
        // Принудительный запуск анимаций с небольшой задержкой
setTimeout(() => {
    // Анимация всех элементов с классом fade-up
    document.querySelectorAll('.fade-up').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('show');
        }, 100 + (index * 50));
    });
    
    // Анимация форм
    document.querySelectorAll('form, .glass-container').forEach((form, index) => {
        setTimeout(() => {
            form.style.opacity = '1';
            form.style.transform = 'translateY(0) scale(1)';
        }, 200 + (index * 100));
    });
}, 100);
        this.animateFadeUpElements();
        this.animateForms();
        this.animateCards();
        this.animateButtons();
        this.animateHeaders();
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        
        console.log('✅ Анимации запущены');
    },
    
    // Анимация элементов с .fade-up
    animateFadeUpElements() {
        const elements = document.querySelectorAll('.fade-up');
        
        if (elements.length === 0) return;
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Задержка для последовательного появления
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('animated');
            }, 100 + (index * 50));
        });
    },
    
    // Анимация форм
    animateForms() {
        const forms = document.querySelectorAll('form, .form-container, .login-form, .register-form, .password-form');
        
        forms.forEach((form, index) => {
            form.style.opacity = '0';
            form.style.transform = 'translateY(40px) scale(0.98)';
            form.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0) scale(1)';
            }, 200 + (index * 100));
        });
    },
    
    // Анимация карточек
    animateCards() {
        const cards = document.querySelectorAll('.grid-card, .card, .feature-card');
        
        if (cards.length === 0) return;
        
        // Для сетки карточек (как на главной)
        const gridContainer = document.querySelector('.grid-table');
        if (gridContainer) {
            this.animateGridCards(cards);
        } else {
            this.animateIndividualCards(cards);
        }
    },
    
    // Анимация карточек в сетке
    animateGridCards(cards) {
        const columns = this.getGridColumns();
        
        cards.forEach((card, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const delay = 300 + (row * 120) + (col * 60);
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, delay);
        });
    },
    
    // Анимация одиночных карточек
    animateIndividualCards(cards) {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 300 + (index * 100));
        });
    },
    
    // Получение количества колонок в сетке
    getGridColumns() {
        const grid = document.querySelector('.grid-table');
        if (!grid) return 3;
        
        const style = window.getComputedStyle(grid);
        const template = style.gridTemplateColumns;
        
        if (template === 'none') {
            return window.innerWidth < 768 ? 2 : 3;
        }
        
        return template.split(' ').length;
    },
    
    // Анимация кнопок
    animateButtons() {
        const buttons = document.querySelectorAll('.btn, .nav-btn, .logout-btn, .settings-btn, .submit-btn');
        
        buttons.forEach((btn, index) => {
            btn.style.opacity = '0.8';
            btn.style.transform = 'scale(0.95)';
            btn.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }, 200 + (index * 30));
            
            // Эффекты при взаимодействии
            this.setupButtonEffects(btn);
        });
    },
    
    // Эффекты для кнопок
    setupButtonEffects(button) {
        // Нажатие
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        // Для touch устройств
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Эффект наведения (только для десктопа)
        if (window.innerWidth > 768) {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '';
            });
        }
    },
    
    // Анимация заголовков
    animateHeaders() {
        const headers = document.querySelectorAll('h1, h2, h3, .welcome-section');
        
        headers.forEach((header, index) => {
            header.style.opacity = '0';
            header.style.transform = 'translateY(20px)';
            header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    },
    
    // Настройка Intersection Observer для ленивой загрузки
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Для элементов с data-animate
                    if (entry.target.dataset.animate) {
                        this.animateElement(entry.target, entry.target.dataset.animate);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Наблюдаем за всеми элементами с data-observe
        document.querySelectorAll('[data-observe]').forEach(el => {
            observer.observe(el);
        });
    },
    
    // Анимация конкретного элемента
    animateElement(element, animationType) {
        switch(animationType) {
            case 'fade':
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'all 0.6s ease';
                }, 100);
                break;
                
            case 'slide':
                element.style.transform = 'translateX(-50px)';
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.transform = 'translateX(0)';
                    element.style.opacity = '1';
                    element.style.transition = 'all 0.6s ease';
                }, 100);
                break;
                
            case 'scale':
                element.style.transform = 'scale(0.9)';
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.opacity = '1';
                    element.style.transition = 'all 0.6s ease';
                }, 100);
                break;
        }
    },
    
    // Эффекты при наведении
    setupHoverEffects() {
        // Карточки
        document.querySelectorAll('.grid-card, .card').forEach(card => {
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
        
        // Ссылки
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    },
    
    // Обработка изменения размера окна
    handleResize() {
        // Перезапускаем анимацию карточек при изменении размера
        this.animateCards();
    },
    
    // Обработка предпочтений анимаций
    handleMotionPreference() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }
        
        // Слушаем изменения предпочтений
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });
    },
    
    // Отключение анимаций
    disableAnimations() {
        document.documentElement.style.setProperty('--animation-speed', '0s');
        console.log('⚠️ Анимации отключены (prefers-reduced-motion)');
    },
    
    // Включение анимаций
    enableAnimations() {
        document.documentElement.style.removeProperty('--animation-speed');
        console.log('✅ Анимации включены');
    },
    
    // Плавный переход между страницами
    navigateTo(url, transition = 'fade') {
        const mainContent = document.querySelector('main, .content-wrapper, .container');
        
        if (!mainContent) {
            window.location.href = url;
            return;
        }
        
        // Анимация исчезновения
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        mainContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Переход через 300ms
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    },
    
    // Анимация ошибки (встряска)
    shake(element) {
        if (!element) return;
        
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    },
    
    // Анимация успеха (пульсация)
    pulse(element) {
        if (!element) return;
        
        const originalScale = element.style.transform;
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transform = originalScale;
        }, 300);
    },
    
    // Перезапуск всех анимаций
    restart() {
        this.start();
    }
};

// Автоматическая инициализация при загрузке
Animations.init();

// Экспорт для использования в других скриптах
window.AppAnimations = Animations;