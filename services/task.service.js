// services/task.service.js
// Servicio para gestión de tareas (CRUD)

import { apiService } from './api.service.js';
import { authService } from './auth.service.js';

class TaskService {
    /**
     * Obtener todas las tareas
     */
    async getAllTasks(filters = {}) {
        try {
            return await apiService.get('/tasks', filters);
        } catch (error) {
            console.error('Get all tasks error:', error);
            throw error;
        }
    }

    /**
     * Obtener tareas del usuario actual
     */
    async getUserTasks() {
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('Usuario no autenticado');
            }

            // Si es admin, obtener todas las tareas
            if (user.role === 'admin') {
                return this.getAllTasks();
            }

            // Si es usuario normal, solo sus tareas
            return await apiService.get('/tasks', { userId: user.id });
        } catch (error) {
            console.error('Get user tasks error:', error);
            throw error;
        }
    }

    /**
     * Obtener tarea por ID
     */
    async getTaskById(taskId) {
        try {
            return await apiService.get(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Get task by id error:', error);
            throw error;
        }
    }

    /**
     * Crear nueva tarea
     */
    async createTask(taskData) {
        try {
            const user = authService.getCurrentUser();
            
            const newTask = {
                ...taskData,
                userId: taskData.userId || user.id,
                createdBy: user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            return await apiService.post('/tasks', newTask);
        } catch (error) {
            console.error('Create task error:', error);
            throw error;
        }
    }

    /**
     * Actualizar tarea
     */
    async updateTask(taskId, taskData) {
        try {
            const updatedTask = {
                ...taskData,
                updatedAt: new Date().toISOString()
            };

            return await apiService.patch(`/tasks/${taskId}`, updatedTask);
        } catch (error) {
            console.error('Update task error:', error);
            throw error;
        }
    }

    /**
     * Actualizar parcialmente una tarea
     */
    async patchTask(taskId, data) {
        try {
            const patchData = {
                ...data,
                updatedAt: new Date().toISOString()
            };

            return await apiService.patch(`/tasks/${taskId}`, patchData);
        } catch (error) {
            console.error('Patch task error:', error);
            throw error;
        }
    }

    /**
     * Eliminar tarea
     */
    async deleteTask(taskId) {
        try {
            return await apiService.remove(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }

    /**
     * Cambiar estado de tarea
     */
    async changeTaskStatus(taskId, newStatus) {
        try {
            return await this.patchTask(taskId, { status: newStatus });
        } catch (error) {
            console.error('Change task status error:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas de tareas
     */
    async getTaskStats(userId = null) {
        try {
            const filters = userId ? { userId } : {};
            const tasks = await apiService.get('/tasks', filters);

            const stats = {
                total: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                inProgress: tasks.filter(t => t.status === 'in-progress').length,
                completed: tasks.filter(t => t.status === 'completed').length,
                highPriority: tasks.filter(t => t.priority === 'high').length,
                mediumPriority: tasks.filter(t => t.priority === 'medium').length,
                lowPriority: tasks.filter(t => t.priority === 'low').length
            };

            return stats;
        } catch (error) {
            console.error('Get task stats error:', error);
            throw error;
        }
    }

    /**
     * Buscar tareas
     */
    async searchTasks(searchTerm) {
        try {
            const tasks = await this.getUserTasks();
            
            if (!searchTerm) {
                return tasks;
            }

            const term = searchTerm.toLowerCase();
            return tasks.filter(task => 
                task.title.toLowerCase().includes(term) ||
                task.description?.toLowerCase().includes(term) ||
                task.category?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Search tasks error:', error);
            throw error;
        }
    }
}

// Exportar instancia única
export const taskService = new TaskService();
