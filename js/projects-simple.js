// Enhanced Projects JavaScript with animations, filtering, and modals
// Updated: 2025-10-03 - Modal Enhancement Debug Version

// Use window object to avoid redeclaration errors
window.allProjects = window.allProjects || {};
window.filteredProjects = window.filteredProjects || {};
window.currentFilter = window.currentFilter || 'all';
window.isGridView = window.isGridView !== undefined ? window.isGridView : true;

// Flag to prevent modern.js from interfering
window.enhancedProjectsActive = true;

// Create local references for easier use
var allProjects = window.allProjects;
var filteredProjects = window.filteredProjects;
var currentFilter = window.currentFilter;
var isGridView = window.isGridView;

$(document).ready(function() {
  try {
    console.log('📁 Enhanced Projects.js loaded - jQuery available:', typeof $ !== 'undefined');
    
    // Prevent multiple initialization
    if (window.projectsInitialized) {
      console.log('📁 Projects already initialized, loading fresh data...');
      loadProjects();
      return;
    }
    
    window.projectsInitialized = true;
    loadProjects();
    console.log('📁 About to call setupEventListeners...');
    setupEventListeners();
    console.log('📁 Setup complete, isGridView initial value:', window.isGridView);
  } catch (error) {
    console.error('❌ Error in document ready:', error);
  }
});

function setupEventListeners() {
  console.log('🎯 Setting up event listeners...');
  
  // Filter buttons
  $(document).on('click', '.filter-btn', function() {
    const filter = $(this).data('filter');
    setActiveFilter(this, filter);
    filterProjects(filter);
  });
  
  // View toggle
  $(document).on('click', '.view-toggle', function() {
    console.log('🔄 VIEW TOGGLE CLICKED! Button:', $(this).attr('data-view'));
    console.log('🔄 Before toggle - isGridView:', window.isGridView);
    window.isGridView = isGridView = !isGridView;
    console.log('🔄 After toggle - isGridView:', window.isGridView);
    updateViewToggle();
    displayFilteredProjects();
  });
  
  // Search functionality
  $(document).on('input', '#project-search', function() {
    const searchTerm = $(this).val().toLowerCase();
    searchProjects(searchTerm);
  });
  
  console.log('✅ Event listeners set up complete');
  
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
      
      window.allProjects = allProjects = projects;
      window.filteredProjects = filteredProjects = projects;
      displayProjects(projects);
    })
    .catch(error => {
      console.error('❌ Error loading projects:', error);
      $('#projects-container').html('<div style="padding: 20px; text-align: center; color: #666;">Error loading projects. Please try again.</div>');
    });
}

