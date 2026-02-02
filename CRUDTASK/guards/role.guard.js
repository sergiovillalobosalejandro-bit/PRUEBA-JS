// guards/role.guard.js
// Guard para protección de rutas por rol

import { authService } from '../services/auth.service.js';
import { router } from '../router/router.js';

/**
 * Guard de autenticación
 * Verifica que el usuario esté autenticado
 */
export async function authGuard(meta) {
    const isAuthenticated = authService.isAuthenticated();
    
    // Si la ruta requiere autenticación y el usuario no está autenticado
    if (meta.requiresAuth && !isAuthenticated) {
        router.navigate('/login');
        return false;
    }

    // Si el usuario está autenticado e intenta acceder a login/register
    if (meta.guestOnly && isAuthenticated) {
        const user = authService.getCurrentUser();
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/user/tasks';
        router.navigate(redirectPath);
        return false;
    }

    return true;
}

/**
 * Guard de rol
 * Verifica que el usuario tenga el rol requerido
 */
export async function roleGuard(meta) {
    // Si no se requiere un rol específico, permitir acceso
    if (!meta.role) {
        return true;
    }

    const user = authService.getCurrentUser();
    
    // Verificar que el usuario tenga el rol correcto
    if (user.role !== meta.role) {
        // Redirigir al dashboard apropiado
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/user/tasks';
        router.navigate(redirectPath);
        return false;
    }

    return true;
}

/**
 * Guard combinado
 * Ejecuta todos los guards necesarios
 */
export async function combinedGuard(meta) {
    // Primero verificar autenticación
    const isAuthValid = await authGuard(meta);
    if (!isAuthValid) {
        return false;
    }

    // Luego verificar rol
    const isRoleValid = await roleGuard(meta);
    if (!isRoleValid) {
        return false;
    }

    return true;
}
