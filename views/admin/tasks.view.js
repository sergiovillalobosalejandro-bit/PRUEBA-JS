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
    
    setupTaskActionListeners();
    openTaskModal(taskId)
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasksTable();
        });
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });
        // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.dataset.id;
            openTaskModal(taskId);
        });
    });
}

function setupTaskActionListeners() {
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


