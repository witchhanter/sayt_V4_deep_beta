// script_gl.js - Главный скрипт главной страницы (упрощенный)

// Основная инициализация
function initMainPage() {
    console.log('🏠 Инициализация главной страницы...');
    
    // Проверяем авторизацию
    const user = window.AuthManager ? window.AuthManager.getCurrentUser() : null;
    
    // Показываем информацию о пользователе
    updateUserInfo(user);
    
    // Настраиваем выход
    setupLogout();
    
    // Настраиваем скрытие хедера при скролле
    setupHeaderScroll();
    
    // Настраиваем обновление времени
    initTime();
    
    // Настраиваем интерактивность карточек
    setupCardsInteractivity();
    
    console.log('✅ Главная страница инициализирована');
}

// Обновление информации о пользователе
function updateUserInfo(user) {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo || !user) return;
    
    if (user.isGuest) {
        userInfo.innerHTML = `
            <div class="user-details">
                <span class="user-name">👤 ${user.name}</span>
            </div>
        `;
    } else {
        userInfo.innerHTML = `
            <div class="user-details">
                <span class="user-name">👤 ${user.name}</span>
                <span class="user-email">📧 ${user.email}</span>
            </div>
        `;
    }
    
    // Анимация появления
    setTimeout(() => {
        userInfo.classList.add('loaded');
    }, 300);
}

// Настройка выхода
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Анимация нажатия
        logoutBtn.style.transform = 'scale(0.9)';
        
        // Используем AuthManager если есть, иначе обычный выход
        setTimeout(() => {
            if (window.AuthManager) {
                window.AuthManager.logout();
            } else {
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                window.location.href = 'login_form.html';
            }
            
            logoutBtn.style.transform = '';
        }, 150);
    });
}

// Настройка скрытия хедера при скролле
function setupHeaderScroll() {
    const header = document.querySelector('.glass-header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    if (currentScroll > lastScroll) {
                        // Скролл вниз - скрываем
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        // Скролл вверх - показываем
                        header.style.transform = 'translateY(0)';
                    }
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Инициализация времени
function initTime() {
    const timeElement = document.getElementById('currentTime');
    if (!timeElement) return;
    
    // Функция обновления времени
    function updateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        
        timeElement.textContent = now.toLocaleString('ru-RU', options);
    }
    
    // Первое обновление
    updateTime();
    
    // Обновление каждые 30 секунд
    setInterval(updateTime, 30000);
}

// Настройка интерактивности карточек
function setupCardsInteractivity() {
    const cards = document.querySelectorAll('.grid-card');
    
    cards.forEach(card => {
        // Для touch устройств
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Для десктопа
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
        
        // Клик для мобильных (улучшенный feedback)
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
}

// Анимация для карточек (специфичная для главной)
function animateGridCards() {
    const gridItems = document.querySelectorAll('.grid-item');
    if (gridItems.length === 0) return;
    
    // Используем Intersection Observer для плавного появления
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Задержка для последовательного появления
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    gridItems.forEach(item => {
        observer.observe(item);
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем основную инициализацию
    initMainPage();
    
    // Запускаем анимацию карточек (через 500ms для плавности)
    setTimeout(() => {
        animateGridCards();
    }, 500);
    
    // Анимация для welcome section
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        setTimeout(() => {
            welcomeSection.classList.add('show');
        }, 300);
    }
    
    // Анимация для футера
    const footer = document.querySelector('.footer');
    if (footer) {
        setTimeout(() => {
            footer.classList.add('show');
        }, 1000);
    }
});

// Экспорт функций для использования
window.MainPage = {
    init: initMainPage,
    updateUserInfo,
    setupLogout,
    animateGridCards
};