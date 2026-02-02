// router/router.js
// Sistema de enrutamiento SPA

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.guards = [];
        
        // Escuchar cambios en la URL
        window.addEventListener('popstate', () => this.handleRoute());
    }

    /**
     * Registrar una nueva ruta
     */
    addRoute(path, handler, meta = {}) {
        this.routes[path] = { handler, meta };
    }

    /**
     * Agregar un guard (middleware de protección)
     */
    addGuard(guardFn) {
        this.guards.push(guardFn);
    }

    /**
     * Navegar a una ruta
     */
    navigate(path, state = {}) {
        window.history.pushState(state, '', path);
        this.handleRoute();
    }

    /**
     * Manejar la ruta actual
     */
    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/404'];

        if (!route) {
            console.error('Ruta no encontrada:', path);
            return;
        }

        // Ejecutar guards
        for (const guard of this.guards) {
            const canActivate = await guard(route.meta);
            if (!canActivate) {
                return; // Guard bloqueó la navegación
            }
        }

        // Ejecutar el handler de la ruta
        this.currentRoute = path;
        await route.handler();
    }

    /**
     * Iniciar el router
     */
    init() {
        this.handleRoute();
    }

    /**
     * Obtener parámetros de query string
     */
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
}

// Exportar instancia única
export const router = new Router();
