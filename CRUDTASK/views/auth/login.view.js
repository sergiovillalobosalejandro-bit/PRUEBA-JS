// views/auth/login.view.js
// Vista de Login

import { authService } from '../../services/auth.service.js';
import { router } from '../../router/router.js';

export async function renderLogin() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <div class="logo-icon">CT</div>
                    <div class="logo-text">CRUDTASK</div>
                </div>
                
                <div class="auth-header">
                    <h1 class="auth-title">Welcome back</h1>
                    <p class="auth-subtitle">Enter your credentials to access the platform</p>
                </div>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label">Email or username</label>
                        <input type="email" id="email" class="form-input" placeholder="student@university.edu" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                            <button type="button" class="password-toggle" id="togglePassword">👁️</button>
                        </div>
                    </div>
                    
                    <div id="errorMessage" class="error-message" style="display: none;"></div>
                    
                    <button type="submit" class="btn btn-primary" id="loginBtn">
                        Sign in
                    </button>
                    
                    <div class="form-footer">
                        Don't have an account? <a href="/register" id="registerLink">Register</a>
                    </div>
                </form>
                
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color); font-size: 0.813rem; color: var(--text-secondary);">
                    <strong>Cuentas de prueba:</strong><br>
                    <strong>Admin:</strong> admin@crudtask.com / admin123<br>
                    <strong>User:</strong> user@crudtask.com / user123
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    setupLoginEventListeners();
}

function setupLoginEventListeners() {
    // Form submit
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);

    // Toggle password visibility
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Link to register
    const registerLink = document.getElementById('registerLink');
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/register');
    });
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Validación básica
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Deshabilitar botón
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';
    errorMessage.style.display = 'none';

    try {
        const user = await authService.login(email, password);
        
        // Redirigir según el rol
        if (user.role === 'admin') {
            router.navigate('/admin/dashboard');
        } else {
            router.navigate('/user/tasks');
        }
    } catch (error) {
        showError(error.message || 'Invalid credentials');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign in';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.padding = '0.75rem';
    errorMessage.style.marginBottom = '1rem';
    errorMessage.style.backgroundColor = '#fee2e2';
    errorMessage.style.color = '#dc2626';
    errorMessage.style.borderRadius = '0.5rem';
    errorMessage.style.fontSize = '0.875rem';
}
