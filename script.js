// Main Application Controller
class StudyZenApp {
    constructor() {
        this.currentPage = 'landing';
        this.init();
    }

    init() {
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            this.loadPage();
        }, 2000);

        // Setup theme toggle button
        document.getElementById('theme-toggle').addEventListener('click', () => {
            themeManager.showThemeSelector();
        });

        // Setup modal close button
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('theme-modal').classList.add('hidden');
        });

        // Close modal when clicking outside
        document.getElementById('theme-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                e.currentTarget.classList.add('hidden');
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T for theme selector
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                themeManager.showThemeSelector();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                document.getElementById('theme-modal').classList.add('hidden');
            }
        });
    }

    loadPage(page = null) {
        if (page) this.currentPage = page;
        
        switch (this.currentPage) {
            case 'landing':
                this.loadLandingPage();
                break;
            case 'login':
                this.loadLoginPage();
                break;
            case 'signup':
                this.loadSignupPage();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            default:
                this.loadLandingPage();
        }
    }

    loadLandingPage() {
        document.getElementById('app').innerHTML = `
            <div class="landing-container">
                <div class="landing-content">
                    <h1 class="landing-title">
                        <i class="fas fa-graduation-cap"></i> StudyZen
                    </h1>
                    <p class="landing-subtitle">
                        Your ultimate study companion with AI assistance, productivity tools, and study community
                    </p>
                    
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">⏰</div>
                            <h3>Smart Timer</h3>
                            <p>Pomodoro timer with customizable intervals</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🤖</div>
                            <h3>AI Study Assistant</h3>
                            <p>Get help with study questions instantly</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">📊</div>
                            <h3>Detailed Stats</h3>
                            <p>Track your study habits and progress</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">👥</div>
                            <h3>Study Community</h3>
                            <p>Connect with other students worldwide</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🎮</div>
                            <h3>Gamification</h3>
                            <p>Earn achievements and level up</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🎨</div>
                            <h3>Multiple Themes</h3>
                            <p>Choose from 16+ beautiful themes</p>
                        </div>
                    </div>
                    
                    <div class="landing-buttons">
                        <button class="btn-primary" id="start-learning">
                            <i class="fas fa-rocket"></i> Start Learning Now
                        </button>
                        <button class="btn-secondary" id="explore-features">
                            <i class="fas fa-compass"></i> Explore Features
                        </button>
                    </div>
                    
                    <div style="margin-top: 40px; font-size: 0.9rem; opacity: 0.8;">
                        <p>Join 1,000+ students improving their study habits</p>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('start-learning').addEventListener('click', () => {
            if (authManager.isLoggedIn()) {
                this.loadPage('dashboard');
            } else {
                this.loadPage('login');
            }
        });

        document.getElementById('explore-features').addEventListener('click', () => {
            alert('Dashboard preview coming soon! For now, please login or sign up.');
        });
    }

    loadLoginPage() {
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <div class="auth-header">
                        <button class="back-button" id="back-to-landing">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <h1><i class="fas fa-sign-in-alt"></i> Welcome Back</h1>
                        <p>Login to continue your study journey</p>
                    </div>
                    
                    <form id="login-form">
                        <div class="input-group">
                            <label for="username">
                                <i class="fas fa-user"></i> Username
                            </label>
                            <input type="text" id="username" placeholder="Enter your username" required>
                        </div>
                        
                        <div class="input-group">
                            <label for="password">
                                <i class="fas fa-lock"></i> Password
                            </label>
                            <input type="password" id="password" placeholder="Enter your password" required>
                            <button type="button" class="show-password" id="show-password-btn">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        
                        <div class="remember-me">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Keep me logged in</label>
                        </div>
                        
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div class="auth-links">
                            <p>New to StudyZen? <a href="#" id="go-to-signup">Create Account</a></p>
                            <p><a href="#" id="forgot-password">Forgot Password?</a></p>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add auth styles
        this.addAuthStyles();

        // Add event listeners
        document.getElementById('back-to-landing').addEventListener('click', () => {
            this.loadPage('landing');
        });

        document.getElementById('go-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadPage('signup');
        });

        document.getElementById('show-password-btn').addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = document.getElementById('show-password-btn').querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset feature coming soon! For now, please create a new account.');
        });
    }

    loadSignupPage() {
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <div class="auth-header">
                        <button class="back-button" id="back-to-landing">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        <h1><i class="fas fa-user-plus"></i> Join StudyZen</h1>
                        <p>Create your account and start studying smarter</p>
                    </div>
                    
                    <form id="signup-form">
                        <div class="input-group">
                            <label for="new-username">
                                <i class="fas fa-at"></i> Username *
                            </label>
                            <input type="text" id="new-username" placeholder="Choose a unique username" required>
                            <small>This will be your login ID</small>
                        </div>
                        
                        <div class="input-group">
                            <label for="display-name">
                                <i class="fas fa-user-circle"></i> Display Name
                            </label>
                            <input type="text" id="display-name" placeholder="How others will see you">
                            <small>Leave empty to use username</small>
                        </div>
                        
                        <div class="input-group">
                            <label for="new-password">
                                <i class="fas fa-lock"></i> Password *
                            </label>
                            <input type="password" id="new-password" placeholder="At least 6 characters" required>
                            <div class="password-strength" id="password-strength">
                                <div class="strength-bar"></div>
                                <span class="strength-text">Weak</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="confirm-password">
                                <i class="fas fa-lock"></i> Confirm Password *
                            </label>
                            <input type="password" id="confirm-password" placeholder="Re-enter your password" required>
                            <div id="password-match"></div>
                        </div>
                        
                        <button type="submit" class="auth-submit-btn">
                            <i class="fas fa-check-circle"></i> Create Account
                        </button>
                        
                        <div class="auth-links">
                            <p>Already have an account? <a href="#" id="go-to-login">Login here</a></p>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add auth styles
        this.addAuthStyles();

        // Add event listeners
        document.getElementById('back-to-landing').addEventListener('click', () => {
            this.loadPage('landing');
        });

        document.getElementById('go-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadPage('login');
        });

        // Password strength checker
        document.getElementById('new-password').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Password match checker
        document.getElementById('confirm-password').addEventListener('input', () => {
            this.checkPasswordMatch();
        });

        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
    }

    addAuthStyles() {
        // Add auth-specific styles if not already added
        if (!document.querySelector('#auth-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-styles';
            style.textContent = `
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .auth-box {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    width: 100%;
                    max-width: 450px;
                    animation: slideUp 0.5s ease;
                }
                
                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                    position: relative;
                }
                
                .back-button {
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #f0f0f0;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .back-button:hover {
                    background: #e0e0e0;
                }
                
                .auth-header h1 {
                    color: #667eea;
                    margin-bottom: 10px;
                    font-size: 2rem;
                }
                
                .auth-header p {
                    color: #666;
                    font-size: 1rem;
                }
                
                .input-group {
                    margin-bottom: 20px;
                    position: relative;
                }
                
                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .input-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    font-size: 16px;
                    transition: border 0.3s;
                }
                
                .input-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .input-group small {
                    display: block;
                    margin-top: 5px;
                    color: #888;
                    font-size: 0.85rem;
                }
                
                .show-password {
                    position: absolute;
                    right: 15px;
                    top: 40px;
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    font-size: 18px;
                }
                
                .password-strength {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .strength-bar {
                    flex: 1;
                    height: 6px;
                    background: #eee;
                    border-radius: 3px;
                    overflow: hidden;
                }
                
                .strength-bar::after {
                    content: '';
                    display: block;
                    height: 100%;
                    width: 0%;
                    background: #f44336;
                    transition: width 0.3s, background 0.3s;
                }
                
                .strength-text {
                    font-size: 0.85rem;
                    color: #888;
                    min-width: 40px;
                }
                
                #password-match {
                    margin-top: 5px;
                    font-size: 0.85rem;
                    min-height: 20px;
                }
                
                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 20px 0;
                }
                
                .remember-me input {
                    width: 18px;
                    height: 18px;
                }
                
                .auth-submit-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                
                .auth-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                }
                
                .auth-links {
                    margin-top: 25px;
                    text-align: center;
                }
                
                .auth-links p {
                    margin: 10px 0;
                    color: #666;
                }
                
                .auth-links a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .auth-links a:hover {
                    text-decoration: underline;
                }
            `;
            document.head.appendChild(style);
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        let color = '#f44336';
        let text = 'Weak';
        
        if (password.length >= 6) strength = 1;
        if (password.length >= 8) strength = 2;
        if (/[A-Z]/.test(password)) strength = Math.max(strength, 3);
        if (/[0-9]/.test(password)) strength = Math.max(strength, 4);
        if (/[^A-Za-z0-9]/.test(password)) strength = Math.max(strength, 5);
        
        switch(strength) {
            case 0: color = '#f44336'; text = 'Weak'; break;
            case 1: color = '#FF9800'; text = 'Fair'; break;
            case 2: color = '#FFC107'; text = 'Good'; break;
            case 3: color = '#8BC34A'; text = 'Strong'; break;
            case 4: color = '#4CAF50'; text = 'Very Strong'; break;
            case 5: color = '#2E7D32'; text = 'Excellent'; break;
        }
        
        strengthBar.style.setProperty('--strength-width', `${strength * 20}%`);
        strengthBar.style.setProperty('--strength-color', color);
        strengthBar.querySelector('::after').style.width = `${strength * 20}%`;
        strengthBar.querySelector('::after').style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    checkPasswordMatch() {
        const password = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;
        const matchDiv = document.getElementById('password-match');
        
        if (confirm.length === 0) {
            matchDiv.textContent = '';
            matchDiv.style.color = '';
            return;
        }
        
        if (password === confirm) {
            matchDiv.textContent = '✓ Passwords match';
            matchDiv.style.color = '#4CAF50';
        } else {
            matchDiv.textContent = '✗ Passwords do not match';
            matchDiv.style.color = '#f44336';
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const result = authManager.login(username, password);
        if (result.success) {
            this.loadPage('dashboard');
        }
    }

    handleSignup() {
        const username = document.getElementById('new-username').value;
        const displayName = document.getElementById('display-name').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validation
        if (!username || !password) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        const result = authManager.signup(username, displayName || username, password);
        if (result.success) {
            this.loadPage('dashboard');
        }
    }

    loadDashboard() {
        if (!authManager.isLoggedIn()) {
            this.loadPage('login');
            return;
        }

        const user = authManager.getUser();
        const stats = studyDB.getUserStats(user.username);
        
        document.getElementById('app').innerHTML = `
            <div class="dashboard">
                <!-- Dashboard Header -->
                <header class="dashboard-header">
                    <div class="header-left">
                        <div class="user-profile">
                            <div class="avatar">
                                ${user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-info">
                                <h2 class="greeting">Hello, ${user.displayName}!</h2>
                                <p class="user-status">
                                    <span class="status-indicator online"></span>
                                    Online • Streak: ${stats.streak} days 🔥
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="header-right">
                        <button class="header-btn" id="quick-timer">
                            <i class="fas fa-play-circle"></i> Quick Start
                        </button>
                        <button class="header-btn" id="notifications-btn">
                            <i class="fas fa-bell"></i>
                            <span class="notification-count">0</span>
                        </button>
                        <button class="header-btn" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </header>
                
                <!-- Main Content -->
                <main class="dashboard-main">
                    <!-- Sidebar -->
                    <aside class="dashboard-sidebar">
                        <nav class="sidebar-nav">
                            <button class="nav-btn active" data-page="overview">
                                <i class="fas fa-home"></i> Overview
                            </button>
                            <button class="nav-btn" data-page="timer">
                                <i class="fas fa-clock"></i> Pomodoro Timer
                            </button>
                            <button class="nav-btn" data-page="stopwatch">
                                <i class="fas fa-stopwatch"></i> Study Stopwatch
                            </button>
                            <button class="nav-btn" data-page="stats">
                                <i class="fas fa-chart-bar"></i> Statistics
                            </button>
                            <button class="nav-btn" data-page="chatbot">
                                <i class="fas fa-robot"></i> AI Study Assistant
                            </button>
                            <button class="nav-btn" data-page="planner">
                                <i class="fas fa-calendar-alt"></i> Study Planner
                            </button>
                            <button class="nav-btn" data-page="achievements">
                                <i class="fas fa-trophy"></i> Achievements
                            </button>
                            <button class="nav-btn" data-page="flashcards">
                                <i class="fas fa-layer-group"></i> Flashcards
                            </button>
                            <button class="nav-btn" data-page="notes">
                                <i class="fas fa-sticky-note"></i> Notes
                            </button>
                            <button class="nav-btn" data-page="community">
                                <i class="fas fa-users"></i> Community
                            </button>
                            <button class="nav-btn" data-page="profiles">
                                <i class="fas fa-user-friends"></i> Find Friends
                            </button>
                            <button class="nav-btn" data-page="support">
                                <i class="fas fa-question-circle"></i> Support
                            </button>
                            <button class="nav-btn" data-page="settings">
                                <i class="fas fa-cog"></i> Settings
                            </button>
                        </nav>
                        
                        <!-- Quick Stats -->
                        <div class="quick-stats">
                            <h3>Today's Progress</h3>
                            <div class="stats-card">
                                <div class="stat-item">
                                    <i class="fas fa-clock"></i>
                                    <div>
                                        <span class="stat-value">${this.formatTime(this.getTodayStudyTime(user.username))}</span>
                                        <span class="stat-label">Study Time</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <i class="fas fa-fire"></i>
                                    <div>
                                        <span class="stat-value">${stats.streak}</span>
                                        <span class="stat-label">Day Streak</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    
                    <!-- Content Area -->
                    <section class="dashboard-content">
                        <div class="welcome-banner">
                            <h1>Welcome to Your Study Dashboard! 📚</h1>
                            <p>Ready to boost your productivity? Choose a tool from the sidebar to get started.</p>
                            <div class="quick-actions">
                                <button class="action-btn" id="start-pomodoro">
                                    <i class="fas fa-play"></i> Start Pomodoro
                                </button>
                                <button class="action-btn" id="ask-ai">
                                    <i class="fas fa-robot"></i> Ask AI Assistant
                                </button>
                                <button class="action-btn" id="view-stats">
                                    <i class="fas fa-chart-line"></i> View Stats
                                </button>
                            </div>
                        </div>
                        
                        <!-- Features will be loaded here -->
                        <div id="feature-container"></div>
                    </section>
                </main>
            </div>
        `;

        // Add dashboard styles
        this.addDashboardStyles();

        // Add event listeners
        this.setupDashboardListeners();
    }

    addDashboardStyles() {
        if (!document.querySelector('#dashboard-styles')) {
            const style = document.createElement('style');
            style.id = 'dashboard-styles';
            style.textContent = `
                .dashboard {
                    min-height: 100vh;
                    background: #f5f7fa;
                }
                
                .dashboard-header {
                    background: white;
                    padding: 20px 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .avatar {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                
                .greeting {
                    font-size: 1.3rem;
                    color: #333;
                    margin-bottom: 5px;
                }
                
                .user-status {
                    color: #666;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .status-indicator.online {
                    background: #4CAF50;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .header-right {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .header-btn {
                    padding: 10px 20px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    color: #555;
                    transition: all 0.3s;
                    position: relative;
                }
                
                .header-btn:hover {
                    background: #e0e0e0;
                    transform: translateY(-2px);
                }
                
                #quick-timer {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .notification-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #f44336;
                    color: white;
                    font-size: 0.8rem;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .dashboard-main {
                    display: flex;
                    min-height: calc(100vh - 90px);
                }
                
                .dashboard-sidebar {
                    width: 250px;
                    background: white;
                    padding: 20px;
                    border-right: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                }
                
                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                }
                
                .nav-btn {
                    padding: 12px 15px;
                    text-align: left;
                    border: none;
                    background: none;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #666;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                }
                
                .nav-btn:hover {
                    background: #f5f7fa;
                    color: #667eea;
                }
                
                .nav-btn.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .quick-stats {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }
                
                .quick-stats h3 {
                    font-size: 1rem;
                    color: #666;
                    margin-bottom: 15px;
                }
                
                .stats-card {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                }
                
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .stat-item:last-child {
                    margin-bottom: 0;
                }
                
                .stat-item i {
                    font-size: 1.5rem;
                    color: #667eea;
                }
                
                .stat-value {
                    display: block;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #333;
                }
                
                .stat-label {
                    font-size: 0.85rem;
                    color: #888;
                }
                
                .dashboard-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }
                
                .welcome-banner {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                }
                
                .welcome-banner h1 {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                
                .welcome-banner p {
                    opacity: 0.9;
                    margin-bottom: 20px;
                }
                
                .quick-actions {
                    display: flex;
                    gap: 15px;
                }
                
                .action-btn {
                    padding: 12px 25px;
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                
                .action-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-3px);
                }
                
                #feature-container {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupDashboardListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadFeature(btn.dataset.page);
            });
        });

        // Quick action buttons
        document.getElementById('start-pomodoro').addEventListener('click', () => {
            this.loadFeature('timer');
        });

        document.getElementById('ask-ai').addEventListener('click', () => {
            this.loadFeature('chatbot');
        });

        document.getElementById('view-stats').addEventListener('click', () => {
            this.loadFeature('stats');
        });

        // Header buttons
        document.getElementById('quick-timer').addEventListener('click', () => {
            this.loadFeature('timer');
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                authManager.logout();
                this.loadPage('landing');
            }
        });

        // Load default feature
        this.loadFeature('overview');
    }

    loadFeature(feature) {
        const container = document.getElementById('feature-container');
        
        switch(feature) {
            case 'overview':
                this.loadOverview(container);
                break;
            case 'timer':
                this.loadPomodoro(container);
                break;
            case 'stopwatch':
                this.loadStopwatch(container);
                break;
            case 'stats':
                this.loadStats(container);
                break;
            case 'chatbot':
                this.loadChatbot(container);
                break;
            case 'planner':
                this.loadPlanner(container);
                break;
            case 'achievements':
                this.loadAchievements(container);
                break;
            case 'flashcards':
                this.loadFlashcards(container);
                break;
            case 'notes':
                this.loadNotes(container);
                break;
            case 'community':
                this.loadCommunity(container);
                break;
            case 'profiles':
                this.loadProfiles(container);
                break;
            case 'support':
                this.loadSupport(container);
                break;
            case 'settings':
                this.loadSettings(container);
                break;
            default:
                this.loadOverview(container);
        }
    }

    loadOverview(container) {
        const user = authManager.getUser();
        const stats = studyDB.getUserStats(user.username);
        const sessions = studyDB.getUserSessions(user.username);
        
        // Calculate recent activity
        const today = new Date().toDateString();
        const todayTime = stats.daily[today] || 0;
        const weeklyTime = Object.values(stats.daily).reduce((a, b) => a + b, 0);
        
        container.innerHTML = `
            <div class="overview">
                <h2>Dashboard Overview</h2>
                
                <div class="overview-grid">
                    <div class="overview-card">
                        <h3><i class="fas fa-chart-line"></i> Study Statistics</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <span class="stat-number">${stats.streak}</span>
                                <span class="stat-label">Current Streak</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">${Math.floor(stats.total / 60)}h</span>
                                <span class="stat-label">Total Study Time</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">${this.formatTime(todayTime)}</span>
                                <span class="stat-label">Today</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">${Math.floor(weeklyTime / 60)}h</span>
                                <span class="stat-label">This Week</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-history"></i> Recent Sessions</h3>
                        <div class="sessions-list">
                            ${sessions.slice(0, 5).map(session => `
                                <div class="session-item">
                                    <span class="session-subject">${session.subject}</span>
                                    <span class="session-duration">${session.duration} min</span>
                                    <span class="session-time">${new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            `).join('')}
                            ${sessions.length === 0 ? '<p class="no-sessions">No study sessions yet. Start studying!</p>' : ''}
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-rocket"></i> Quick Start</h3>
                        <div class="quick-features">
                            <button class="feature-btn" data-feature="timer">
                                <i class="fas fa-clock"></i>
                                <span>Pomodoro Timer</span>
                            </button>
                            <button class="feature-btn" data-feature="stopwatch">
                                <i class="fas fa-stopwatch"></i>
                                <span>Study Stopwatch</span>
                            </button>
                            <button class="feature-btn" data-feature="chatbot">
                                <i class="fas fa-robot"></i>
                                <span>AI Assistant</span>
                            </button>
                            <button class="feature-btn" data-feature="planner">
                                <i class="fas fa-calendar"></i>
                                <span>Study Planner</span>
                            </button>
                            <button class="feature-btn" data-feature="notes">
                                <i class="fas fa-sticky-note"></i>
                                <span>Take Notes</span>
                            </button>
                            <button class="feature-btn" data-feature="flashcards">
                                <i class="fas fa-layer-group"></i>
                                <span>Flashcards</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="overview-card">
                        <h3><i class="fas fa-trophy"></i> Recent Achievements</h3>
                        <div class="achievements-preview">
                            ${this.getRecentAchievements(user.username).map(achievement => `
                                <div class="achievement-item">
                                    <span class="achievement-icon">${achievement.icon}</span>
                                    <div>
                                        <strong>${achievement.title}</strong>
                                        <p>${achievement.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                            ${this.getRecentAchievements(user.username).length === 0 ? 
                                '<p class="no-achievements">Complete study sessions to earn achievements!</p>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add overview styles
        this.addOverviewStyles();

        // Add event listeners for quick features
        container.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadFeature(btn.dataset.feature);
            });
        });
    }

    addOverviewStyles() {
        if (!document.querySelector('#overview-styles')) {
            const style = document.createElement('style');
            style.id = 'overview-styles';
            style.textContent = `
                .overview h2 {
                    font-size: 1.8rem;
                    margin-bottom: 25px;
                    color: #333;
                }
                
                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                }
                
                .overview-card {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    border: 1px solid #eee;
                }
                
                .overview-card h3 {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    color: #555;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                }
                
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #667eea;
                    display: block;
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    color: #888;
                    margin-top: 5px;
                }
                
                .sessions-list {
                    max-height: 250px;
                    overflow-y: auto;
                }
                
                .session-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #eee;
                }
                
                .session-item:last-child {
                    border-bottom: none;
                }
                
                .session-subject {
                    font-weight: 500;
                    color: #333;
                    flex: 2;
                }
                
                .session-duration {
                    color: #667eea;
                    font-weight: bold;
                    flex: 1;
                }
                
                .session-time {
                    color: #888;
                    font-size: 0.9rem;
                    flex: 1;
                    text-align: right;
                }
                
                .no-sessions, .no-achievements {
                    text-align: center;
                    color: #999;
                    font-style: italic;
                    padding: 20px;
                }
                
                .quick-features {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .feature-btn {
                    background: white;
                    border: 2px solid #eee;
                    border-radius: 10px;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .feature-btn:hover {
                    border-color: #667eea;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
                }
                
                .feature-btn i {
                    font-size: 1.5rem;
                    color: #667eea;
                }
                
                .feature-btn span {
                    font-weight: 500;
                    color: #555;
                }
                
                .achievements-preview {
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .achievement-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 0;
                    border-bottom: 1px solid #eee;
                }
                
                .achievement-item:last-child {
                    border-bottom: none;
                }
                
                .achievement-icon {
                    font-size: 2rem;
                    width: 50px;
                    text-align: center;
                }
                
                .achievement-item strong {
                    display: block;
                    color: #333;
                }
                
                .achievement-item p {
                    margin-top: 5px;
                    font-size: 0.9rem;
                    color: #666;
                }
            `;
            document.head.appendChild(style);
        }
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    getTodayStudyTime(username) {
        const stats = studyDB.getUserStats(username);
        const today = new Date().toDateString();
        return stats.daily[today] || 0;
    }

    getRecentAchievements(username) {
        // Simplified achievement check
        const stats = studyDB.getUserStats(username);
        const achievements = [];
        
        if (stats.total >= 60) {
            achievements.push({
                icon: '⏰',
                title: 'First Hour',
                description: 'Completed 1 hour of studying'
            });
        }
        
        if (stats.streak >= 7) {
            achievements.push({
                icon: '🔥',
                title: 'Week Warrior',
                description: '7-day study streak'
            });
        }
        
        return achievements.slice(0, 3);
    }
}

// Start the application
const app = new StudyZenApp();
