// services/auth.service.js
// Servicio de autenticación

import { apiService } from './api.service.js';
import { router } from '../router/router.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    /**
     * Login de usuario
     */
    async login(email, password) {
        try {
            // Buscar usuario por email y password
            const users = await apiService.get('/users', { 
                email: email,
                password: password 
            });

            if (users.length === 0) {
                throw new Error('Credenciales inválidas');
            }

            const user = users[0];
            
            // Simular token (en producción vendría del backend)
            const token = btoa(JSON.stringify({ 
                id: user.id, 
                email: user.email,
                role: user.role 
            }));

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            this.currentUser = user;

            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Registro de nuevo usuario
     */
    async register(userData) {
        try {
            // Verificar si el email ya existe
            const existingUsers = await apiService.get('/users', { email: userData.email });
            
            if (existingUsers.length > 0) {
                throw new Error('El email ya está registrado');
            }

            // Crear nuevo usuario (por defecto rol 'user')
            const newUser = {
                ...userData,
                role: userData.role || 'user',
                createdAt: new Date().toISOString()
            };

            const user = await apiService.post('/users', newUser);

            // Auto-login después del registro
            return this.login(userData.email, userData.password);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        router.navigate('/login');
    }

    /**
     * Verificar si está autenticado
     */
    isAuthenticated() {
    return !!localStorage.getItem('token') && !!this.getCurrentUser();
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
    if (!this.currentUser) {
        this.loadUserFromStorage();
    }
    return this.currentUser;
    }

    /**
     * Verificar rol del usuario
     */
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    /**
     * Cargar usuario desde localStorage
     */
    loadUserFromStorage() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (error) {
                console.error('Error loading user from storage:', error);
                this.logout();
            }
        }
    }

    /**
     * Actualizar perfil de usuario
     */
    async updateProfile(userId, data) {
        try {
            const updatedUser = await apiService.patch(`/users/${userId}`, data);
            
            // Actualizar en localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;

            return updatedUser;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
}

// Exportar instancia única
export const authService = new AuthService();