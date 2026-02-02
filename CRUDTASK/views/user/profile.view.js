// views/user/profile.view.js
// Vista de perfil del usuario

import { authService } from '../../services/auth.service.js';
import { taskService } from '../../services/task.service.js';
import { router } from '../../router/router.js';

export async function renderUserProfile() {
    const user = authService.getCurrentUser();
    const stats = await taskService.getTaskStats(user.id);
    
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-container">
            ${renderSidebar()}
            
            <main class="main-content">
                ${renderHeader()}
                
                <div class="content-container">
                    <h1 class="page-title" style="margin-bottom: 2rem;">My Profile</h1>
                    
                    <div class="profile-layout">
                        <!-- Profile Card -->
                        <div>
                            <div class="profile-card">
                                <div class="profile-banner"></div>
                                <div class="profile-avatar-large" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 2.5rem;">
                                    ${user.fullName.charAt(0).toUpperCase()}
                                </div>
                                
                                <h2 class="profile-name">${user.fullName}</h2>
                                <span class="profile-badge">User</span>
                                
                                <div class="profile-email">
                                    <span>✉️</span>
                                    <span>${user.email}</span>
                                </div>
                                
                                <div class="profile-stat">
                                    <div class="profile-stat-value">${stats.total}</div>
                                    <div class="profile-stat-label">Tasks</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Profile Details -->
                        <div>
                            <div class="profile-details">
                                <div class="profile-header">
                                    <h3 class="section-title">Personal Information</h3>
                                    <button class="btn-edit" id="editProfileBtn">
                                        <span>✏️</span>
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                                
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Full Name</div>
                                        <div class="info-value">${user.fullName}</div>
                                    </div>
                                    
                                    <div class="info-item">
                                        <div class="info-label">Email</div>
                                        <div class="info-value">${user.email}</div>
                                    </div>
                                    
                                    <div class="info-item">
                                        <div class="info-label">Role</div>
                                        <div class="info-value">
                                            <span class="category-tag">User</span>
                                        </div>
                                    </div>
                                    
                                    <div class="info-item">
                                        <div class="info-label">Member Since</div>
                                        <div class="info-value">${new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Task Statistics -->
                            <div class="profile-details" style="margin-top: 1.5rem;">
                                <h3 class="section-title" style="margin-bottom: 1.5rem;">Task Statistics</h3>
                                
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                    <div style="padding: 1rem; background: var(--bg-light-blue); border-radius: 0.5rem;">
                                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue); margin-bottom: 0.25rem;">${stats.pending}</div>
                                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Pending</div>
                                    </div>
                                    
                                    <div style="padding: 1rem; background: #dbeafe; border-radius: 0.5rem;">
                                        <div style="font-size: 1.5rem; font-weight: 700; color: #1e40af; margin-bottom: 0.25rem;">${stats.inProgress}</div>
                                        <div style="font-size: 0.875rem; color: var(--text-secondary);">In Progress</div>
                                    </div>
                                    
                                    <div style="padding: 1rem; background: #dcfce7; border-radius: 0.5rem;">
                                        <div style="font-size: 1.5rem; font-weight: 700; color: #166534; margin-bottom: 0.25rem;">${stats.completed}</div>
                                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Completed</div>
                                    </div>
                                    
                                    <div style="padding: 1rem; background: #fed7aa; border-radius: 0.5rem;">
                                        <div style="font-size: 1.5rem; font-weight: 700; color: #9a3412; margin-bottom: 0.25rem;">${stats.highPriority}</div>
                                        <div style="font-size: 0.875rem; color: var(--text-secondary);">High Priority</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        ${renderEditModal()}
    `;

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
                        <a href="/user/tasks" class="nav-link">
                            <span class="nav-icon">✓</span>
                            <span>My Tasks</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/user/profile" class="nav-link active">
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
                <span class="breadcrumb-current">Profile</span>
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

function renderEditModal() {
    const user = authService.getCurrentUser();
    
    return `
        <div id="editModal" class="modal" style="display: none;">
            <div class="modal-content" style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; margin: 2rem auto; box-shadow: var(--shadow-lg);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.5rem; font-weight: 700;">Edit Profile</h2>
                    <button class="btn-icon" id="closeModalBtn" style="font-size: 1.5rem;">✕</button>
                </div>
                
                <form id="editProfileForm">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="editFullName" class="form-input" value="${user.fullName}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="editEmail" class="form-input" value="${user.email}" required>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="width: auto; padding: 0.75rem 2rem;">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authService.logout();
    });
    
    // Edit profile button
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'block';
    });
    
    // Close modal
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // Form submit
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate(link.getAttribute('href'));
        });
    });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function handleEditProfile(e) {
    e.preventDefault();
    
    const user = authService.getCurrentUser();
    const fullName = document.getElementById('editFullName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    
    if (!fullName || !email) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        await authService.updateProfile(user.id, { fullName, email });
        alert('Profile updated successfully');
        closeModal();
        
        // Reload the page to show updated info
        await renderUserProfile();
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}
