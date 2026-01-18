// auth.js - Управление авторизацией и регистрацией

const AuthManager = {
    // Инициализация
    init() {
        console.log('🔐 Инициализация авторизации...');
        
        // Проверяем текущего пользователя
        const user = this.getCurrentUser();
        
        // Показываем информацию о пользователе
        this.showUserInfo(user);
        
        // Настраиваем формы
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupLogout();
        
        console.log('✅ Авторизация инициализирована');
        
        return user;
    },
    
    // Получение текущего пользователя
    getCurrentUser() {
        try {
            // Проверяем localStorage и sessionStorage
            const savedUser = localStorage.getItem('currentUser') || 
                            sessionStorage.getItem('currentUser');
            
            if (savedUser) {
                return JSON.parse(savedUser);
            } else {
                // Создаем гостевого пользователя
                return this.createGuestUser();
            }
        } catch (error) {
            console.error('Ошибка получения пользователя:', error);
            return this.createGuestUser();
        }
    },
    
    // Создание гостевого пользователя
    createGuestUser() {
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Гость',
            email: '',
            isGuest: true,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        // Сохраняем в sessionStorage (не сохраняется после закрытия браузера)
        sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
        
        return guestUser;
    },
    
    // Показ информации о пользователе
    showUserInfo(user) {
        const userInfoElement = document.getElementById('userInfo');
        if (!userInfoElement) return;
        
        if (user.isGuest) {
            userInfoElement.innerHTML = `
                <div class="user-details">
                    <span class="user-name">👤 ${user.name}</span>
                </div>
            `;
        } else {
            userInfoElement.innerHTML = `
                <div class="user-details">
                    <span class="user-name">👤 ${user.name}</span>
                    <span class="user-email">📧 ${user.email}</span>
                </div>
            `;
        }
        
        // Анимация появления
        setTimeout(() => {
            userInfoElement.classList.add('loaded');
        }, 300);
    },
    
    // Настройка формы входа
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                this.showFormError(loginForm, 'Заполните все поля');
                return;
            }
            
            // Валидация email
            if (!this.isValidEmail(email)) {
                this.showFormError(loginForm, 'Введите корректный email');
                return;
            }
            
            // Показываем загрузку
            this.showFormLoading(loginForm, 'Вход...');
            
            // Имитация запроса к серверу
            setTimeout(() => {
                // Проверяем существующих пользователей
                const users = this.getRegisteredUsers();
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Успешный вход
                    this.loginSuccess(user, false); // false = запомнить меня
                } else {
                    // Ошибка входа
                    this.showFormError(loginForm, 'Неверный email или пароль');
                    this.resetFormLoading(loginForm);
                }
            }, 1500);
        });
        
        // Очистка ошибок при вводе
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFormError(loginForm);
            });
        });
        
        // Показ/скрытие пароля
        const togglePassword = loginForm.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = loginForm.querySelector('input[type="password"]');
                if (passwordInput) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        togglePassword.textContent = '👁️‍🗨️';
                    } else {
                        passwordInput.type = 'password';
                        togglePassword.textContent = '👁️';
                    }
                }
            });
        }
    },
    
    // Настройка формы регистрации
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) return;
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName')?.value.trim();
            const email = document.getElementById('registerEmail')?.value.trim();
            const password = document.getElementById('registerPassword')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            
            // Валидация
            if (!name || !email || !password || !confirmPassword) {
                this.showFormError(registerForm, 'Заполните все поля');
                return;
            }
            
            if (!this.isValidEmail(email)) {
                this.showFormError(registerForm, 'Введите корректный email');
                return;
            }
            
            if (password.length < 6) {
                this.showFormError(registerForm, 'Пароль должен быть не менее 6 символов');
                return;
            }
            
            if (password !== confirmPassword) {
                this.showFormError(registerForm, 'Пароли не совпадают');
                return;
            }
            
            // Проверяем, не занят ли email
            const users = this.getRegisteredUsers();
            if (users.some(u => u.email === email)) {
                this.showFormError(registerForm, 'Пользователь с таким email уже существует');
                return;
            }
            
            // Показываем загрузку
            this.showFormLoading(registerForm, 'Регистрация...');
            
            // Имитация запроса
            setTimeout(() => {
                // Создаем нового пользователя
                const newUser = {
                    id: 'user_' + Date.now(),
                    name: name,
                    email: email,
                    password: password, // В реальном приложении НЕ храните пароли в localStorage!
                    isGuest: false,
                    isAdmin: false,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };
                
                // Сохраняем пользователя
                this.registerUser(newUser);
                
                // Автоматически входим
                this.loginSuccess(newUser, true);
            }, 1500);
        });
        
        // Очистка ошибок
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFormError(registerForm);
            });
        });
        
        // Показать/скрыть пароль
        const toggleButtons = registerForm.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const passwordInput = button.closest('.input-group')?.querySelector('input[type="password"]');
                if (passwordInput) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        button.textContent = '👁️‍🗨️';
                    } else {
                        passwordInput.type = 'password';
                        button.textContent = '👁️';
                    }
                }
            });
        });
    },
    
    // Настройка выхода
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (!logoutBtn) return;
        
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Анимация нажатия
            logoutBtn.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.logout();
                logoutBtn.style.transform = '';
            }, 150);
        });
    },
    
    // Успешный вход
    loginSuccess(user, rememberMe) {
        // Удаляем пароль из объекта пользователя (безопасность)
        const { password, ...userWithoutPassword } = user;
        
        // Сохраняем пользователя
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }
        
        // Обновляем lastLogin
        userWithoutPassword.lastLogin = new Date().toISOString();
        
        // Показываем успешное сообщение
        this.showFormSuccess('loginForm' in window ? 'loginForm' : 'registerForm', 
                           'Успешный вход! Перенаправление...');
        
        // Перенаправляем на главную
        setTimeout(() => {
            window.location.href = 'gl.html';
        }, 1000);
    },
    
    // Выход
    logout() {
        // Удаляем данные пользователя
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Перенаправляем на страницу входа
        window.location.href = 'login_form.html';
    },
    
    // Регистрация пользователя
    registerUser(user) {
        try {
            const users = this.getRegisteredUsers();
            users.push(user);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            console.log('👤 Пользователь зарегистрирован:', user.email);
        } catch (error) {
            console.error('Ошибка регистрации пользователя:', error);
        }
    },
    
    // Получение зарегистрированных пользователей
    getRegisteredUsers() {
        try {
            const users = localStorage.getItem('registeredUsers');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            return [];
        }
    },
    
    // Валидация email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Показать ошибку формы
    showFormError(formId, message) {
        const form = typeof formId === 'string' ? document.getElementById(formId) : formId;
        if (!form) return;
        
        // Удаляем старую ошибку
        this.clearFormError(form);
        
        // Создаем элемент ошибки
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--accent-error);
            font-size: 14px;
            margin-top: 10px;
            padding: 10px;
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 8px;
            animation: fadeIn 0.3s ease;
        `;
        
        // Добавляем после формы
        form.appendChild(errorElement);
        
        // Анимация встряски
        if (window.AppAnimations) {
            window.AppAnimations.shake(form);
        }
    },
    
    // Очистка ошибки формы
    clearFormError(form) {
        const errorElement = form.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    // Показать успешное сообщение
    showFormSuccess(formId, message) {
        const form = typeof formId === 'string' ? document.getElementById(formId) : formId;
        if (!form) return;
        
        this.clearFormError(form);
        
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.textContent = message;
        successElement.style.cssText = `
            color: var(--accent-success);
            font-size: 14px;
            margin-top: 10px;
            padding: 10px;
            background: rgba(35, 213, 171, 0.1);
            border: 1px solid rgba(35, 213, 171, 0.3);
            border-radius: 8px;
            animation: fadeIn 0.3s ease;
        `;
        
        form.appendChild(successElement);
        
        // Автоудаление через 5 секунд
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.remove();
            }
        }, 5000);
    },
    
    // Показать загрузку формы
    showFormLoading(form, text = 'Загрузка...') {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        // Сохраняем оригинальный текст
        submitBtn.dataset.originalText = submitBtn.innerHTML;
        
        // Устанавливаем текст загрузки
        submitBtn.innerHTML = `
            <span>${text}</span>
            <div class="loading-spinner" style="
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-left: 8px;
            "></div>
        `;
        
        submitBtn.disabled = true;
    },
    
    // Сброс загрузки формы
    resetFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn || !submitBtn.dataset.originalText) return;
        
        submitBtn.innerHTML = submitBtn.dataset.originalText;
        submitBtn.disabled = false;
        delete submitBtn.dataset.originalText;
    }
};

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});

// Экспорт для использования
window.AuthManager = AuthManager;

// Анимация спиннера
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);