function displayProjects(projects) {
  console.log('🎨 Rendering enhanced projects...');
  console.log('� NEW DEBUG VERSION 2 LOADED - TESTING ROUNDED BORDERS!');
  console.log('�🔍 DEBUG: displayProjects called with', Object.keys(projects).length, 'projects');
  
  // Random background selection
  const backgrounds = ['-1.webp', '1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp'];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  console.log('🎨 Selected random background:', randomBg);
  console.log('🎨 Full background URL will be:', `img/background/${randomBg}`);
  
  // Create filter buttons
  const allTags = [...new Set(Object.values(projects).flatMap(p => p.tags || []))];
  const categories = ['all', ...allTags];
  
  // Set random background dynamically
  const style = document.createElement('style');
  style.textContent = `
    .projects-container::before {
      background-image: url('img/background/${randomBg}') !important;
    }
  `;
  document.head.appendChild(style);
  
  let html = `
    
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
        <div id="projects-display">
          <!-- Projects will be inserted here -->
        </div>
      </div>
    </div>
  `;
  
  console.log('🏗️ Setting projects container HTML...');
  console.log('🏗️ isGridView when generating HTML:', isGridView);
  console.log('🏗️ HTML contains view-toggle buttons:', html.includes('view-toggle'));
  console.log('🏗️ Button HTML snippet:', html.substring(html.indexOf('view-controls'), html.indexOf('view-controls') + 200));
  
  const projectsContainer = $('#projects-container');
  console.log('🏗️ Projects container found:', projectsContainer.length);
  projectsContainer.html(html);
  
  // Protect the container from being cleared by other scripts
  projectsContainer.attr('data-enhanced-projects', 'true');
  
  console.log('🏗️ Checking if view toggle buttons exist:', $('.view-toggle').length);
  $('.view-toggle').each(function(i, btn) {
    console.log('🏗️ Button', i, '- data-view:', $(btn).attr('data-view'), 'active:', $(btn).hasClass('active'));
  });
  
  // Test if click events work by adding a temporary direct handler
  setTimeout(() => {
    console.log('🧪 Testing direct click handlers...');
    $('.view-toggle').off('click.test').on('click.test', function() {
      console.log('🧪 DIRECT CLICK HANDLER FIRED!', $(this).attr('data-view'));
    });
  }, 500);
  
  // Add DOM mutation observer to detect content changes
  setTimeout(() => {
    const container = $('#projects-display')[0];
    
    // DEEP DEBUG: Check what else might be affecting this container
    console.log('🔬 DEEP DEBUG - Container element:', container);
    console.log('🔬 Container parent:', container ? container.parentElement : 'NO CONTAINER');
    console.log('🔬 All scripts on page:', Array.from(document.scripts).map(s => s.src || 'inline'));
    console.log('🔬 jQuery event handlers on container:', $._data(container, 'events'));
    
    if (container && window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            console.log('🔍 DOM MUTATION detected on #projects-display:');
            console.log('🔍 Nodes added:', mutation.addedNodes.length);
            console.log('🔍 Nodes removed:', mutation.removedNodes.length);
            console.log('🔍 Current children count:', container.children.length);
            
            // Only alert if content was removed WITHOUT new content being added
            if (mutation.removedNodes.length > 0 && mutation.addedNodes.length === 0) {
              console.log('❌ ALERT: Content was cleared without replacement!');
              console.trace('🔍 Mutation stack trace');
            } else if (mutation.addedNodes.length > 0) {
              console.log('✅ Content successfully updated');
            }
          }
        });
      });
      
      observer.observe(container, { 
        childList: true, 
        subtree: true 
      });
      console.log('🔍 DOM observer attached to #projects-display');
    }
    
    displayFilteredProjects();
  }, 100);
  console.log('✅ Enhanced projects rendered successfully');
}

function displayFilteredProjects() {
  const container = $('#projects-display');
  if (container.length === 0) return;
  
  let html = '';
  if (isGridView) {
    html = generateGridView();
  } else {
    html = generateListView();
  }
  
  container.html(html);
}

