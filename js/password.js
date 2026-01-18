// password.js - Проверка пароля для главной страницы (index.html)

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Инициализация страницы пароля...');
    
    // Элементы DOM
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const messageElement = document.getElementById('message');
    const togglePassword = document.querySelector('.toggle-password');
    
    // Правильный пароль (можно изменить)
    const CORRECT_PASSWORD = '1234';
    
    // Инициализация
    initPasswordPage();
    
    // Основная инициализация
    function initPasswordPage() {
        if (!passwordForm) return;
        
        // Настройка формы
        setupPasswordForm();
        
        // Настройка переключателя пароля
        setupPasswordToggle();
        
        // Автофокус на поле пароля
        setTimeout(() => {
            if (passwordInput) {
                passwordInput.focus();
            }
        }, 300);
        
        console.log('✅ Страница пароля инициализирована');
    }
    
    // Настройка формы пароля
    function setupPasswordForm() {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = passwordInput.value.trim();
            
            if (!password) {
                showMessage('Введите пароль', 'error');
                shakeElement(passwordInput);
                return;
            }
            
            // Показать состояние загрузки
            showLoading();
            
            // Имитация проверки с задержкой
            setTimeout(() => {
                checkPassword(password);
            }, 800);
        });
        
        // Очистка сообщений при вводе
        passwordInput.addEventListener('input', function() {
            clearMessage();
        });
        
        // Enter для отправки формы
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    // Настройка переключателя видимости пароля
    function setupPasswordToggle() {
        if (!togglePassword || !passwordInput) return;
        
        togglePassword.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.setAttribute('aria-label', 'Скрыть пароль');
            } else {
                passwordInput.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.setAttribute('aria-label', 'Показать пароль');
            }
        });
        
        // Клавиатурная навигация
        togglePassword.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Проверка пароля
    function checkPassword(password) {
        if (password === CORRECT_PASSWORD) {
            // Успешный ввод
            handleSuccess();
        } else {
            // Неверный пароль
            handleError();
        }
    }
    
    // Обработка успешного ввода
    function handleSuccess() {
        // Показать успешное сообщение
        showMessage('Пароль верный! Перенаправление...', 'success');
        
        // Анимация успеха
        successAnimation();
        
        // Обновить кнопку
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Успешно!</span>';
            submitBtn.style.background = 'rgba(35, 213, 171, 0.3)';
            submitBtn.style.borderColor = 'rgba(35, 213, 171, 0.5)';
            submitBtn.disabled = true;
        }
        
        // Перенаправление через 1 секунду
        setTimeout(() => {
            window.location.href = 'pages/gl.html';
        }, 1000);
    }
    
    // Обработка ошибки
    function handleError() {
        // Показать сообщение об ошибке
        showMessage('Неверный пароль. Попробуйте снова.', 'error');
        
        // Анимация ошибки
        shakeElement(passwordInput);
        
        // Сбросить состояние загрузки
        resetLoading();
        
        // Очистить поле ввода
        passwordInput.value = '';
        passwordInput.focus();
    }
    
    // Показать сообщение
    function showMessage(text, type) {
        if (!messageElement) return;
        
        messageElement.textContent = text;
        messageElement.className = 'message';
        
        switch(type) {
            case 'success':
                messageElement.classList.add('success-message');
                break;
            case 'error':
                messageElement.classList.add('error-message');
                break;
        }
        
        messageElement.classList.add('show');
        
        // Автоскрытие для ошибок
        if (type === 'error') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
    
    // Очистить сообщение
    function clearMessage() {
        if (messageElement) {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 300);
        }
    }
    
    // Показать состояние загрузки
    function showLoading() {
        if (submitBtn) {
            submitBtn.innerHTML = `
                <span>Проверка...</span>
                <div class="loading-spinner"></div>
            `;
            submitBtn.disabled = true;
        }
    }
    
    // Сбросить состояние загрузки
    function resetLoading() {
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Войти</span><i class="fas fa-arrow-right submit-icon"></i>';
            submitBtn.disabled = false;
        }
    }
    
    // Анимация встряски
    function shakeElement(element) {
        if (!element) return;
        
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    // Анимация успеха
    function successAnimation() {
        const formContainer = document.querySelector('.password-form-container');
        if (formContainer) {
            formContainer.style.animation = 'successPulse 0.5s ease';
            
            // Добавить CSS анимацию
            const style = document.createElement('style');
            style.textContent = `
                @keyframes successPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); box-shadow: 0 25px 70px rgba(35, 213, 171, 0.3); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Подсказка пароля (для удобства тестирования)
    function showPasswordHint() {
        const hint = document.createElement('div');
        hint.className = 'password-hint';
        hint.innerHTML = `
            <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 10px;">
                <i class="fas fa-lightbulb"></i>
                Подсказка: пароль по умолчанию - <code>${CORRECT_PASSWORD}</code>
            </p>
        `;
        
        const themeSection = document.querySelector('.theme-section');
        if (themeSection) {
            themeSection.parentNode.insertBefore(hint, themeSection);
        }
    }
    
    // Показать подсказку только в development режиме
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(showPasswordHint, 1000);
    }
});

// Экспорт функций для тестирования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CORRECT_PASSWORD: '1234'
    };
}