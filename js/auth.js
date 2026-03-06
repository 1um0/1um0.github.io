/* ==================== AUTHENTICATION SYSTEM ==================== */

class AuthManager {
  constructor() {
    this.currentUser = this.loadCurrentUser();
    this.initializeAuth();
  }

  /* Initialize authentication UI */
  initializeAuth() {
    if (this.currentUser) {
      this.updateUILoggedIn();
    } else {
      this.updateUILoggedOut();
    }
  }

  /* Load user from localStorage */
  loadCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
      }
    }
    return null;
  }

  /* Save user to localStorage */
  saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  /* Register new user */
  register(email, username, password) {
    // Validate input
    if (!email || !username || !password) {
      return { success: false, message: '所有字段都是必需的' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: '邮箱格式无效' };
    }

    if (password.length < 6) {
      return { success: false, message: '密码至少6个字符' };
    }

    // Check if user exists
    const users = this.getAllUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: '该邮箱已被注册' };
    }

    // Create new user
    const newUser = {
      id: this.generateId(),
      email,
      username,
      password: this.hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString(),
      avatar: this.generateAvatar(username)
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    const loginInfo = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      avatar: newUser.avatar
    };
    this.saveCurrentUser(loginInfo);
    return { success: true, message: '注册成功', user: loginInfo };
  }

  /* Login user */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: '邮箱和密码不能为空' };
    }

    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, message: '密码错误' };
    }

    const loginInfo = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar
    };

    this.saveCurrentUser(loginInfo);
    return { success: true, message: '登录成功', user: loginInfo };
  }

  /* Logout */
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.updateUILoggedOut();
    window.location.href = '/';
  }

  /* Get all users (simulated - in production use backend) */
  getAllUsers() {
    const usersStr = localStorage.getItem('users');
    if (!usersStr) {
      // Initialize with default users
      const defaultUsers = [
        {
          id: 'admin-001',
          email: 'admin@wgcr.club',
          username: 'Admin',
          password: this.hashPassword('admin123'),
          role: 'admin',
          createdAt: new Date().toISOString(),
          avatar: '👨‍💼'
        },
        {
          id: 'user-001',
          email: 'chenmeng@wgcr.club',
          username: 'ChenMeng',
          password: this.hashPassword('123456'),
          role: 'member',
          createdAt: new Date().toISOString(),
          avatar: '👤'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    try {
      return JSON.parse(usersStr);
    } catch (e) {
      console.error('Failed to parse users:', e);
      return [];
    }
  }

  /* Simple hash function (for demo - use proper hashing in production) */
  hashPassword(password) {
    // This is a simple hash for demo purposes
    // In production, use bcryptjs or similar on the backend
    return btoa(password);
  }

  /* Verify password */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  /* Check if email is valid */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /* Generate unique ID */
  generateId() {
    return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /* Generate avatar */
  generateAvatar(username) {
    const avatars = ['👤', '🧑', '👨', '👩', '🧔', '👴', '👵', '🧒', '👦', '👧'];
    return avatars[username.length % avatars.length];
  }

  /* Update UI for logged in user */
  updateUILoggedIn() {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;

    navButtons.innerHTML = `
      <div class="user-info">
        <span>${this.currentUser.avatar} ${this.currentUser.username}</span>
        ${this.currentUser.role === 'admin' ? '<a href="/admin/admin-panel.html" style="color: var(--neon-pink); text-decoration: none;">⚙️ 管理员面板</a>' : ''}
        <button class="btn-logout" onclick="authManager.logout()">登出</button>
      </div>
    `;
  }

  /* Update UI for logged out user */
  updateUILoggedOut() {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;

    navButtons.innerHTML = `
      <button class="btn-auth" onclick="showLoginModal()">登录</button>
      <button class="btn-auth" onclick="showRegisterModal()" style="border-color: var(--neon-purple); color: var(--neon-purple);">注册</button>
    `;
  }

  /* Check if user has admin role */
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  /* Check if user is logged in */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /* Update user role (admin only) */
  updateUserRole(userId, newRole) {
    if (!this.isAdmin()) {
      return { success: false, message: '只有管理员可以更改用户角色' };
    }

    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    user.role = newRole;
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: '用户角色已更新' };
  }

  /* Get user info */
  getUserInfo(userId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password, ...userInfo } = user;
      return userInfo;
    }
    return null;
  }
}

/* Initialize auth manager */
const authManager = new AuthManager();

/* UI Functions */
function showLoginModal() {
  document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
  document.getElementById('registerModal').classList.add('active');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const result = authManager.login(email, password);
  if (result.success) {
    alert(result.message);
    hideModal('loginModal');
    authManager.updateUILoggedIn();
    window.location.reload();
  } else {
    alert(result.message);
  }
}

function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value.trim();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value.trim();

  if (password !== passwordConfirm) {
    alert('两次输入的密码不一致');
    return;
  }

  const result = authManager.register(email, username, password);
  if (result.success) {
    alert(result.message);
    hideModal('registerModal');
    authManager.updateUILoggedIn();
    window.location.reload();
  } else {
    alert(result.message);
  }
}

/* Close modal when clicking outside */
document.addEventListener('DOMContentLoaded', function() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === this) {
        this.classList.remove('active');
      }
    });
  });
});
