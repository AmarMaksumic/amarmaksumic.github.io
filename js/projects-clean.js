// Clean, simplified projects JavaScript
// No debugging, no complex logic - just the essentials

// Global variables - use var to allow redeclaration
var allProjects = {};
var filteredProjects = {};
var currentFilter = 'all';
var isGridView = true;

$(document).ready(function() {
  loadProjects();
  setupEventListeners();
});

function setupEventListeners() {
  // Remove existing listeners to prevent duplicates
  $(document).off('click', '.filter-btn');
  $(document).off('click', '.view-toggle');
  $(document).off('input', '#project-search');
  
  // Filter buttons
  $(document).on('click', '.filter-btn', function() {
    console.log('🏷️ Filter clicked:', $(this).data('filter'));
    const filter = $(this).data('filter');
    setActiveFilter(this, filter);
    filterProjects(filter);
  });
  
  // View toggle
  $(document).on('click', '.view-toggle', function() {
    const newView = $(this).data('view');
    console.log('📱 View toggle clicked:', newView, 'current isGridView:', isGridView);
    
    isGridView = (newView === 'grid');
    window.isGridView = isGridView; // Also update window reference
    
    console.log('📱 Updated isGridView to:', isGridView);
    updateViewToggle();
    displayProjects();
  });
  
  // Search
  $(document).on('input', '#project-search', function() {
    const searchTerm = $(this).val().toLowerCase();
    console.log('🔍 Search input:', searchTerm);
    searchProjects(searchTerm);
  });
  
  // Modal functionality
  $(document).off('click', '.project-card'); // Remove existing listeners
  $(document).on('click', '.project-card', function() {
    const projectTitle = $(this).data('project');
    console.log('🎭 Modal clicked for:', projectTitle);
    openProjectModal(projectTitle);
  });
  
  $(document).off('click', '.modal-backdrop, .modal-close'); // Remove existing listeners
  $(document).on('click', '.modal-backdrop, .modal-close', function() {
    console.log('❌ Modal close clicked');
    closeProjectModal();
  });
}

