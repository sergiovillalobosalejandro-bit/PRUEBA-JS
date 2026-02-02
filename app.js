// app.js
// Bootstrap de la aplicación

import { router } from './router/router.js';
import { combinedGuard } from './guards/role.guard.js';

// Importar vistas
import { renderLogin } from './views/auth/login.view.js';
import { renderRegister } from './views/auth/register.view.js';
import { renderUserTasks } from './views/user/tasks.view.js';
import { renderUserProfile } from './views/user/profile.view.js';
import { renderAdminDashboard } from './views/admin/dashboard.view.js';
import { renderAdminTasks } from './views/admin/tasks.view.js';

/**
 * Configurar rutas de la aplicación
 */
function setupRoutes() {
    // Rutas de autenticación (solo para invitados)
    router.addRoute('/login', renderLogin, { 
        guestOnly: true 
    });
    
    router.addRoute('/register', renderRegister, { 
        guestOnly: true 
    });

    // Rutas de usuario
    router.addRoute('/user/tasks', renderUserTasks, { 
        requiresAuth: true,
        role: 'user'
    });
    
    router.addRoute('/user/profile', renderUserProfile, { 
        requiresAuth: true,
        role: 'user'
    });

    // Rutas de admin
    router.addRoute('/admin/dashboard', renderAdminDashboard, { 
        requiresAuth: true,
        role: 'admin'
    });
    
    router.addRoute('/admin/tasks', renderAdminTasks, { 
        requiresAuth: true,
        role: 'admin'
    });

    // Ruta 404
    router.addRoute('/404', render404);

    // Ruta raíz - redirige según el estado
    router.addRoute('/', () => {
        // Esta función se ejecutará pero el guard redirigirá apropiadamente
        router.navigate('/login');
    }, {});
}

/**
 * Página 404
 */
function render404() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-card" style="text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">404</div>
                <h1 style="font-size: 2rem; margin-bottom: 1rem;">Page Not Found</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    The page you're looking for doesn't exist.
                </p>
                <button class="btn btn-primary" onclick="window.location.href='/login'">
                    Go to Login
                </button>
            </div>
        </div>
    `;
}

/**
 * Agregar estilos para el modal
 */
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .error-message {
            animation: shake 0.3s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Inicializar aplicación
 */
function initApp() {
    console.log('🚀 Initializing CRUDTASK Application...');
    
    // Agregar estilos adicionales
    addModalStyles();
    
    // Configurar rutas
    setupRoutes();
    
    // Agregar guard de protección
    router.addGuard(combinedGuard);
    
    // Iniciar router
    router.init();
    
    console.log('✅ Application initialized successfully');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
