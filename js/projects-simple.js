// Enhanced Projects JavaScript with animations, filtering, and modals
// Updated: 2025-10-03 - Modal Enhancement Debug Version

let allProjects = {};
let filteredProjects = {};
let currentFilter = 'all';
let isGridView = true;

$(document).ready(function() {
  console.log('📁 Enhanced Projects.js loaded - VERSION 2025-10-03 - Modal Debug');
  console.log('🔥 Starting initialization with modal debugging enabled');
  loadProjects();
  setupEventListeners();
});

function setupEventListeners() {
  // Filter buttons
  $(document).on('click', '.filter-btn', function() {
    const filter = $(this).data('filter');
    setActiveFilter(this, filter);
    filterProjects(filter);
  });
  
  // View toggle
  $(document).on('click', '.view-toggle', function() {
    isGridView = !isGridView;
    updateViewToggle();
    displayFilteredProjects();
  });
  
  // Search functionality
  $(document).on('input', '#project-search', function() {
    const searchTerm = $(this).val().toLowerCase();
    searchProjects(searchTerm);
  });
  
  // Modal functionality
  $(document).on('click', '.project-card', function() {
    const projectTitle = $(this).data('project');
    openProjectModal(projectTitle);
  });
  
  $(document).on('click', '.modal-backdrop, .modal-close', function() {
    closeProjectModal();
  });
}