function actuallyDisplayProjects() {
  console.log('🎯 === ACTUALLY DISPLAYING PROJECTS ===');
  
  try {
    const container = $('#projects-display');
    console.log('🎯 Container check - found:', container.length);
    console.log('🎯 Container current children:', container.children().length);
    
    if (container.length === 0) {
      console.error('❌ Container disappeared!');
      return;
    }
    
    let html = '';
    const projectCount = Object.keys(filteredProjects).length;
    console.log('🎯 Projects to display:', projectCount);
    
    if (projectCount === 0) {
      html = '<div style="padding: 40px; text-align: center; color: #666;">No projects available</div>';
    } else if (isGridView) {
      console.log('🎯 Generating GRID view...');
      html = generateGridView();
    } else {
      console.log('🎯 Generating LIST view...');
      html = generateListView();
    }
    
    console.log('🎯 Generated HTML length:', html.length);
    console.log('🎯 HTML preview:', html.substring(0, 200) + '...');
    
    // Force update regardless
    console.log('🎯 Setting HTML content...');
    
    // MINIMAL TEST: Set simple content first
    container.html('<div style="background: red; color: white; padding: 20px; font-size: 24px;">TEST CONTENT - SHOULD BE VISIBLE</div>');
    
    setTimeout(() => {
      const testVisible = container.children().length;
      console.log('🧪 MINIMAL TEST - Test content visible:', testVisible > 0);
      
      if (testVisible > 0) {
        console.log('🧪 Test content survived - now setting real HTML');
        container.html(html);
      } else {
        console.error('🧪 CRITICAL: Even simple test content disappeared!');
        return; // Don't proceed if test content disappears
      }
    }, 100);
    
    // Verify it was set and check CSS visibility
    setTimeout(() => {
      const newChildCount = container.children().length;
      console.log('🎯 After HTML set - children count:', newChildCount);
      
      if (newChildCount === 0) {
        console.error('❌ HTML was cleared after setting!');
      } else {
        // Check CSS visibility
        const containerStyles = window.getComputedStyle(container[0]);
        const firstCard = container.children().first()[0];
        const firstCardStyles = firstCard ? window.getComputedStyle(firstCard) : null;
        
        console.log('🎨 Container CSS - display:', containerStyles.display, 'visibility:', containerStyles.visibility, 'opacity:', containerStyles.opacity);
        console.log('🎨 Container CSS - z-index:', containerStyles.zIndex, 'position:', containerStyles.position);
        console.log('🎨 Container classes:', container.attr('class'));
        
        // Check for elements that might be covering our content
        const containerRect = container[0].getBoundingClientRect();
        console.log('🎨 Container position:', {
          top: containerRect.top,
          left: containerRect.left,
          width: containerRect.width,
          height: containerRect.height
        });
        
        // Check what element is at the container's position
        const elementAtPosition = document.elementFromPoint(
          containerRect.left + containerRect.width/2,
          containerRect.top + containerRect.height/2
        );
        console.log('🎨 Element covering container center:', elementAtPosition);
        
        if (firstCardStyles) {
          console.log('🎨 First card CSS - display:', firstCardStyles.display, 'visibility:', firstCardStyles.visibility, 'opacity:', firstCardStyles.opacity);
          console.log('🎨 First card CSS - z-index:', firstCardStyles.zIndex, 'position:', firstCardStyles.position);
          console.log('🎨 First card classes:', firstCard.className);
        }
        
        // Force visible styles and high z-index if needed
        if (containerStyles.display === 'none' || containerStyles.visibility === 'hidden') {
          console.log('🔧 Forcing container to be visible');
          container.css({ display: 'block', visibility: 'visible', opacity: '1' });
        }
        
        // Force high z-index to ensure content is on top
        console.log('🔧 Forcing high z-index for container');
        container.css({
          'z-index': '9999',
          'position': 'relative',
          'background': 'rgba(255,255,255,0.95)' // Add background to see if covered
        });
      }
    }, 10);
    
    console.log('🎯 Display complete');
    
  } catch (error) {
    console.error('❌ Error in actuallyDisplayProjects:', error);
    console.error('❌ Stack:', error.stack);
  }
  
  console.log('🎯 === DISPLAY FUNCTION END ===');
}

