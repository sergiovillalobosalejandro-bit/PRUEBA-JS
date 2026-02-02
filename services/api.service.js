// services/api.service.js
// Servicio para comunicación con JSON Server

const API_URL = 'http://localhost:3000';

class ApiService {
    /**
     * Realizar petición GET
     */
    async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return this.handleResponse(response);
        } catch (error) {
    throw new Error('No se pudo conectar con el servidor');
        }
    }

    /**
     * Realizar petición POST
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
    throw new Error('No se pudo conectar con el servidor');
        }
    }

    /**
     * Realizar petición PUT
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
    throw new Error('No se pudo conectar con el servidor');
        }
    }

    /**
     * Realizar petición PATCH
     */
    async patch(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
    throw new Error('No se pudo conectar con el servidor');
        }
    }

    /**
     * Realizar petición DELETE
     */
    async remove(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('DELETE Error:', error);
            throw new Error('No se pudo eliminar el recurso');
        }
    }


    /**
     * Obtener headers para las peticiones
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Agregar token si existe
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Manejar respuesta
     */
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error en la petición');
        }

        // Si es 204 No Content, retornar null
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }
}

// Exportar instancia única
export const apiService = new ApiService();
