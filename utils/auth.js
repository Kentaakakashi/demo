class AuthManager {
    constructor() {
        this.currentUser = null;
        this.checkAutoLogin();
    }

    checkAutoLogin() {
        const savedUser = localStorage.getItem('studyzen_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.setUserOnline(true);
        }
    }

    login(username, password) {
        const result = studyDB.authenticateUser(username, password);
        
        if (result.success) {
            this.currentUser = result.user;
            localStorage.setItem('studyzen_current_user', JSON.stringify(result.user));
            this.setUserOnline(true);
            
            // Show welcome notification
            showNotification(`Welcome back, ${result.user.displayName}!`, 'success');
            
            return { success: true, user: result.user };
        }
        
        showNotification(result.message, 'error');
        return result;
    }

    signup(username, displayName, password) {
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return { success: false, message: 'Password too short' };
        }

        const result = studyDB.createUser(username, displayName, password);
        
        if (result.success) {
            this.currentUser = result.user;
            localStorage.setItem('studyzen_current_user', JSON.stringify(result.user));
            this.setUserOnline(true);
            
            // Auto-create first achievement
            studyDB.checkAchievements(username, { total: 0, streak: 0 });
            
            showNotification(`Account created successfully! Welcome to StudyZen 🎉`, 'success');
            
            return { success: true, user: result.user };
        }
        
        showNotification(result.message, 'error');
        return result;
    }

    logout() {
        if (this.currentUser) {
            this.setUserOnline(false);
            showNotification(`Goodbye, ${this.currentUser.displayName}! See you soon.`, 'info');
        }
        
        this.currentUser = null;
        localStorage.removeItem('studyzen_current_user');
        return true;
    }

    setUserOnline(isOnline) {
        if (this.currentUser) {
            studyDB.updateUser(this.currentUser.username, { 
                isOnline: isOnline,
                lastActive: new Date().toISOString()
            });
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    updateProfile(updates) {
        if (!this.currentUser) return false;
        
        const result = studyDB.updateUser(this.currentUser.username, updates);
        if (result) {
            this.currentUser = { ...this.currentUser, ...updates };
            localStorage.setItem('studyzen_current_user', JSON.stringify(this.currentUser));
            showNotification('Profile updated successfully!', 'success');
        }
        return result;
    }
}

// Create global auth instance
const authManager = new AuthManager();

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    // Close button style
    notification.querySelector('.close-notification').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
    `;

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    document.body.appendChild(notification);

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