function generateGridView() {
  let html = '';
  
  Object.entries(filteredProjects).forEach(([title, project], index) => {
    const delay = index * 0.1;
    const techStack = project.modal?.technical_details?.tech_stack || project.tags || [];
    const status = getProjectStatus(project.time);
    
    html += `
      <div class="project-card grid-card" data-project="${title}" style="animation-delay: ${delay}s;">
        ${project.img ? `
          <img src="${project.img}" alt="${title}" class="project-image" onerror="this.style.display='none'">
        ` : `
          <div class="project-placeholder">
            <div class="placeholder-icon">🚀</div>
            <div class="placeholder-text">Project</div>
          </div>
        `}
        
        <div class="grid-content">
          <h3 class="project-title">${title}</h3>
          <div class="project-meta">
            <span class="project-time">📅 ${project.time}</span>
            <span class="project-status status-${status.toLowerCase()}">${status}</span>
          </div>
          
          <p class="project-description">${project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}</p>
          
          ${techStack.length > 0 ? `
            <div class="tech-stack">
              <div class="tech-label">💻 Tech:</div>
              <div class="tech-items">
                ${techStack.slice(0, 3).map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                ${techStack.length > 3 ? `<span class="tech-more">+${techStack.length - 3} more</span>` : ''}
              </div>
            </div>
          ` : ''}
          
          <div class="grid-footer">
            <div class="click-hint">👆 Click to explore</div>
            ${Object.keys(project.resources || {}).length > 0 ? `
              <div class="resources-count">📁 ${Object.keys(project.resources).length} resources</div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });
  
  return html;
}

function generateListView() {
  let html = '';
  
  Object.entries(filteredProjects).forEach(([title, project], index) => {
    const delay = index * 0.05;
    const modal = project.modal || {};
    const techDetails = modal.technical_details || {};
    const impact = modal.impact || '';
    const challenges = modal.challenges || '';
    const skills = modal.skills_gained || [];
    const status = getProjectStatus(project.time);
    
    html += `
      <div class="project-card list-card" data-project="${title}" style="animation-delay: ${delay}s;">
        <div class="list-content">
          <div class="list-header">
            <div class="list-title-section">
              <h3 class="project-title">${title}</h3>
              <div class="list-meta">
                <span class="project-time">📅 ${project.time}</span>
                <span class="project-status status-${status.toLowerCase()}">${status}</span>
                ${modal.context ? `<span class="project-context">🏢 ${modal.context}</span>` : ''}
              </div>
            </div>
            ${project.img ? `
              <div class="list-image">
                <img src="${project.img}" alt="${title}" onerror="this.style.display='none'">
              </div>
            ` : ''}
          </div>
          
          <div class="list-body">
            <div class="main-description">
              <p><strong>Overview:</strong> ${project.description}</p>
              ${modal.detailed_description ? `
                <p><strong>Details:</strong> ${modal.detailed_description}</p>
              ` : ''}
            </div>
            
            ${impact ? `
              <div class="impact-section">
                <strong>🎯 Impact & Results:</strong>
                <p>${impact}</p>
              </div>
            ` : ''}
            
            ${challenges ? `
              <div class="challenges-section">
                <strong>⚡ Key Challenges:</strong>
                <p>${challenges}</p>
              </div>
            ` : ''}
            
            <div class="technical-details">
              ${techDetails.tech_stack?.length > 0 ? `
                <div class="tech-section">
                  <strong>💻 Technology Stack:</strong>
                  <div class="tech-list">
                    ${techDetails.tech_stack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${techDetails.architecture ? `
                <div class="architecture-section">
                  <strong>🏗️ Architecture:</strong> <span>${techDetails.architecture}</span>
                </div>
              ` : ''}
              
              ${techDetails.key_features?.length > 0 ? `
                <div class="features-section">
                  <strong>✨ Key Features:</strong>
                  <ul>
                    ${techDetails.key_features.map(feature => `<li>${feature}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            ${skills.length > 0 ? `
              <div class="skills-section">
                <strong>🎓 Skills Developed:</strong>
                <div class="skills-list">
                  ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${Object.keys(project.resources || {}).length > 0 ? `
              <div class="resources-section">
                <strong>📁 Resources & Links:</strong>
                <div class="resource-links">
                  ${Object.entries(project.resources).map(([type, url]) => 
                    `<a href="${url}" target="_blank" class="resource-link" onclick="event.stopPropagation();">
                      <span class="resource-icon">${getResourceIcon(type)}</span>
                      <span>${type}</span>
                    </a>`
                  ).join('')}
                </div>
              </div>
            ` : ''}
            
            ${project.tags?.length > 0 ? `
              <div class="tags-section">
                <strong>🏷️ Categories:</strong>
                <div class="project-tags">
                  ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  });
  
  return html;
}

function setActiveFilter(element, filter) {
  $('.filter-btn').removeClass('active');
  $(element).addClass('active');
  window.currentFilter = currentFilter = filter;
}

function filterProjects(filter) {
  if (filter === 'all') {
    window.filteredProjects = filteredProjects = allProjects;
  } else {
    window.filteredProjects = filteredProjects = Object.fromEntries(
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
  
  window.filteredProjects = filteredProjects = Object.fromEntries(
    Object.entries(allProjects).filter(([title, project]) => {
      const searchableText = `${title} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase();
      return searchableText.includes(searchTerm);
    })
  );
  displayFilteredProjects();
}

function updateViewToggle() {
  console.log('🎯 UpdateViewToggle called, isGridView:', isGridView);
  
  // Update button states
  $('.view-toggle').removeClass('active');
  const targetView = isGridView ? 'grid' : 'list';
  const selector = `.view-toggle[data-view="${targetView}"]`;
  console.log('🎯 Target selector:', selector);
  
  const targetButton = $(selector);
  console.log('🎯 Found target button:', targetButton.length);
  targetButton.addClass('active');
  
  // Update the container class to switch between grid and list view
  const container = $('#projects-display');
  console.log('🎯 Container found:', container.length, 'current classes:', container.attr('class'));
  
  if (isGridView) {
    container.removeClass('projects-list').addClass('projects-grid');
    console.log('🎯 Set to GRID view');
  } else {
    container.removeClass('projects-grid').addClass('projects-list');
    console.log('🎯 Set to LIST view');
  }
  
  console.log('🎯 Container classes after update:', container.attr('class'));
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

function getResourceIcon(type) {
  const icons = {
    'GitHub': '💻',
    'Demo': '🌐',
    'Video': '🎥',
    'Paper': '📄',
    'Slides': '📊',
    'Documentation': '📝',
    'Report': '📈',
    'Code': '💻',
    'Website': '🌍',
    'Article': '📰'
  };
  return icons[type] || '🔗';
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

// DEEP DEBUG: Simple isolated test function
window.testProjectsDisplay = function() {
  console.log('🧪 === ISOLATED TEST START ===');
  
  const container = $('#projects-display');
  console.log('🧪 Container found:', container.length);
  
  if (container.length === 0) {
    console.error('🧪 No container found!');
    return;
  }
  
  // Test 1: Simple text with HIGH Z-INDEX
  container.css({
    'z-index': '99999',
    'position': 'relative',
    'background': 'yellow'
  });
  container.html('<h1 style="color: red; font-size: 48px; z-index: 99999; position: relative; background: lime;">TEST 1 - HIGH Z-INDEX</h1>');
  
  setTimeout(() => {
    console.log('🧪 Test 1 result - children:', container.children().length);
    const testElement = container.find('h1')[0];
    if (testElement) {
      const testRect = testElement.getBoundingClientRect();
      const elementAtTest = document.elementFromPoint(
        testRect.left + testRect.width/2,
        testRect.top + testRect.height/2
      );
      console.log('🧪 Element at test position:', elementAtTest);
      console.log('🧪 Test element rect:', testRect);
    }
    
    // Test 2: Simple project card with EXTREME z-index
    container.html(`
      <div style="background: blue; color: white; padding: 20px; margin: 10px; border: 3px solid red; z-index: 99999; position: relative;">
        <h2>TEST PROJECT CARD - Z-INDEX 99999</h2>
        <p>This should be on TOP of everything</p>
      </div>
    `);
    
    setTimeout(() => {
      console.log('🧪 Test 2 result - children:', container.children().length);
      console.log('🧪 Container HTML:', container.html().substring(0, 100));
    }, 1000);
    
  }, 1000);
};

console.log('🧪 TEST FUNCTION READY: Type testProjectsDisplay() in console to run isolated test');