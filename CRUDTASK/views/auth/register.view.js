// views/auth/register.view.js
// Vista de Registro

import { authService } from '../../services/auth.service.js';
import { router } from '../../router/router.js';

export async function renderRegister() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <div class="logo-icon">CT</div>
                    <div class="logo-text">CRUDTASK</div>
                </div>
                
                <div class="auth-header">
                    <h1 class="auth-title">Create account</h1>
                    <p class="auth-subtitle">Join the academic performance platform today</p>
                </div>
                
                <form id="registerForm">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="fullName" class="form-input" placeholder="John Doe" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email address</label>
                        <input type="email" id="email" class="form-input" placeholder="student@university.edu" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="password" class="form-input" placeholder="Create a password" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-input" placeholder="Confirm password" required>
                    </div>
                    
                    <div id="errorMessage" class="error-message" style="display: none;"></div>
                    
                    <button type="submit" class="btn btn-primary" id="registerBtn">
                        Register
                    </button>
                    
                    <div class="form-footer">
                        Already have an account? <a href="/login" id="loginLink">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    setupRegisterEventListeners();
}

function setupRegisterEventListeners() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', handleRegister);

    const loginLink = document.getElementById('loginLink');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/login');
    });
}

async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Validaciones
    if (!fullName || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating account...';
    errorMessage.style.display = 'none';

    try {
        const userData = {
            fullName,
            email,
            password,
            role: 'user' // Por defecto todos los nuevos usuarios son 'user'
        };

        const user = await authService.register(userData);
        
        // Redirigir a tasks del usuario
        router.navigate('/user/tasks');
    } catch (error) {
        showError(error.message || 'Error creating account');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register';
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