function loadProjects() {
  console.log('📥 loadProjects called');
  console.log('🔍 Current projects container:', $('#projects-container').length);
  
  fetch(`files/projects.json?v=${Date.now()}`)
    .then(response => {
      console.log('📡 Fetch response received:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('📊 Projects data loaded:', Object.keys(data).length, 'projects');
      allProjects = data;
      filteredProjects = { ...data };
      renderProjects();
    })
    .catch(error => {
      console.error('❌ Error loading projects:', error);
    });
}

function renderProjects() {
  console.log('🎨 renderProjects called');
  console.log('📊 All projects count:', Object.keys(allProjects).length);
  console.log('🎯 Target container exists:', $('#projects-container').length > 0);
  
  const categories = ['all', ...new Set(Object.values(allProjects).flatMap(p => p.tags || []))];
  console.log('🏷️ Categories found:', categories);
  
  const html = `
    <div class="projects-container">
      <div class="projects-header">
        <h1 class="projects-title">🛠️ Engineering Projects</h1>
        <p class="projects-subtitle">From autonomous vehicles to embedded systems</p>
      </div>
      
      <div class="controls-section">
        <div class="filter-controls">
          ${categories.map(cat => 
            `<button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
              ${cat === 'all' ? '🌟 All Projects' : `🏷️ ${cat}`}
            </button>`
          ).join('')}
        </div>
        
        <div class="search-container">
          <input type="text" id="project-search" class="search-input" placeholder="🔍 Search projects...">
        </div>
        
        <div class="view-controls">
          <button class="view-toggle ${isGridView ? 'active' : ''}" data-view="grid">📱 Grid</button>
          <button class="view-toggle ${!isGridView ? 'active' : ''}" data-view="list">📋 List</button>
        </div>
      </div>
      
      <div class="projects-content">
        <div id="projects-display" class="${isGridView ? 'projects-grid' : 'projects-list'}">
        </div>
      </div>
    </div>
  `;
  
  console.log('🔧 Setting HTML content');
  $('#projects-container').html(html);
  console.log('✅ HTML content set, calling displayProjects');
  displayProjects();
}

function displayProjects() {
  console.log('📱 displayProjects called');
  const container = $('#projects-display');
  console.log('🎯 Display container found:', container.length > 0);
  
  if (container.length === 0) {
    console.error('❌ No projects-display container found!');
    return;
  }
  
  // Update container class
  container.removeClass('projects-grid projects-list');
  container.addClass(isGridView ? 'projects-grid' : 'projects-list');
  console.log('🔄 View mode:', isGridView ? 'Grid' : 'List');
  
  let html = '';
  if (isGridView) {
    html = generateGridView();
  } else {
    html = generateListView();
  }
  
  console.log('📄 Generated HTML length:', html.length);
  container.html(html);
  console.log('✅ Projects displayed successfully');
}

function generateGridView() {
  let html = '';
  Object.entries(filteredProjects).forEach(([title, project], index) => {
    html += `
      <div class="project-card" data-project="${title}">
        ${project.img ? 
          `<img src="${project.img}" alt="${title}" class="project-image">` : 
          `<div class="project-placeholder">
             <div class="placeholder-icon">🚀</div>
             <div class="placeholder-text">Project</div>
           </div>`
        }
        <h3 class="project-title">${title}</h3>
        <p class="project-time">${project.time}</p>
        <p class="project-description">${project.description}</p>
        ${project.tags ? `
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  });
  return html;
}

function generateListView() {
  let html = '';
  Object.entries(filteredProjects).forEach(([title, project]) => {
    html += `
      <div class="project-card project-card-list" data-project="${title}">
        <div class="list-content">
          <div class="list-text-content">
            <h3 class="project-title">${title}</h3>
            <p class="project-time">${project.time}</p>
            <p class="project-description">${project.description}</p>
            ${project.tags ? `
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          ${project.image || project.img ? `
            <div class="list-image-content">
              <img src="${project.image || project.img}" alt="${title}" class="project-image-list">
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });
  return html;
}

function updateViewToggle() {
  console.log('🔄 updateViewToggle called, isGridView:', isGridView);
  $('.view-toggle').removeClass('active');
  const targetView = isGridView ? 'grid' : 'list';
  console.log('🎯 Setting active view to:', targetView);
  $(`.view-toggle[data-view="${targetView}"]`).addClass('active');
}

function setActiveFilter(button, filter) {
  $('.filter-btn').removeClass('active');
  $(button).addClass('active');
  currentFilter = filter;
}

function filterProjects(filter) {
  if (filter === 'all') {
    filteredProjects = { ...allProjects };
  } else {
    filteredProjects = {};
    Object.entries(allProjects).forEach(([title, project]) => {
      if (project.tags && project.tags.includes(filter)) {
        filteredProjects[title] = project;
      }
    });
  }
  displayProjects();
}

function searchProjects(searchTerm) {
  filteredProjects = {};
  Object.entries(allProjects).forEach(([title, project]) => {
    if (title.toLowerCase().includes(searchTerm) || 
        project.description.toLowerCase().includes(searchTerm) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))) {
      filteredProjects[title] = project;
    }
  });
  displayProjects();
}

// Initialize function for compatibility
function initializeProjects() {
  console.log('🚀 initializeProjects called');
  
  // Reset global state
  window.allProjects = allProjects = {};
  window.filteredProjects = filteredProjects = {};
  window.currentFilter = currentFilter = 'all';
  window.isGridView = isGridView = true;
  
  // Ensure jQuery is ready and DOM is available
  if (typeof $ !== 'undefined' && document.readyState !== 'loading') {
    console.log('✅ jQuery ready, loading projects immediately');
    loadProjects();
    setupEventListeners();
  } else {
    console.log('⏳ Waiting for DOM/jQuery to be ready');
    $(document).ready(function() {
      console.log('✅ DOM ready, loading projects');
      loadProjects();
      setupEventListeners();
    });
  }
}

window.initializeProjects = initializeProjects;

// Modal Functions
function openProjectModal(title) {
  console.log('🎭 Opening modal for:', title);
  const project = allProjects[title];
  if (!project) {
    console.error('❌ Project not found:', title);
    return;
  }
  
  console.log('📊 Project modal data:', project.modal);
  console.log('🎯 Skills data:', project.modal?.skills_gained);
  console.log('🚀 Challenges data:', project.modal?.challenges);
  
  // Get modal data if available
  const modal = project.modal || {};
  const detailedDesc = modal.detailed_description || project.description || '';
  const techDetails = modal.technical_details || [];
  const impact = modal.impact || [];
  const challenges = modal.challenges || [];
  const skills = modal.skills_gained || [];
  const techStack = (techDetails.tech_stack || project.tags || []);
  const technicalSections = Array.isArray(techDetails) ? techDetails : [];
  
  const modalHtml = `
    <div class="modal-backdrop">
      <div class="modal-content">
        <button class="modal-close">×</button>
        
        <div class="modal-inner">
          <div class="modal-header">
            ${project.image ? `<img src="${project.image}" alt="${title}" class="modal-image">` : ''}
            <h2 class="modal-title">${title}</h2>
            ${modal.context ? `
              ${typeof modal.context === 'string' ? 
                `<p class="modal-context">🏢 ${modal.context}</p>` :
                `<div>
                  <p class="modal-context">🏢 ${modal.context.title || 'Project Context'}</p>
                  ${modal.context.content ? `<p class="modal-context-content">${modal.context.content}</p>` : ''}
                </div>`
              }
            ` : ''}
          </div>
          
          ${detailedDesc ? `
          <div class="modal-section">
            <h3><span>📋</span> Project Overview</h3>
            <div class="modal-overview">
              <p>${detailedDesc}</p>
            </div>
          </div>
          ` : ''}
          
          ${technicalSections.length > 0 ? `
          <div class="modal-section">
            <h3><span>🛠️</span> Technical Details</h3>
            <div class="modal-tech-details">
              ${technicalSections.map(item => `
                <div class="modal-tech-item">
                  <h4>
                    <span>${item.icon || '🛠️'}</span>
                    ${item.title}
                  </h4>
                  <p>${item.content}</p>
                </div>
              `).join('')}
            </div>
          </div>
          ` : techStack.length > 0 ? `
          <div class="modal-section">
            <h3><span>🛠️</span> Technology Stack</h3>
            <div class="modal-tech-stack">
              ${techStack.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
            </div>
          </div>
          ` : ''}
          
          ${impact.length > 0 ? `
          <div class="modal-section">
            <h3><span>💫</span> Impact & Results</h3>
            <div class="modal-impact">
              ${impact.map(item => `
                <div class="modal-impact-item">
                  <h4>
                    <span>${item.icon || '💫'}</span>
                    ${item.title}
                  </h4>
                  <p>${item.content}</p>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${challenges.length > 0 ? `
          <div class="modal-section">
            <h3><span>🚀</span> Challenges & Solutions</h3>
            <div class="modal-challenges">
              ${challenges.map(item => `
                <div class="modal-challenge-item">
                  <h4>
                    <span>${item.icon || '🚀'}</span>
                    ${item.title}
                  </h4>
                  <p>${item.content || item.description || 'No details available'}</p>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${skills.length > 0 ? `
          <div class="modal-skills">
            <h3><span>🎯</span> Skills Developed</h3>
            <div class="modal-skills-container">
              ${skills.map(skill => `
                <span class="modal-skill-tag">${typeof skill === 'string' ? skill : skill.title || skill.name || 'Unknown skill'}</span>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${(project.resources && (project.resources.github || project.resources.demo || project.resources.website)) ? `
          <div class="modal-footer">
            ${project.resources.github ? `<a href="${project.resources.github}" target="_blank" class="modal-link">🔗 View Code</a>` : ''}
            ${project.resources.demo ? `<a href="${project.resources.demo}" target="_blank" class="modal-link demo">🚀 Live Demo</a>` : ''}
            ${project.resources.website ? `<a href="${project.resources.website}" target="_blank" class="modal-link demo">🌐 Visit Website</a>` : ''}
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  $('body').append(modalHtml);
  
  // Add event handlers using event delegation
  $(document).on('click', '.modal-backdrop', function(e) {
    if (e.target === this) {
      closeProjectModal();
    }
  });
  
  $(document).on('click', '.modal-close', function(e) {
    e.preventDefault();
    closeProjectModal();
  });
}

function closeProjectModal() {
  console.log('❌ Closing modal');
  $('.modal-backdrop').remove();
}