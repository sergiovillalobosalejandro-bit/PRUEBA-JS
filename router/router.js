class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.guards = [];

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path, handler, meta = {}) {
        this.routes[path] = { handler, meta };
    }

    addGuard(guardFn) {
        this.guards.push(guardFn);
    }

    navigate(path) {
        window.location.hash = path;
    }

    async handleRoute() {
        const path = window.location.hash.slice(1) || '/login';
        const route = this.routes[path] || this.routes['/404'];

        if (!route) {
            console.error('Ruta no encontrada:', path);
            return;
        }

        for (const guard of this.guards) {
            const canActivate = await guard(route.meta);
            if (!canActivate) return;
        }

        this.currentRoute = path;
        await route.handler();
    }
}

export const router = new Router();

