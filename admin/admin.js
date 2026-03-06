/* ==================== ADMIN PANEL JAVASCRIPT ==================== */

class AdminManager {
  constructor() {
    this.init();
  }

  init() {
    // Check if user is logged in and is admin
    if (!authManager.isLoggedIn()) {
      window.location.href = '/';
      return;
    }

    if (!authManager.isAdmin()) {
      alert('您没有管理员权限');
      window.location.href = '/';
      return;
    }

    this.setupEventListeners();
    this.loadDashboard();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Form submissions
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => this.handleUploadContent(e));
    }

    const addAdminForm = document.getElementById('addAdminForm');
    if (addAdminForm) {
      addAdminForm.addEventListener('submit', (e) => this.handleAddAdmin(e));
    }
  }

  switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
      tabElement.classList.add('active');
    }
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load tab content
    if (tabName === 'users') {
      this.loadUsersList();
    } else if (tabName === 'content') {
      this.loadContentList();
    }
  }

  loadDashboard() {
    // Load stats
    const users = authManager.getAllUsers();
    const contents = this.getAllContents();

    const statsDiv = document.getElementById('adminStats');
    if (statsDiv) {
      statsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="background: rgba(0, 212, 255, 0.1); border-left: 3px solid var(--neon-blue); padding: 1rem; border-radius: 2px;">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">总用户数</p>
            <p style="color: var(--neon-blue); font-size: 2rem; font-weight: bold;">${users.length}</p>
          </div>
          <div style="background: rgba(217, 70, 255, 0.1); border-left: 3px solid var(--neon-purple); padding: 1rem; border-radius: 2px;">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">内容数量</p>
            <p style="color: var(--neon-purple); font-size: 2rem; font-weight: bold;">${contents.length}</p>
          </div>
          <div style="background: rgba(0, 255, 65, 0.1); border-left: 3px solid var(--accent-green); padding: 1rem; border-radius: 2px;">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">管理员数</p>
            <p style="color: var(--accent-green); font-size: 2rem; font-weight: bold;">${users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      `;
    }
  }

  loadUsersList() {
    const usersList = document.getElementById('usersListContent');
    if (!usersList) return;

    const users = authManager.getAllUsers();
    usersList.innerHTML = '';

    users.forEach(user => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.innerHTML = `
        <div class="admin-list-item-info">
          <div class="admin-list-item-email">${user.email}</div>
          <div class="admin-list-item-role">
            角色: <span style="color: ${user.role === 'admin' ? 'var(--neon-pink)' : 'var(--neon-cyan)'}">${user.role === 'admin' ? '管理员' : '普通用户'}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
            用户名: ${user.username} | 创建时间: ${formatDate(user.createdAt)}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          ${authManager.currentUser.id !== user.id ? `
            <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="adminManager.toggleUserRole('${user.id}')">
              ${user.role === 'admin' ? '降级' : '升级'}
            </button>
          ` : ''}
          <button class="btn-danger" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="adminManager.deleteUser('${user.id}')">删除</button>
        </div>
      `;
      usersList.appendChild(item);
    });
  }

  loadContentList() {
    const contentList = document.getElementById('contentsListContent');
    if (!contentList) return;

    const contents = this.getAllContents();
    contentList.innerHTML = '';

    if (contents.length === 0) {
      contentList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">暂无内容</p>';
      return;
    }

    contents.forEach(content => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'flex-start';
      item.innerHTML = `
        <div style="width: 100%; margin-bottom: 1rem;">
          <div class="admin-list-item-email">${content.title}</div>
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
            作者: ${content.author} | 类型: ${content.type} | 时间: ${formatDate(content.date)}
          </div>
          <div style="color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.4;">
            ${content.description.substring(0, 100)}...
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-danger" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="adminManager.deleteContent('${content.id}')">删除</button>
        </div>
      `;
      contentList.appendChild(item);
    });
  }

  handleUploadContent(event) {
    event.preventDefault();

    const title = document.getElementById('contentTitle').value.trim();
    const description = document.getElementById('contentDescription').value.trim();
    const type = document.getElementById('contentType').value;

    if (!title || !description) {
      alert('标题和描述不能为空');
      return;
    }

    const newContent = {
      id: 'content-' + Date.now(),
      title,
      description,
      author: authManager.currentUser.username,
      type,
      date: new Date().toISOString(),
      image: null,
      comments: []
    };

    const contents = this.getAllContents();
    contents.unshift(newContent);
    this.saveContents(contents);

    event.target.reset();
    alert('内容已发布');
    this.loadContentList();
  }

  handleAddAdmin(event) {
    event.preventDefault();

    const email = document.getElementById('newAdminEmail').value.trim();

    if (!email) {
      alert('邮箱不能为空');
      return;
    }

    const users = authManager.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      alert('用户不存在');
      return;
    }

    if (user.role === 'admin') {
      alert('该用户已是管理员');
      return;
    }

    user.role = 'admin';
    localStorage.setItem('users', JSON.stringify(users));

    event.target.reset();
    alert(`${email} 已成为管理员`);
    this.loadUsersList();
  }

  toggleUserRole(userId) {
    const users = authManager.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.role = user.role === 'admin' ? 'user' : 'admin';
    localStorage.setItem('users', JSON.stringify(users));
    this.loadUsersList();
  }

  deleteUser(userId) {
    if (!confirm('确定要删除此用户吗？')) return;

    let users = authManager.getAllUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    this.loadUsersList();
  }

  deleteContent(contentId) {
    if (!confirm('确定要删除此内容吗？')) return;

    let contents = this.getAllContents();
    contents = contents.filter(c => c.id !== contentId);
    this.saveContents(contents);
    this.loadContentList();
  }

  getAllContents() {
    const contentsStr = localStorage.getItem('contents');
    if (!contentsStr) return [];
    try {
      return JSON.parse(contentsStr);
    } catch (e) {
      console.error('Failed to parse contents:', e);
      return [];
    }
  }

  saveContents(contents) {
    localStorage.setItem('contents', JSON.stringify(contents));
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Initialize admin manager
const adminManager = new AdminManager();
