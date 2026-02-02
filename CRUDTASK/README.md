# CRUDTASK - Academic Task Management System

Sistema completo de gestión de tareas académicas con autenticación, roles de usuario y operaciones CRUD.

## 📋 Características

- ✅ **Autenticación completa**: Login y registro de usuarios
- 👥 **Sistema de roles**: Admin y User con diferentes permisos
- 📝 **CRUD de tareas**: Crear, leer, actualizar y eliminar tareas
- 🔒 **Protección de rutas**: Guards para proteger rutas según rol
- 📊 **Dashboard**: Estadísticas y visualización de datos
- 🎨 **Diseño moderno**: Interfaz profesional basada en CRUDZASO
- 📱 **Responsive**: Adaptable a dispositivos móviles

## 🏗️ Estructura del Proyecto

```
CRUDTASK/
│
├── index.html                 # Contenedor único SPA
│
├── styles/
│   └── main.css              # Estilos completos
│
├── router/
│   └── router.js             # Sistema de navegación SPA
│
├── services/
│   ├── api.service.js        # Comunicación con JSON Server
│   ├── auth.service.js       # Autenticación y sesión
│   └── task.service.js       # CRUD de tareas
│
├── guards/
│   └── role.guard.js         # Protección de rutas por rol
│
├── views/
│   ├── auth/
│   │   ├── login.view.js     # Vista de login
│   │   └── register.view.js  # Vista de registro
│   │
│   ├── user/
│   │   ├── tasks.view.js     # Tareas del usuario
│   │   └── profile.view.js   # Perfil del usuario
│   │
│   └── admin/
│       ├── dashboard.view.js # Dashboard admin
│       └── tasks.view.js     # Todas las tareas
│
├── app.js                    # Bootstrap de la aplicación
├── db.json                   # Base de datos JSON Server
└── README.md                 # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js instalado (v14 o superior)
- npm o yarn

### Paso 1: Instalar JSON Server

```bash
npm install -g json-server
```

### Paso 2: Iniciar el servidor

```bash
json-server --watch db.json --port 3000
```

El servidor estará disponible en: `http://localhost:3000`

### Paso 3: Iniciar la aplicación

Opción 1 - Usando Live Server (VSCode):
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

Opción 2 - Usando Python:
```bash
python -m http.server 8000
```

Opción 3 - Usando Node:
```bash
npm install -g http-server
http-server -p 8000
```

Accede a: `http://localhost:8000`

## 👤 Cuentas de Prueba

### Administrador
- **Email**: admin@crudtask.com
- **Password**: admin123
- **Acceso**: Dashboard completo, todas las tareas

### Usuario
- **Email**: user@crudtask.com
- **Password**: user123
- **Acceso**: Solo sus tareas, perfil personal

## 📱 Rutas de la Aplicación

### Rutas Públicas
- `/login` - Iniciar sesión
- `/register` - Crear cuenta nueva

### Rutas de Usuario (role: user)
- `/user/tasks` - Mis tareas
- `/user/profile` - Mi perfil

### Rutas de Admin (role: admin)
- `/admin/dashboard` - Dashboard con estadísticas
- `/admin/tasks` - Ver todas las tareas del sistema

## 🔧 API Endpoints (JSON Server)

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `PATCH /users/:id` - Actualizar parcialmente
- `DELETE /users/:id` - Eliminar usuario

### Tareas
- `GET /tasks` - Obtener todas las tareas
- `GET /tasks/:id` - Obtener tarea por ID
- `GET /tasks?userId=:id` - Obtener tareas de un usuario
- `POST /tasks` - Crear nueva tarea
- `PUT /tasks/:id` - Actualizar tarea
- `PATCH /tasks/:id` - Actualizar parcialmente
- `DELETE /tasks/:id` - Eliminar tarea

## 📊 Funcionalidades por Rol

### Usuario (User)
- ✅ Ver solo sus propias tareas
- ✅ Crear nuevas tareas
- ✅ Editar sus tareas
- ✅ Eliminar sus tareas
- ✅ Cambiar estado de tareas (pending, in-progress, completed)
- ✅ Filtrar tareas por estado
- ✅ Buscar tareas
- ✅ Ver estadísticas personales
- ✅ Editar su perfil

### Administrador (Admin)
- ✅ Ver todas las tareas del sistema
- ✅ Dashboard con estadísticas globales
- ✅ Ver lista de usuarios
- ✅ Eliminar cualquier tarea
- ✅ Filtrar todas las tareas
- ✅ Acceso completo al sistema

## 🎨 Características de la Interfaz

- **Diseño Moderno**: Basado en los estilos de CRUDZASO
- **Sidebar de Navegación**: Menú lateral con iconos
- **Tarjetas de Estadísticas**: Visualización clara de métricas
- **Tablas Interactivas**: Con filtros y acciones
- **Modals**: Para crear/editar tareas
- **Badges de Estado**: Indicadores visuales de prioridad y estado
- **Responsive**: Adaptable a móviles y tablets

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. Usuario ingresa credenciales en `/login`
2. El sistema valida contra la base de datos
3. Se genera un token simulado (Base64)
4. Token y usuario se guardan en localStorage
5. Se redirige según el rol:
   - Admin → `/admin/dashboard`
   - User → `/user/tasks`

### Guards de Protección
- **authGuard**: Verifica si el usuario está autenticado
- **roleGuard**: Verifica si el usuario tiene el rol correcto
- **combinedGuard**: Combina ambos guards

## 🛠️ Tecnologías Utilizadas

- **Vanilla JavaScript (ES6+)**: Sin frameworks
- **CSS3**: Estilos modernos con variables CSS
- **JSON Server**: Backend simulado
- **HTML5**: Estructura semántica
- **LocalStorage**: Persistencia de sesión

## 📝 Notas de Desarrollo

### Agregar Nuevas Rutas
```javascript
// En app.js
router.addRoute('/nueva-ruta', renderFunction, { 
    requiresAuth: true,
    role: 'user' // o 'admin'
});
```

### Crear Nueva Vista
```javascript
// views/carpeta/nueva.view.js
export async function renderNuevaVista() {
    const app = document.getElementById('app');
    app.innerHTML = `<!-- Tu HTML aquí -->`;
    
    setupEventListeners();
}
```

### Agregar Nuevo Servicio
```javascript
// services/nuevo.service.js
import { apiService } from './api.service.js';

class NuevoService {
    async metodo() {
        return await apiService.get('/endpoint');
    }
}

export const nuevoService = new NuevoService();
```

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que JSON Server esté instalado: `json-server --version`
- Asegúrate de estar en el directorio correcto
- Puerto 3000 debe estar disponible

### No carga la aplicación
- Verifica que el servidor web esté correcto
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que JSON Server esté corriendo

### Errores de CORS
- JSON Server debe estar en puerto 3000
- La app debe estar en un servidor (no abrir directamente el HTML)

### Los cambios no se reflejan
- Limpia el caché del navegador (Ctrl + Shift + R)
- Verifica que db.json se haya actualizado
- Reinicia JSON Server

## 📚 Recursos Adicionales

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## 🤝 Contribuir

Para contribuir al proyecto:
1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## ✨ Créditos

Diseño basado en **CRUDZASO** - Academic Performance Platform
Desarrollado como proyecto educativo de Single Page Application (SPA)

---

**¡Listo para usar!** 🚀

Para iniciar:
1. `json-server --watch db.json --port 3000`
2. Abre `index.html` con Live Server
3. Login con: admin@crudtask.com / admin123



gracias