// views/user/tasks.view.js
// Vista de tareas del usuario

import { taskService } from '../../services/task.service.js';
import { authService } from '../../services/auth.service.js';
import { router } from '../../router/router.js';

let currentTasks = [];
let currentFilter = 'all';
let searchTerm = '';

export async function renderUserTasks() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-container">
            ${renderSidebar()}
            
            <main class="main-content">
                ${renderHeader()}
                
                <div class="content-container">
                    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h1 class="page-title">My Tasks</h1>
                            <p class="page-description">Manage your academic tasks efficiently</p>
                        </div>
                        <button class="btn-new-task" id="newTaskBtn">
                            <span>+</span>
                            <span>New Task</span>
                        </button>
                    </div>
                    
                    <div id="statsContainer"></div>
                    
                    <div class="search-bar">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="searchInput" class="search-input" placeholder="Search tasks...">
                    </div>
                    
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
        
        ${renderTaskModal()}
    `;

    await loadTasks();
    setupEventListeners();
}

function renderSidebar() {
    const user = authService.getCurrentUser();
    
    return `
        <aside class="sidebar">
            <div class="logo-section">
                <div class="logo-icon">CT</div>
                <div class="logo-text">CRUDTASK</div>
            </div>
            
            <nav>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="/user/tasks" class="nav-link active">
                            <span class="nav-icon">✓</span>
                            <span>My Tasks</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/user/profile" class="nav-link">
                            <span class="nav-icon">👤</span>
                            <span>Profile</span>
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
                <span class="breadcrumb-current">My Tasks</span>
            </div>
            
            <div class="header-actions">
                <div class="user-profile">
                    <div class="user-avatar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                        ${user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-info">
                        <div class="user-name">${user.fullName}</div>
                        <div class="user-role">User</div>
                    </div>
                </div>
                
                <button class="logout-btn" id="logoutBtn" title="Logout">🚪</button>
            </div>
        </header>
    `;
}

function renderTaskModal() {
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
        currentTasks = await taskService.getUserTasks();
        await renderStats();
        renderTasksTable();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error loading tasks', 'error');
    }
}

async function renderStats() {
    const stats = await taskService.getTaskStats(authService.getCurrentUser().id);
    
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
    
    // Aplicar filtro de estado
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilter);
    }
    
    // Aplicar búsqueda
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(term) ||
            task.category?.toLowerCase().includes(term) ||
            task.description?.toLowerCase().includes(term)
        );
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
                    ${filteredTasks.map(task => renderTaskRow(task)).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Agregar event listeners a los botones de acciones
    setupTaskActionListeners();
}

function renderTaskRow(task) {
    const dueDate = new Date(task.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    return `
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
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${task.id}" title="Edit">✏️</button>
                    <button class="action-btn delete delete-btn" data-id="${task.id}" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `;
}

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
    
    // New task button
    document.getElementById('newTaskBtn').addEventListener('click', openTaskModal);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderTasksTable();
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasksTable();
        });
    });
    
    // Modal
    document.getElementById('closeModalBtn').addEventListener('click', closeTaskModal);
    document.getElementById('cancelBtn').addEventListener('click', closeTaskModal);
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });
}

function setupTaskActionListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.dataset.id;
            openTaskModal(taskId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const taskId = btn.dataset.id;
            if (confirm('Are you sure you want to delete this task?')) {
                await deleteTask(taskId);
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
        // Edit mode
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
        // Create mode
        modalTitle.textContent = 'Create New Task';
        document.getElementById('taskId').value = '';
        
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

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
            showNotification('Task updated successfully', 'success');
        } else {
            await taskService.createTask(taskData);
            showNotification('Task created successfully', 'success');
        }
        
        closeTaskModal();
        await loadTasks();
    } catch (error) {
        console.error('Error saving task:', error);
        showNotification('Error saving task', 'error');
    }
}

async function deleteTask(taskId) {
    try {
        await taskService.deleteTask(taskId);
        showNotification('Task deleted successfully', 'success');
        await loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Simple notification (puede mejorarse con una librería de toasts)
    alert(message);
}
