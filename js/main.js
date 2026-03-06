/* ==================== MAIN APPLICATION LOGIC ==================== */

// Member data
const membersData = {
  'chenmeng': {
    name: '陈孟',
    english: 'Chen Meng',
    role: '项目策划',
    emoji: '🎯',
    color: '#00d4ff',
    description: '擅长战略规划和项目管理，是项目的大脑',
    details: '陈孟是WGCR Club的核心成员，以其前瞻性的视野和严谨的规划能力著称。她能够洞察趋势，制定长期战略，确保项目的顺利进行。',
    interests: ['策略规划', '数据分析', '团队管理'],
    page: 'pages/member-chenmeng.html'
  },
  'fancheng': {
    name: '范诚昊',
    english: 'Fan Chenghao',
    role: '技术开发',
    emoji: '💻',
    color: '#d946ff',
    description: '技术大牛，掌握多种编程语言和框架',
    details: '范诚昊是技术团队的核心，具有深厚的编程功底。他能够快速学习新技术，解决复杂的技术问题，是项目的技术支柱。',
    interests: ['代码开发', '系统架构', '开源贡献'],
    page: 'pages/member-fancheng.html'
  },
  'hanhuizhu': {
    name: '韩蕙竹',
    english: 'Han Huizhu',
    role: '设计创意',
    emoji: '🎨',
    color: '#00ff41',
    description: '设计师，创意无限，视觉表达能力超群',
    details: '韩蕙竹是团队的创意神经中枢，她的设计作品总是能够吸引眼球，赋予项目独特的视觉语言。她对美的追求和创新精神令人钦佩。',
    interests: ['UI设计', '品牌推广', '视觉创意'],
    page: 'pages/member-hanhuizhu.html'
  },
  'tangshuyun': {
    name: '唐淑毓',
    english: 'Tang Shuyun',
    role: '文案策划',
    emoji: '✍️',
    color: '#ff006e',
    description: '文案高手，用文字点亮思想',
    details: '唐淑毓以敏锐的思维和优美的文笔著称，她能够用文字传达品牌理念，与用户建立情感连接。她的每一句话都经过精心打磨。',
    interests: ['内容创意', '品牌文案', '社交媒体'],
    page: 'pages/member-tangshuyun.html'
  },
  'liyimeng': {
    name: '李祎萌',
    english: 'Li Yimeng',
    role: '运营推广',
    emoji: '📊',
    color: '#00ffff',
    description: '运营达人，增长黑客，数据驱动决策',
    details: '李祎萌是增长的推动力，她深谙用户心理，能够通过数据驱动的方法实现快速增长。她的每一个运营决策都基于深入的分析。',
    interests: ['用户增长', '数据分析', '市场运营'],
    page: 'pages/member-liyimeng.html'
  }
};

/* Initialize page when DOM is ready */
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  loadContent();
  setupEventListeners();
});

/* Initialize page components */
function initializePage() {
  // Check auth status
  if (!authManager) {
    console.error('AuthManager not found');
    return;
  }

  // Display admin panel if user is admin
  if (authManager.isAdmin() && document.querySelector('.admin-panel')) {
    document.querySelector('.admin-panel').style.display = 'block';
    initializeAdminPanel();
  }
}

/* Load content from storage */
function loadContent() {
  const contentGrid = document.querySelector('.content-grid');
  if (!contentGrid) return;

  const contents = getStoredContents();
  contentGrid.innerHTML = '';

  if (contents.length === 0) {
    contentGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">还没有内容分享，敬请期待...</div>';
    return;
  }

  contents.forEach(content => {
    const contentItem = createContentElement(content);
    contentGrid.appendChild(contentItem);
  });
}

/* Create content element */
function createContentElement(content) {
  const div = document.createElement('div');
  div.className = 'content-item';
  div.innerHTML = `
    <div class="content-item-title">${escapeHtml(content.title)}</div>
    <div class="content-item-meta">
      <span>${content.author}</span>
      <span>${formatDate(content.date)}</span>
      <span>${content.type}</span>
    </div>
    ${content.image ? `<div class="content-item-image"><img src="${content.image}" style="width: 100%; height: 100%; object-fit: cover;"></div>` : `<div class="content-item-image">📷 图片</div>`}
    <div class="content-item-text">${escapeHtml(content.description)}</div>
    <div class="comments-section">
      <div style="font-size: 0.9rem; color: var(--neon-cyan); margin-bottom: 1rem;">💬 评论 (${content.comments ? content.comments.length : 0})</div>
      <button class="btn-primary" style="font-size: 0.8rem;" onclick="toggleCommentForm('${content.id}')">发表评论</button>
    </div>
  `;
  return div;
}

