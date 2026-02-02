// guards/role.guard.js
// Guard para protección de rutas por rol

import { authService } from '../services/auth.service.js';
import { router } from '../router/router.js';

/**
 * Guard de autenticación
 * Verifica que el usuario esté autenticado
 */


function redirectByRole(user) {
    const path = user.role === 'admin'
        ? '/admin/dashboard'
        : '/user/tasks';

    router.navigate(path);
}
export async function authGuard(meta) {
    const isAuthenticated = authService.isAuthenticated();

    if (meta.requiresAuth && !isAuthenticated) {
        router.navigate('/login');
        return false;
    }

    if (meta.guestOnly && isAuthenticated) {
        const user = authService.getCurrentUser();
        redirectByRole(user);
        return false;
    }

    return true;
}


/**
 * Guard de rol
 * Verifica que el usuario tenga el rol requerido
 */
export async function roleGuard(meta) {
    if (!meta.role) return true;

    const user = authService.getCurrentUser();

    if (!user) {
        router.navigate('/login');
        return false;
    }

    if (user.role !== meta.role) {
        redirectByRole(user);
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
