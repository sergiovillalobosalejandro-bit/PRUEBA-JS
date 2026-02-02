# CRUDTASK - Academic Task Management System

A complete academic task management system with authentication, user roles, and CRUD operations.

## 📋 Features

- ✅ **Full Authentication**: User login and registration
- 👥 **Role System**: Admin and User with different permissions
- 📝 **Task CRUD**: Create, read, update, and delete tasks
- 🔒 **Route Protection**: Guards to protect routes based on role
- 📊 **Dashboard**: Statistics and data visualization
- 🎨 **Modern Design**: Professional interface based on CRUDZASO
- 📱 **Responsive**: Adaptable to mobile devices

## 🏗️ Project Structure

```
CRUDTASK/
│
├── index.html # Single SPA container
│
├── styles/
│ └── main.css # Styles Complete
│
├── router/
│ └── router.js # SPA Navigation System
│
├── services/
│ ├── api.service.js # Communication with JSON Server
│ ├── auth.service.js # Authentication and Session
│ └── task.service.js # Task CRUD
│
├── guards/
│ └── role.guard.js # Route Protection by Role
│
├── views/
│ ├── auth/
│ │ ├── login.view.js # Login View
│ │ └── register.view.js # Registration View
│ │
│ ├── user/
│ │ ├── tasks.view.js # User Tasks
│ │ └── profile.view.js # User Profile
│ │
│ └── admin/
│ ├── dashboard.view.js # Admin Dashboard
│ └── tasks.view.js # All Tasks
│
├── app.js # Application Bootstrap
├── db.json # JSON Database Server
└── README.md # This file
```

## 🚀 Installation and Configuration

### Prerequisites

- Node.js installed (v14 or higher)
- npm or yarn

### Step 1: Install JSON Server

```bash
npm install -g json-server
```

### Step 2: Start the server

```bash
json-server --watch db.json --port 3000
```

The server will be available at: `http://localhost:3000`

### Step 3: Start the application

Option 1 - Using Live Server (VSCode):
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

Option 2 - Using Python:
```bash
python -m http.server 8000
```

Option 3 - Using Node:
```bash
`npm install -g http-server`
`http-server -p 8000`
```

Access to: `http://localhost:8000`

## 👤 Test Accounts

### Administrator
- **Email**: admin@crudtask.com
- **Password**: admin123
- **Access**: Full dashboard, all tasks

### User
- **Email**: user@crudtask.com
- **Password**: user123
- **Access**: Only your tasks, personal profile

## 📱 Application Routes

### Public Routes
- `/login` - Log in
- `/register` - Create a new account

### User Routes (role: user)
- `/user/tasks` - My tasks
- `/user/profile` - My profile

### Admin Paths (role: admin)
- `/admin/dashboard` - Dashboard with statistics
- `/admin/tasks` - View all system tasks

## 🔧 API Endpoints (JSON Server)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `PATCH /users/:id` - Partially update
- `DELETE /users/:id` - Delete user

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `GET /tasks?userId=:id` - Get tasks for a user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `PATCH /tasks/:id` - Partially update a task
- `DELETE /tasks/:id` - Delete a task

## 📊 Functionalities by Role

### User
- ✅ View only your own tasks
- ✅ Create new tasks
- ✅ Edit your tasks
- ✅ Delete your tasks
- ✅ Change task status (pending, in progress, completed)
- ✅ Filter tasks by status
- ✅ Search for tasks
- ✅ View personal statistics
- ✅ Edit your profile

### Administrator
- ✅ View all system tasks
- ✅ Dashboard with global statistics
- ✅ View user list
- ✅ Delete any task
- ✅ Filter all tasks Tasks
- ✅ Full system access

## 🎨 Interface Features

- **Modern Design**: Based on CRUDZASO styles
- **Navigation Sidebar**: Side menu with icons
- **Statistics Cards**: Clear visualization of metrics
- **Interactive Tables**: With filters and actions
- **Modals**: For creating/editing tasks
- **Status Badges**: Visual indicators of priority and status
- **Responsive**: Adaptable to mobile phones and tablets

## 🔐 Authentication System

### Authentication Flow
1. User enters credentials in `/login`
2. The system validates against the database
3. A dummy token (Base64) is generated
4. Token and username are saved in localStorage
5. Redirection based on role:

- Admin → `/admin/dashboard`

- User → `/user/tasks`

### Protection Guards
- **authGuard**: Verifies if the user is authenticated    async delete    async deleteTask(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }    async deleteTask(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }    async deleteTask(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }Task(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }
- **roleGuard**: Verifies if the user has the correct role
- **combinedGuard**: Combines both guards
    async deleteTask(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }
## 🛠️ Technologies Used    async deleteTask(taskId) {
        try {
            return await apiService.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }

- **Vanilla JavaScript (ES6+)**: No frameworks
- **CSS3**: Modern styles with CSS variables
- **JSON Server**: Mocked backend
- **HTML5**: Semantic structure
- **LocalStorage**: Session persistence

## 📝 Development Notes

### Adding New Routes
```javascript
// In app.js
router.addRoute('/new-route', renderFunction, {

requiresAuth: true,

role: 'user' // or 'admin'
});

``

### Creating a New View
```javascript
// views/folder/new.view.js
export async function renderNewView() {

const app = document.getElementById('app');
app.innerHTML = `<!-- Your HTML here -->`;

setupEventListeners();

}
```

### Add New Service
```javascript
// services/new.service.js
import { apiService } from './api.service.js';

class NewService {
async method() {
return await apiService.get('/endpoint');

}
}

export const newService = new NewService();

```

## 🐛 Troubleshooting

### Server won't start
- Verify that JSON Server is installed: `json-server --version`
- Ensure you are in the correct directory
- Port 3000 must be available

### Application won't load
- Verify that the web server is working correctly
- Open the browser console (F12) to check for errors
- Ensure that JSON Server is running

### CORS errors
- JSON Server must be on port 3000
- The app must be on a server (do not open the HTML directly)

### Changes not reflected
- Clear browser cache (Ctrl + Shift + R)
- Verify that db.json has been updated
- Restart JSON Server

## 📚 Additional Resources

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [MDN Web Docs - Fetch API] (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- ES6 Modules (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## 🤝 Contribute

To contribute to the project:
1. Fork the repository
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available for educational use.

## ✨ Credits

Design based on **CRUDZASO** - Academic Performance Platform
Developed as an educational Single Page Application (SPA) project

---

**Ready to use!** 🚀

To get started:
1. `json-server --watch db.json --port 3000`
2. Open `index.html` with Live Server
3. Log in with: admin@crudtask.com / admin123