/* Get stored contents */
function getStoredContents() {
  const contentsStr = localStorage.getItem('contents');
  if (!contentsStr) return [];
  try {
    return JSON.parse(contentsStr);
  } catch (e) {
    console.error('Failed to parse contents:', e);
    return [];
  }
}

/* Save contents */
function saveContents(contents) {
  localStorage.setItem('contents', JSON.stringify(contents));
}

/* Add sample content (for demo) */
function addSampleContent() {
  const sampleContents = [
    {
      id: 'content-001',
      title: '欢迎来到WGCR Club',
      description: '这是我们五个人的记录网站，记录我们一起走过的足迹，分享我们的故事。',
      author: '陈孟',
      type: '公告',
      date: new Date().toISOString(),
      image: null,
      comments: []
    },
    {
      id: 'content-002',
      title: '第一次团队合作的成果',
      description: '在大家的共同努力下，我们完成了这个项目。这是我们友谊和团队精神的证明。',
      author: '范诚昊',
      type: '项目',
      date: new Date(Date.now() - 86400000).toISOString(),
      image: null,
      comments: []
    }
  ];

  const existingContents = getStoredContents();
  if (existingContents.length === 0) {
    saveContents(sampleContents);
    loadContent();
  }
}

/* Initialize admin panel */
function initializeAdminPanel() {
  const adminUploadBtn = document.getElementById('adminUploadBtn');
  if (adminUploadBtn) {
    adminUploadBtn.addEventListener('click', function() {
      document.getElementById('contentForm').style.display = 'block';
    });
  }

  // Load admin users list
  loadAdminUsersList();
}

/* Load admin users list */
function loadAdminUsersList() {
  const adminUsersList = document.getElementById('adminUsersList');
  if (!adminUsersList) return;

  const users = authManager.getAllUsers();
  adminUsersList.innerHTML = '';

  users.forEach(user => {
    const item = document.createElement('div');
    item.className = 'admin-list-item';
    item.innerHTML = `
      <div class="admin-list-item-info">
        <div class="admin-list-item-email">${user.email}</div>
        <div class="admin-list-item-role">角色: ${user.role === 'admin' ? '管理员' : '普通用户'}</div>
      </div>
      <div>
        ${authManager.currentUser.role === 'admin' && user.id !== authManager.currentUser.id ? `
          <button class="btn-primary" style="margin-right: 0.5rem;" onclick="changeUserRole('${user.id}')" style="font-size: 0.8rem;">
            ${user.role === 'admin' ? '降级' : '升级'}
          </button>
        ` : ''}
      </div>
    `;
    adminUsersList.appendChild(item);
  });
}

/* Change user role */
function changeUserRole(userId) {
  const users = authManager.getAllUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const newRole = user.role === 'admin' ? 'user' : 'admin';
  authManager.updateUserRole(userId, newRole);
  loadAdminUsersList();
  alert(`用户 ${user.email} 的角色已更新为 ${newRole === 'admin' ? '管理员' : '普通用户'}`);
}

/* Setup event listeners */
function setupEventListeners() {
  // Admin upload form
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleUploadContent);
  }

  // Member card clicks
  document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', function() {
      const member = this.dataset.member;
      if (member && membersData[member]) {
        navigateToMember(member);
      }
    });
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterContent(this.dataset.filter);
    });
  });

  // Admin tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      switchAdminTab(this.dataset.tab);
    });
  });
}

/* Navigate to member page */
function navigateToMember(memberId) {
  if (membersData[memberId]) {
    window.location.href = membersData[memberId].page;
  }
}

/* Handle upload content */
function handleUploadContent(event) {
  event.preventDefault();

  if (!authManager.isAdmin()) {
    alert('只有管理员可以上传内容');
    return;
  }

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

  const contents = getStoredContents();
  contents.unshift(newContent);
  saveContents(contents);

  // Reset form
  event.target.reset();
  loadContent();
  alert('内容已发布');
}

/* Filter content */
function filterContent(filter) {
  const contents = getStoredContents();
  const contentGrid = document.querySelector('.content-grid');
  contentGrid.innerHTML = '';

  let filtered = contents;
  if (filter !== 'all') {
    filtered = contents.filter(c => c.type === filter);
  }

  if (filtered.length === 0) {
    contentGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">该分类暂无内容</div>';
    return;
  }

  filtered.forEach(content => {
    contentGrid.appendChild(createContentElement(content));
  });
}

/* Switch admin tab */
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}Tab`).classList.add('active');
}

/* Toggle comment form */
function toggleCommentForm(contentId) {
  alert('评论功能敬请期待');
}

/* Utility functions */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Initialize sample content
window.addEventListener('load', addSampleContent);