function loadProjects() {
  const cacheBuster = new Date().getTime();
  fetch(`./files/projects.json?v=${cacheBuster}`)
    .then(response => {
      console.log('📥 Projects JSON fetch response:', response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(projects => {
      console.log('✅ Projects data loaded:', Object.keys(projects).length, 'projects');
      
      // Debug: Check first project structure
      const firstProjectTitle = Object.keys(projects)[0];
      const firstProject = projects[firstProjectTitle];
      console.log('🔍 LOAD DEBUG: First project title:', firstProjectTitle);
      console.log('🔍 LOAD DEBUG: First project keys:', Object.keys(firstProject));
      console.log('🔍 LOAD DEBUG: Modal exists in loaded data:', !!firstProject.modal);
      
      if (firstProject.modal) {
        console.log('🔍 LOAD DEBUG: Modal keys:', Object.keys(firstProject.modal));
        console.log('🔍 LOAD DEBUG: Technical details exist:', !!firstProject.modal.technical_details);
      }
      
      allProjects = projects;
      filteredProjects = projects;
      displayProjects(projects);
    })
    .catch(error => {
      console.error('❌ Error loading projects:', error);
      $('#projects-container').html('<div style="padding: 20px; text-align: center; color: #666;">Error loading projects. Please try again.</div>');
    });
}

function displayProjects(projects) {
  console.log('🎨 Rendering enhanced projects...');
  
  // Create filter buttons
  const allTags = [...new Set(Object.values(projects).flatMap(p => p.tags || []))];
  const categories = ['all', ...allTags];
  
  let html = `
    <style>
      .projects-container { 
        padding: 0; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        min-height: 100vh;
      }
      .projects-header { 
        text-align: center; 
        padding: 60px 20px 40px; 
        background: rgba(255,255,255,0.05); 
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .projects-title { 
        font-size: 3rem; 
        font-weight: 700; 
        background: linear-gradient(45deg, #fff, #e0e7ff);
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent;
        margin-bottom: 15px;
        text-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .projects-subtitle { 
        font-size: 1.2rem; 
        color: rgba(255,255,255,0.8); 
        max-width: 600px; 
        margin: 0 auto;
      }
      
      .controls-section {
        padding: 30px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
        background: rgba(255,255,255,0.03);
      }
      
      .filter-controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .filter-btn {
        padding: 8px 16px;
        border: 2px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: white;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        backdrop-filter: blur(10px);
      }
      
      .filter-btn:hover,
      .filter-btn.active {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.6);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      }
      
      .view-controls {
        display: flex;
        gap: 8px;
      }
      
      .view-toggle {
        padding: 8px 12px;
        background: rgba(255,255,255,0.1);
        color: white;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .view-toggle.active {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.6);
      }
      
      .search-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .search-input {
        padding: 10px 16px;
        border: 2px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: white;
        border-radius: 25px;
        outline: none;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        min-width: 250px;
      }
      
      .search-input::placeholder {
        color: rgba(255,255,255,0.6);
      }
      
      .search-input:focus {
        border-color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.15);
      }
      
      .projects-content {
        padding: 40px 20px;
      }
      
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 30px;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .projects-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }
      
      .project-card {
        background: rgba(255,255,255,0.95);
        border-radius: 20px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.4s ease;
        transform-style: preserve-3d;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
      }
      
      .project-card:hover {
        transform: translateY(-10px) rotateX(5deg);
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        background: rgba(255,255,255,0.98);
      }
      
      .project-image {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 15px;
        margin-bottom: 20px;
        transition: transform 0.3s ease;
      }
      
      .project-card:hover .project-image {
        transform: scale(1.05);
      }
      
      .project-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 10px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .project-time {
        color: #7f8c8d;
        font-weight: 600;
        margin-bottom: 15px;
        font-size: 0.9rem;
      }
      
      .project-description {
        color: #34495e;
        line-height: 1.6;
        margin-bottom: 20px;
        font-size: 0.95rem;
      }
      
      .project-resources {
        margin: 20px 0;
      }
      
      .resource-link {
        display: inline-block;
        margin: 0 8px 8px 0;
        padding: 8px 16px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        text-decoration: none;
        border-radius: 25px;
        font-size: 0.8rem;
        font-weight: 600;
        transition: all 0.3s ease;
        text-transform: uppercase;
      }
      
      .resource-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        background: linear-gradient(45deg, #764ba2, #667eea);
      }
      
      .no-media-button {
        display: inline-block;
        margin: 0 8px 8px 0;
        padding: 8px 16px;
        background: transparent;
        color: #999;
        border: 2px dashed #ddd;
        border-radius: 25px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        cursor: default;
        transition: all 0.3s ease;
      }
      
      .no-media-button:hover {
        border-color: #ccc;
        color: #888;
      }
      
      .project-tags {
        margin-top: 15px;
      }
      
      .tag {
        display: inline-block;
        background: linear-gradient(45deg, #f093fb, #f5576c);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        margin: 0 6px 6px 0;
        font-weight: 500;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .project-card:nth-child(1) { animation-delay: 0.1s; }
      .project-card:nth-child(2) { animation-delay: 0.2s; }
      .project-card:nth-child(3) { animation-delay: 0.3s; }
      .project-card:nth-child(4) { animation-delay: 0.4s; }
      .project-card:nth-child(5) { animation-delay: 0.5s; }
      .project-card:nth-child(6) { animation-delay: 0.6s; }
    </style>
    
    <div class="projects-container">
      <div class="projects-header">
        <h1 class="projects-title">Featured Projects</h1>
        <p class="projects-subtitle">Explore my journey through automotive systems, robotics, and cutting-edge engineering solutions</p>
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
        <div class="${isGridView ? 'projects-grid' : 'projects-list'}" id="projects-display">
          <!-- Projects will be inserted here -->
        </div>
      </div>
    </div>
  `;
  
  $('#projects-container').html(html);
  displayFilteredProjects();
  console.log('✅ Enhanced projects rendered successfully');
}

function displayFilteredProjects() {
  const container = $('#projects-display');
  let html = '';
  
  Object.entries(filteredProjects).forEach(([title, project], index) => {
    const delay = index * 0.1;
    html += `
      <div class="project-card" data-project="${title}" style="animation-delay: ${delay}s;">
        ${project.img ? `
          <img src="${project.img}" alt="${title}" class="project-image" onerror="this.style.display='none'">
        ` : ''}
        
        <h3 class="project-title">${title}</h3>
        <div class="project-time">${project.time}</div>
        <p class="project-description">${project.description.length > 150 ? project.description.substring(0, 150) + '...' : project.description}</p>
        
        ${Object.keys(project.resources || {}).length > 0 ? `
          <div class="project-resources">
            ${Object.entries(project.resources).map(([type, url]) => 
              `<a href="${url}" target="_blank" class="resource-link" onclick="event.stopPropagation();">${type}</a>`
            ).join('')}
          </div>
        ` : `
          <div class="project-resources">
            <span class="no-media-button">No media</span>
          </div>
        `}
        
        ${project.tags && project.tags.length > 0 ? `
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  });
  
  container.html(html);
}

function setActiveFilter(element, filter) {
  $('.filter-btn').removeClass('active');
  $(element).addClass('active');
  currentFilter = filter;
}

function filterProjects(filter) {
  if (filter === 'all') {
    filteredProjects = allProjects;
  } else {
    filteredProjects = Object.fromEntries(
      Object.entries(allProjects).filter(([title, project]) => 
        project.tags && project.tags.includes(filter)
      )
    );
  }
  displayFilteredProjects();
}

function searchProjects(searchTerm) {
  if (!searchTerm) {
    filterProjects(currentFilter);
    return;
  }
  
  filteredProjects = Object.fromEntries(
    Object.entries(allProjects).filter(([title, project]) => {
      const searchableText = `${title} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase();
      return searchableText.includes(searchTerm);
    })
  );
  displayFilteredProjects();
}

function updateViewToggle() {
  $('.view-toggle').removeClass('active');
  $(`.view-toggle[data-view="${isGridView ? 'grid' : 'list'}"]`).addClass('active');
}

function openProjectModal(title) {
  console.log('🎭 MODAL DEBUG: Opening modal for:', title);
  const project = allProjects[title];
  if (!project) {
    console.error('❌ MODAL DEBUG: Project not found:', title);
    return;
  }
  
  console.log('📋 MODAL DEBUG: Project data:', project);
  console.log('🎭 MODAL DEBUG: Modal exists:', !!project.modal);
  if (project.modal) {
    console.log('📝 MODAL DEBUG: Detailed description:', !!project.modal.detailed_description);
    console.log('⚙️ MODAL DEBUG: Technical details:', !!project.modal.technical_details);
    console.log('💥 MODAL DEBUG: Impact data:', !!project.modal.impact);
  }
  
  // Generate additional content based on project type and information
  const additionalSections = generateAdditionalContent(title, project);
  console.log('📄 MODAL DEBUG: Additional sections generated, length:', additionalSections.length);
  
  const modalHtml = `
    <div class="modal-backdrop" style="
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.8); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 10000;
      backdrop-filter: blur(5px);
    ">
      <div class="modal-content" style="
        background: white; 
        border-radius: 20px; 
        max-width: 900px; 
        max-height: 90vh; 
        overflow-y: auto; 
        position: relative;
        animation: modalSlideIn 0.3s ease;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
      ">
        <button class="modal-close" style="
          position: absolute; 
          top: 20px; 
          right: 20px; 
          background: #e74c3c; 
          color: white; 
          border: none; 
          border-radius: 50%; 
          width: 40px; 
          height: 40px; 
          cursor: pointer; 
          font-size: 18px;
          transition: all 0.2s ease;
          z-index: 1;
        " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">×</button>
        
        <div style="padding: 40px;">
          <!-- Header Section -->
          <div style="border-bottom: 2px solid #f8f9fa; padding-bottom: 25px; margin-bottom: 30px;">
            ${project.img ? `
              <img src="${project.img}" alt="${title}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 15px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            ` : ''}
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
              <h2 style="color: #2c3e50; margin: 0; font-size: 2.2rem; flex: 1;">${title}</h2>
              <div style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                ${project['4_letter'] || 'PROJECT'}
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 20px; color: #7f8c8d; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">📅</span>
                <span style="font-weight: 600;">${project.time}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">⚡</span>
                <span style="font-weight: 600;">${getProjectStatus(project.time)}</span>
              </div>
            </div>
          </div>

          <!-- Project Overview -->
          <div style="margin-bottom: 35px;">
            <h3 style="color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">📖</span>
              Project Overview
            </h3>
            <p style="color: #34495e; line-height: 1.8; font-size: 1.1rem; background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
              ${project.description}
            </p>
          </div>

          ${additionalSections}

          <!-- Technical Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">⚙️</span>
              Technical Implementation
            </h3>
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 25px; border-radius: 15px;">
              ${getTechnicalDetails(title, project)}
            </div>
          </div>

          <!-- Impact & Results -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">🎯</span>
              Impact & Results
            </h3>
            <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 25px; border-radius: 15px; color: #2d3436;">
              ${getImpactSection(title, project)}
            </div>
          </div>

          ${Object.keys(project.resources || {}).length > 0 ? `
            <div style="margin: 30px 0;">
              <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">🔗</span>
                Resources & Links
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                ${Object.entries(project.resources).map(([type, url]) => 
                  `<a href="${url}" target="_blank" style="
                    display: flex; 
                    align-items: center; 
                    gap: 8px;
                    padding: 15px 25px; 
                    background: linear-gradient(45deg, #667eea, #764ba2); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                  " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'">
                    ${getResourceIcon(type)}
                    ${type.toUpperCase()}
                  </a>`
                ).join('')}
              </div>
            </div>
          ` : ''}
          
          ${project.tags && project.tags.length > 0 ? `
            <div style="margin-top: 30px;">
              <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">🏷️</span>
                Technologies & Skills
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${project.tags.map(tag => 
                  `<span style="
                    display: flex; 
                    align-items: center; 
                    gap: 6px;
                    background: linear-gradient(45deg, #f093fb, #f5576c); 
                    color: white; 
                    padding: 12px 20px; 
                    border-radius: 25px; 
                    font-size: 0.95rem; 
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
                  ">
                    ${getTagIcon(tag)}
                    ${tag}
                  </span>`
                ).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Call to Action -->
          <div style="margin-top: 40px; text-align: center; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
            <h4 style="margin-bottom: 15px; font-size: 1.3rem;">Interested in Learning More?</h4>
            <p style="margin-bottom: 20px; opacity: 0.9;">Feel free to reach out if you'd like to discuss this project or explore collaboration opportunities!</p>
            <a href="mailto:amarmaksumich@gmail.com?subject=Inquiry about ${encodeURIComponent(title)}" style="
              display: inline-flex; 
              align-items: center; 
              gap: 8px; 
              padding: 12px 25px; 
              background: rgba(255,255,255,0.2); 
              color: white; 
              text-decoration: none; 
              border-radius: 25px; 
              font-weight: 600;
              border: 2px solid rgba(255,255,255,0.3);
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.borderColor='rgba(255,255,255,0.6)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.borderColor='rgba(255,255,255,0.3)'">
              📧 Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: scale(0.8) translateY(50px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      .modal-content::-webkit-scrollbar {
        width: 8px;
      }
      .modal-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .modal-content::-webkit-scrollbar-thumb {
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 10px;
      }
    </style>
  `;
  
  $('body').append(modalHtml);
}

function closeProjectModal() {
  $('.modal-backdrop').remove();
}

function generateAdditionalContent(title, project) {
  let sections = '';
  
  // Use detailed description from JSON if available
  if (project.modal && project.modal.detailed_description) {
    sections += `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">📋</span>
          Detailed Description
        </h3>
        <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4f1d4 100%); padding: 25px; border-radius: 15px; color: #2d3436;">
          <p style="line-height: 1.7; margin: 0;">${project.modal.detailed_description}</p>
        </div>
      </div>
    `;
  }
  
  // Use custom context from JSON if available
  if (project.modal && project.modal.context) {
    const context = project.modal.context;
    const contextIcons = {
      'motorsport': '🏎️',
      'robotics': '🤖',
      'research': '🔬',
      'aerospace': '🚀',
      'software': '💻'
    };
    
    const contextColors = {
      'motorsport': 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
      'robotics': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'research': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'aerospace': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'software': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    };
    
    sections += `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">${contextIcons[context.type] || '📁'}</span>
          ${context.title}
        </h3>
        <div style="background: ${contextColors[context.type] || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}; padding: 25px; border-radius: 15px; color: ${context.type === 'research' ? '#2d3436' : 'white'};">
          <p style="line-height: 1.7; margin: 0;">${context.content}</p>
        </div>
      </div>
    `;
  }
  
  // Add challenges section if available
  if (project.modal && project.modal.challenges && project.modal.challenges.length > 0) {
    sections += `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">⚡</span>
          Key Challenges
        </h3>
        <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 25px; border-radius: 15px; color: #2d3436;">
          ${project.modal.challenges.map(challenge => `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600;">${challenge.title}</h4>
              <p style="margin: 0; line-height: 1.6;">${challenge.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Add skills gained section if available
  if (project.modal && project.modal.skills_gained && project.modal.skills_gained.length > 0) {
    sections += `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.5rem;">🎓</span>
          Skills & Learning Outcomes
        </h3>
        <div style="background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); padding: 25px; border-radius: 15px; color: #2d3436;">
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${project.modal.skills_gained.map(skill => `
              <span style="
                background: rgba(255,255,255,0.7); 
                color: #2c3e50; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-size: 0.9rem; 
                font-weight: 500;
                border: 1px solid rgba(44, 62, 80, 0.1);
              ">${skill}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  return sections;
}

function getTechnicalDetails(title, project) {
  let details = [];
  
  // Debug logging
  console.log('🔧 getTechnicalDetails for:', title);
  console.log('📋 Project modal exists:', !!project.modal);
  if (project.modal) {
    console.log('⚙️ Technical details exists:', !!project.modal.technical_details);
    console.log('📊 Technical details length:', project.modal.technical_details ? project.modal.technical_details.length : 0);
  }
  
  // Use custom technical details from JSON if available
  if (project.modal && project.modal.technical_details && project.modal.technical_details.length > 0) {
    console.log('✅ Using custom technical details from JSON');
    details = project.modal.technical_details;
  } else {
    console.log('⚠️ Falling back to auto-generated technical details');
    // Fallback to auto-generated content based on description analysis
    const description = project.description.toLowerCase();
    
    if (description.includes('python') || description.includes('opencv') || description.includes('machine learning')) {
      details.push({
        icon: '🐍',
        title: 'Software Development',
        content: 'Built using Python with advanced libraries including OpenCV for computer vision, NumPy for numerical computations, and machine learning frameworks for intelligent decision making.'
      });
    }
    
    if (description.includes('c++') || description.includes('embedded') || description.includes('control')) {
      details.push({
        icon: '⚡',
        title: 'Embedded Systems',
        content: 'Low-level C++ programming for real-time embedded systems, implementing control algorithms with precise timing requirements and hardware interfacing.'
      });
    }
    
    if (description.includes('cad') || description.includes('design') || description.includes('mechanical')) {
      details.push({
        icon: '🛠️',
        title: 'Mechanical Design',
        content: 'CAD modeling and mechanical design using industry-standard software, with focus on manufacturability, assembly constraints, and performance optimization.'
      });
    }
    
    if (description.includes('arduino') || description.includes('jetson') || description.includes('microcontroller')) {
      details.push({
        icon: '🔧',
        title: 'Hardware Integration',
        content: 'Custom hardware solutions integrating sensors, actuators, and microcontrollers with careful consideration of power management, signal integrity, and reliability.'
      });
    }
    
    // Default technical content if no specific technologies detected
    if (details.length === 0) {
      details.push({
        icon: '💻',
        title: 'Engineering Approach',
        content: 'Systematic engineering methodology involving requirements analysis, design iteration, prototyping, testing, and continuous improvement based on performance metrics.'
      });
    }
  }
  
  return details.map(detail => `
    <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
      <div style="font-size: 2rem; flex-shrink: 0;">${detail.icon}</div>
      <div>
        <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 1.1rem;">${detail.title}</h4>
        <p style="margin: 0; line-height: 1.6; color: #555;">${detail.content}</p>
      </div>
    </div>
  `).join('');
}

function getImpactSection(title, project) {
  let impact = '';
  
  // Debug logging
  console.log('🎯 getImpactSection for:', title);
  console.log('📋 Project modal exists:', !!project.modal);
  if (project.modal) {
    console.log('💥 Impact exists:', !!project.modal.impact);
    console.log('📊 Impact length:', project.modal.impact ? project.modal.impact.length : 0);
  }
  
  // Use custom impact data from JSON if available
  if (project.modal && project.modal.impact && project.modal.impact.length > 0) {
    console.log('✅ Using custom impact data from JSON');
    impact = project.modal.impact.map(item => `
      <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
        <div style="font-size: 2rem;">${item.icon}</div>
        <div>
          <h4 style="margin: 0 0 8px 0; color: #2d3436; font-size: 1.1rem;">${item.title}</h4>
          <p style="margin: 0; line-height: 1.6;">${item.content}</p>
        </div>
      </div>
    `).join('');
  } else {
    console.log('⚠️ Falling back to auto-generated impact content');
    // Fallback to auto-generated content based on project timeframe
    if (project.time.includes('WIP') || project.time.includes('current')) {
      impact = `
        <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
          <div style="font-size: 2rem;">🚀</div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #2d3436; font-size: 1.1rem;">Ongoing Development</h4>
            <p style="margin: 0; line-height: 1.6;">This project is actively being developed with regular progress updates and new feature implementations.</p>
          </div>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
          <div style="font-size: 2rem;">📈</div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #2d3436; font-size: 1.1rem;">Future Applications</h4>
            <p style="margin: 0; line-height: 1.6;">Expected to contribute to advanced automotive control systems and autonomous vehicle development.</p>
          </div>
        </div>
      `;
    } else {
      impact = `
        <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
          <div style="font-size: 2rem;">✅</div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #2d3436; font-size: 1.1rem;">Successful Completion</h4>
            <p style="margin: 0; line-height: 1.6;">Project was completed successfully, meeting all initial objectives and performance requirements.</p>
          </div>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start;">
          <div style="font-size: 2rem;">🎓</div>
          <div>
            <h4 style="margin: 0 0 8px 0; color: #2d3436; font-size: 1.1rem;">Learning Outcomes</h4>
            <p style="margin: 0; line-height: 1.6;">Gained valuable experience in project management, technical problem-solving, and cross-functional team collaboration.</p>
          </div>
        </div>
      `;
    }
  }
  
  return impact;
}

function getProjectStatus(timeString) {
  if (timeString.includes('WIP') || timeString.includes('current')) {
    return 'In Progress';
  } else if (timeString.includes('2023') || timeString.includes('2024')) {
    return 'Recently Completed';
  } else {
    return 'Completed';
  }
}

function getResourceIcon(type) {
  const icons = {
    'github': '💻',
    'website': '🌐',
    'cad': '📐',
    'paper': '📄',
    'documentation': '📚',
    'demo': '🎥'
  };
  return icons[type.toLowerCase()] || '🔗';
}

function getTagIcon(tag) {
  const icons = {
    'Control Systems': '⚙️',
    'Mechanical Engineering': '🔧',
    'Computer Vision': '👁️',
    'Machine Learning': '🤖',
    'IoT & Networking': '📡',
    'Rocketry': '🚀'
  };
  return icons[tag] || '🏷️';
}

// Initialize function for compatibility with modern.js loading
function initializeProjects() {
  console.log('🔄 initializeProjects called - reloading projects');
  loadProjects();
}

// Make function available globally
window.initializeProjects = initializeProjects;