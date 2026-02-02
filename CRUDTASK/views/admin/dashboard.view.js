// views/admin/dashboard.view.js
// Dashboard del administrador

import { taskService } from '../../services/task.service.js';
import { authService } from '../../services/auth.service.js';
import { apiService } from '../../services/api.service.js';
import { router } from '../../router/router.js';

export async function renderAdminDashboard() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-container">
            ${renderSidebar()}
            
            <main class="main-content">
                ${renderHeader()}
                
                <div class="content-container">
                    <div class="page-header">
                        <h1 class="page-title">Admin Dashboard</h1>
                        <p class="page-description">Overview of all system tasks and users</p>
                    </div>
                    
                    <div id="statsContainer"></div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-top: 2rem;">
                        <div id="recentTasksContainer"></div>
                        <div id="usersContainer"></div>
                    </div>
                </div>
            </main>
        </div>
    `;

    await loadDashboardData();
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
                        <a href="/admin/dashboard" class="nav-link active">
                            <span class="nav-icon">📊</span>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/admin/tasks" class="nav-link">
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
                <span class="breadcrumb-current">Dashboard</span>
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

async function loadDashboardData() {
    try {
        const stats = await taskService.getTaskStats();
        const allTasks = await taskService.getAllTasks();
        const users = await apiService.get('/users');
        
        renderStats(stats);
        renderRecentTasks(allTasks.slice(0, 5));
        renderUsers(users);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function renderStats(stats) {
    const statsContainer = document.getElementById('statsContainer');
    
    const completionRate = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;
    
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Tasks</span>
                    <div class="stat-icon blue">📋</div>
                </div>
                <div class="stat-value">${stats.total}</div>
                <div class="stat-info neutral">
                    <span>📊</span>
                    <span>All users</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Completed</span>
                    <div class="stat-icon green">✓</div>
                </div>
                <div class="stat-value">${stats.completed}</div>
                <div class="stat-info positive">
                    <span>📈</span>
                    <span>${completionRate}% completion</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Pending</span>
                    <div class="stat-icon orange">⏰</div>
                </div>
                <div class="stat-value">${stats.pending}</div>
                <div class="stat-info warning">
                    <span>⚠️</span>
                    <span>${stats.highPriority} High Priority</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">In Progress</span>
                    <div class="stat-icon purple">⚡</div>
                </div>
                <div class="stat-value">${stats.inProgress}</div>
                <div class="stat-info neutral">
                    <span>🔄</span>
                    <span>Active</span>
                </div>
            </div>
        </div>
    `;
}

function renderRecentTasks(tasks) {
    const container = document.getElementById('recentTasksContainer');
    
    container.innerHTML = `
        <div class="table-container">
            <h3 style="padding: 1.5rem; margin: 0; font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid var(--border-color);">
                Recent Tasks
            </h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>TASK</th>
                        <th>STATUS</th>
                        <th>PRIORITY</th>
                        <th>DUE DATE</th>
                    </tr>
                </thead>
                <tbody>
                    ${tasks.map(task => `
                        <tr>
                            <td>${task.title}</td>
                            <td><span class="status-badge ${task.status}">${task.status.replace('-', ' ')}</span></td>
                            <td>
                                <div class="priority-indicator">
                                    <span class="priority-dot ${task.priority}"></span>
                                    <span>${task.priority}</span>
                                </div>
                            </td>
                            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderUsers(users) {
    const container = document.getElementById('usersContainer');
    
    container.innerHTML = `
        <div class="table-container">
            <h3 style="padding: 1.5rem; margin: 0; font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid var(--border-color);">
                Users (${users.length})
            </h3>
            <div style="padding: 1.5rem;">
                ${users.map(user => `
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                            ${user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 0.875rem;">${user.fullName}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${user.email}</div>
                        </div>
                        <span class="category-tag" style="font-size: 0.75rem;">${user.role}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });
}
