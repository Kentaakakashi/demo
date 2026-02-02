// Simple database using localStorage
class StudyDB {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // Initialize if empty
        if (!localStorage.getItem('studyzen_users')) {
            localStorage.setItem('studyzen_users', JSON.stringify({}));
        }
        if (!localStorage.getItem('studyzen_studysessions')) {
            localStorage.setItem('studyzen_studysessions', JSON.stringify({}));
        }
        if (!localStorage.getItem('studyzen_stats')) {
            localStorage.setItem('studyzen_stats', JSON.stringify({}));
        }
        if (!localStorage.getItem('studyzen_achievements')) {
            localStorage.setItem('studyzen_achievements', JSON.stringify({}));
        }
        if (!localStorage.getItem('studyzen_forum')) {
            localStorage.setItem('studyzen_forum', JSON.stringify({ posts: [] }));
        }
        if (!localStorage.getItem('studyzen_settings')) {
            localStorage.setItem('studyzen_settings', JSON.stringify({}));
        }
    }

    // User Management
    createUser(username, displayName, password) {
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        
        if (users[username]) {
            return { success: false, message: 'Username already exists' };
        }

        users[username] = {
            username: username,
            displayName: displayName || username,
            password: btoa(password), // Simple encoding (not secure for real apps)
            joined: new Date().toISOString(),
            streak: 0,
            totalStudyTime: 0,
            lastActive: new Date().toISOString(),
            theme: 'default',
            isOnline: true
        };

        localStorage.setItem('studyzen_users', JSON.stringify(users));
        return { success: true, user: users[username] };
    }

    authenticateUser(username, password) {
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        const user = users[username];
        
        if (user && user.password === btoa(password)) {
            user.isOnline = true;
            user.lastActive = new Date().toISOString();
            localStorage.setItem('studyzen_users', JSON.stringify(users));
            return { success: true, user: user };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }

    getUser(username) {
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        return users[username];
    }

    updateUser(username, updates) {
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        if (users[username]) {
            users[username] = { ...users[username], ...updates };
            localStorage.setItem('studyzen_users', JSON.stringify(users));
            return true;
        }
        return false;
    }

    // Study Sessions
    addStudySession(username, duration, subject = 'General') {
        const sessions = JSON.parse(localStorage.getItem('studyzen_studysessions'));
        const sessionId = Date.now().toString();
        
        if (!sessions[username]) {
            sessions[username] = [];
        }

        const session = {
            id: sessionId,
            username: username,
            duration: duration, // in minutes
            subject: subject,
            date: new Date().toISOString(),
            endTime: new Date().toISOString()
        };

        sessions[username].push(session);
        localStorage.setItem('studyzen_studysessions', JSON.stringify(sessions));

        // Update user stats
        this.updateUserStats(username, duration);
        
        return session;
    }

    getUserSessions(username) {
        const sessions = JSON.parse(localStorage.getItem('studyzen_studysessions'));
        return sessions[username] || [];
    }

    // Stats Management
    updateUserStats(username, minutes) {
        const stats = JSON.parse(localStorage.getItem('studyzen_stats'));
        const today = new Date().toDateString();
        
        if (!stats[username]) {
            stats[username] = {
                daily: {},
                weekly: {},
                monthly: {},
                total: 0,
                streak: 0,
                lastStudyDate: null
            };
        }

        // Update daily
        if (!stats[username].daily[today]) {
            stats[username].daily[today] = 0;
        }
        stats[username].daily[today] += minutes;

        // Update total
        stats[username].total += minutes;

        // Update streak
        const lastDate = stats[username].lastStudyDate;
        const currentDate = new Date();
        
        if (!lastDate) {
            stats[username].streak = 1;
        } else {
            const last = new Date(lastDate);
            const diffDays = Math.floor((currentDate - last) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                stats[username].streak += 1;
            } else if (diffDays > 1) {
                stats[username].streak = 1;
            }
        }
        
        stats[username].lastStudyDate = currentDate.toISOString();
        
        // Update user streak
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        if (users[username]) {
            users[username].streak = stats[username].streak;
            users[username].totalStudyTime = stats[username].total;
            localStorage.setItem('studyzen_users', JSON.stringify(users));
        }

        localStorage.setItem('studyzen_stats', JSON.stringify(stats));
        
        // Check for achievements
        this.checkAchievements(username, stats[username]);
        
        return stats[username];
    }

    getUserStats(username) {
        const stats = JSON.parse(localStorage.getItem('studyzen_stats'));
        return stats[username] || {
            daily: {},
            weekly: {},
            monthly: {},
            total: 0,
            streak: 0,
            lastStudyDate: null
        };
    }

    // Achievements
    checkAchievements(username, stats) {
        const achievements = JSON.parse(localStorage.getItem('studyzen_achievements'));
        
        if (!achievements[username]) {
            achievements[username] = [];
        }

        const userAchievements = achievements[username];
        const newAchievements = [];

        // First Session Achievement
        if (stats.total >= 60 && !userAchievements.includes('first_hour')) {
            newAchievements.push({
                id: 'first_hour',
                title: 'First Hour',
                description: 'Completed 1 hour of studying',
                icon: '⏰',
                date: new Date().toISOString()
            });
            userAchievements.push('first_hour');
        }

        // 7-Day Streak
        if (stats.streak >= 7 && !userAchievements.includes('week_streak')) {
            newAchievements.push({
                id: 'week_streak',
                title: 'Week Warrior',
                description: '7-day study streak',
                icon: '🔥',
                date: new Date().toISOString()
            });
            userAchievements.push('week_streak');
        }

        // Night Owl (study between 10 PM and 4 AM)
        const now = new Date();
        const hours = now.getHours();
        if ((hours >= 22 || hours < 4) && !userAchievements.includes('night_owl')) {
            newAchievements.push({
                id: 'night_owl',
                title: 'Night Owl',
                description: 'Studied late at night',
                icon: '🦉',
                date: new Date().toISOString()
            });
            userAchievements.push('night_owl');
        }

        // Add new achievements
        achievements[username] = userAchievements;
        localStorage.setItem('studyzen_achievements', JSON.stringify(achievements));

        return newAchievements;
    }

    getUserAchievements(username) {
        const achievements = JSON.parse(localStorage.getItem('studyzen_achievements'));
        return achievements[username] || [];
    }

    // Forum
    createForumPost(username, title, content, category = 'General') {
        const forum = JSON.parse(localStorage.getItem('studyzen_forum'));
        const post = {
            id: Date.now().toString(),
            username: username,
            displayName: this.getUser(username)?.displayName || username,
            title: title,
            content: content,
            category: category,
            date: new Date().toISOString(),
            replies: [],
            upvotes: 0,
            downvotes: 0
        };

        forum.posts.unshift(post); // Add to beginning
        localStorage.setItem('studyzen_forum', JSON.stringify(forum));
        return post;
    }

    getForumPosts() {
        const forum = JSON.parse(localStorage.getItem('studyzen_forum'));
        return forum.posts || [];
    }

    addReply(postId, username, content) {
        const forum = JSON.parse(localStorage.getItem('studyzen_forum'));
        const post = forum.posts.find(p => p.id === postId);
        
        if (post) {
            const reply = {
                id: Date.now().toString(),
                username: username,
                displayName: this.getUser(username)?.displayName || username,
                content: content,
                date: new Date().toISOString()
            };
            
            post.replies.push(reply);
            localStorage.setItem('studyzen_forum', JSON.stringify(forum));
            return reply;
        }
        
        return null;
    }

    // Settings
    saveSetting(username, key, value) {
        const settings = JSON.parse(localStorage.getItem('studyzen_settings'));
        
        if (!settings[username]) {
            settings[username] = {};
        }
        
        settings[username][key] = value;
        localStorage.setItem('studyzen_settings', JSON.stringify(settings));
        return true;
    }

    getSetting(username, key, defaultValue = null) {
        const settings = JSON.parse(localStorage.getItem('studyzen_settings'));
        return settings[username]?.[key] || defaultValue;
    }

    // Search users
    searchUsers(query) {
        const users = JSON.parse(localStorage.getItem('studyzen_users'));
        const results = [];
        
        for (const username in users) {
            if (username.toLowerCase().includes(query.toLowerCase()) || 
                users[username].displayName.toLowerCase().includes(query.toLowerCase())) {
                results.push(users[username]);
            }
        }
        
        return results;
    }
}

// Create global database instance
const studyDB = new StudyDB();
