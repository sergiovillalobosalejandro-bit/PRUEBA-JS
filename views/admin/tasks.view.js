// views/admin/tasks.view.js
// Vista de todas las tareas (Admin)

import { taskService } from '../../services/task.service.js';
import { authService } from '../../services/auth.service.js';
import { router } from '../../router/router.js';

let currentTasks = [];
let currentFilter = 'all';

export async function renderAdminTasks() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-container">
            ${renderSidebar()}
            <main class="main-content">
                ${renderHeader()}
                
                <div class="content-container">
                    <div class="page-header">
                        <h1 class="page-title">All Tasks</h1>
                        <p class="page-description">Manage all system tasks</p>
                    </div>
                    
                    <div id="statsContainer"></div>
                    
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">All Tasks</button>
                        <button class="filter-tab" data-filter="pending">Pending</button>
                        <button class="filter-tab" data-filter="in-progress">In Progress</button>
                        <button class="filter-tab" data-filter="completed">Completed</button>
                    </div>
                    
                    <div id="tasksContainer"></div>
                </div>
            </main>
        </div>

        <!-- BUG 2 ARREGLADO: el modal se inserta al DOM aquí, al mismo nivel que app-container -->
        ${renderTaskModal()}
    `;

    await loadTasks();
    setupEventListeners();
}

function renderSidebar() {
    return `
        <aside class="sidebar">
            <div class="logo-section">
                <div class="logo-icon">CT</div>
                <div class="logo-text">CRUDTASK</div>
            </div>
            
            <nav>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="/admin/dashboard" class="nav-link">
                            <span class="nav-icon">📊</span>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/admin/tasks" class="nav-link active">
                            <span class="nav-icon">✓</span>
                            <span>All Tasks</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    `;
}

function renderHeader() {
    const user = authService.getCurrentUser();
    
    return `
        <header class="top-header">
            <div class="breadcrumb">
                <span>🏠</span>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current">All Tasks</span>
            </div>
            
            <div class="header-actions">
                <div class="user-profile">
                    <div class="user-avatar" style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                        ${user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user.fullName}</div>
                        <div class="user-role">Admin</div>
                    </div>
                </div>
                
                <button class="logout-btn" id="logoutBtn" title="Logout">🚪</button>
            </div>
        </header>
    `;
}

function renderTaskModal() {
    // Esta función solo retorna el string HTML del modal.
    // Antes no se insertaba en ningún lugar del DOM.
    return `
        <div id="taskModal" class="modal" style="display: none;">
            <div class="modal-content" style="background: white; padding: 2rem; border-radius: 1rem; max-width: 600px; margin: 2rem auto; box-shadow: var(--shadow-lg);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.5rem; font-weight: 700;" id="modalTitle">Create New Task</h2>
                    <button class="btn-icon" id="closeModalBtn" style="font-size: 1.5rem;">✕</button>
                </div>
                
                <form id="taskForm">
                    <input type="hidden" id="taskId">
                    
                    <div class="form-group">
                        <label class="form-label">Task Title</label>
                        <input type="text" id="taskTitle" class="form-input" placeholder="e.g., Complete Quarter 3 Report" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select id="taskCategory" class="form-select" required>
                                <option value="">Select category...</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="History">History</option>
                                <option value="Literature">Literature</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select id="taskPriority" class="form-select" required>
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select id="taskStatus" class="form-select" required>
                                <option value="pending" selected>Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="date" id="taskDueDate" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea id="taskDescription" class="form-textarea" placeholder="Add details about this task..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="width: auto; padding: 0.75rem 2rem;">
                            <span id="submitBtnText">💾 Save Task</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function loadTasks() {
    try {
        currentTasks = await taskService.getAllTasks();
        await renderStats();
        renderTasksTable();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function renderStats() {
    const stats = await taskService.getTaskStats();
    
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = `
        <div class="stats-grid" style="margin-bottom: 2rem;">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Tasks</span>
                    <div class="stat-icon blue">📋</div>
                </div>
                <div class="stat-value">${stats.total}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">In Progress</span>
                    <div class="stat-icon blue">⚡</div>
                </div>
                <div class="stat-value">${stats.inProgress}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Completed</span>
                    <div class="stat-icon green">✓</div>
                </div>
                <div class="stat-value">${stats.completed}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pending</span>
                    <div class="stat-icon orange">⏰</div>
                </div>
                <div class="stat-value">${stats.pending}</div>
            </div>
        </div>
    `;
}

function renderTasksTable() {
    let filteredTasks = currentTasks;
    
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilter);
    }
    
    const tasksContainer = document.getElementById('tasksContainer');
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="table-container" style="text-align: center; padding: 3rem;">
                <p style="color: var(--text-secondary); font-size: 1.125rem;">No tasks found</p>
            </div>
        `;
        return;
    }
    
    tasksContainer.innerHTML = `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>TASK NAME</th>
                        <th>CATEGORY</th>
                        <th>PRIORITY</th>
                        <th>STATUS</th>
                        <th>DUE DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTasks.map(task => `
                        <tr>
                            <td>
                                <div class="task-title">${task.title}</div>
                            </td>
                            <td>
                                <span class="category-tag">${task.category}</span>
                            </td>
                            <td>
                                <div class="priority-indicator">
                                    <span class="priority-dot ${task.priority}"></span>
                                    <span>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge ${task.status}">${task.status.replace('-', ' ')}</span>
                            </td>
                            <td>${new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit-btn" data-id="${task.id}" title="Edit">✏️</button>
                                    <button class="action-btn delete delete-btn" data-id="${task.id}" title="Delete">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // BUG 1 ARREGLADO: se removieron las dos llamadas sueltas que estaban aquí
    //   openTaskModal(taskId)   <-- taskId no existía en este scope
    //   renderTaskModal(taskId) <-- no se usaba el retorno ni recibe parámetro

    // BUG 4 ARREGLADO: edit-btn y delete-btn se setean aquí, DESPUÉS de que
    // la tabla ya existe en el DOM
    setupTaskActionListeners();
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
    
    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasksTable();
        });
    });

    // BUG 3 ARREGLADO: estos listeners estaban DENTRO del click de los filter-tabs.
    // Se movieron aquí al mismo nivel porque el modal ya existe en el DOM desde que
    // renderAdminTasks() terminó.
    document.getElementById('taskForm')
        ?.addEventListener('submit', handleTaskSubmit);
    document.getElementById('closeModalBtn')
        ?.addEventListener('click', closeTaskModal);
    document.getElementById('cancelBtn')
        ?.addEventListener('click', closeTaskModal);
    
    // Navegación sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });
}

// BUG 4 ARREGLADO: edit-btn se movió aquí junto con delete-btn.
// Ambos se setean cada vez que se re-renderiza la tabla, que es el único
// momento en que los botones existen en el DOM.
function setupTaskActionListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.dataset.id;
            openTaskModal(taskId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const taskId = btn.dataset.id;
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    await taskService.deleteTask(taskId);
                    alert('Task deleted successfully');
                    await loadTasks();
                } catch (error) {
                    console.error('Error deleting task:', error);
                    alert('Error deleting task');
                }
            }
        });
    });
}

function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('taskForm');
    
    form.reset();
    
    if (taskId) {
        modalTitle.textContent = 'Edit Task';
        const task = currentTasks.find(t => t.id == taskId);
        
        if (task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskDescription').value = task.description || '';
        }
    } else {
        modalTitle.textContent = 'Create New Task';
        document.getElementById('taskId').value = '';
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

// BUG 5 ARREGLADO: antes solo hacía updateTask cuando taskId existía,
// pero no tenía rama para crear. Se agregó el else con createTask.
async function handleTaskSubmit(e) {
    e.preventDefault();

    const taskId = document.getElementById('taskId').value;

    const taskData = {
        title: document.getElementById('taskTitle').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        dueDate: document.getElementById('taskDueDate').value,
        description: document.getElementById('taskDescription').value
    };

    try {
        if (taskId) {
            await taskService.updateTask(taskId, taskData);
            alert('Task updated successfully');
        } else {
            await taskService.createTask(taskData);
            alert('Task created successfully');
        }

        closeTaskModal();
        await loadTasks();
    } catch (error) {
        console.error(error);
        alert('Error saving task');
    }
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}
