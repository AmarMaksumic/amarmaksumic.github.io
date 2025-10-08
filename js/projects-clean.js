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
            ${generateMediaCarousel(project)}
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

  setupCarouselNavigation(); 
  
  // Add event handlers using event delegation
  // Remove any existing modal handlers first
  $(document).off('click', '.modal-backdrop');
  $(document).off('click', '.modal-close');

  // Add event handlers with proper event stopping
  $(document).on('click', '.modal-backdrop', function(e) {
    // Only close if clicked directly on backdrop, not on modal content
    if (e.target === this) {
      closeProjectModal();
    }
  });

  $(document).on('click', '.modal-close', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeProjectModal();
  });

  // Prevent modal content clicks from bubbling to backdrop
  $(document).on('click', '.modal-content', function(e) {
    e.stopPropagation();
  });
}

function closeProjectModal() {
  console.log('❌ Closing modal');
  $('.modal-backdrop').remove();
}

function generateMediaCarousel(project) {
    const images = project.media?.images || [];
    const videos = project.media?.videos || [];
    const websites = project.media?.websites || [];
    
    // Fallback to old format if no media object exists
    if (!project.media && (project.img || project.image)) {
        images.push(project.img || project.image);
    }
    
    // Combine all media into a single array with type information
    const allMedia = [
        ...images.map(img => ({ type: 'image', src: img, title: 'Project Image' })),
        ...videos.map(video => ({ 
            type: 'video', 
            src: video.url, 
            thumbnail: video.thumbnail || 'img/video-placeholder.jpg',
            title: video.title || 'Project Video' 
        })),
        ...websites.map(website => ({ 
            type: 'website', 
            src: website.url, 
            preview: website.preview || 'img/website-placeholder.jpg',
            title: website.title || 'Project Website' 
        }))
    ];
    
    const hasMultipleMedia = allMedia.length > 1;
    
    console.log('🎠 Generating carousel for:', project.title, 'Total media:', allMedia.length);
    
    if (allMedia.length === 0) {
        return '<div class="no-media">No media available</div>';
    }
    
    let carouselHTML = `
        <div class="media-carousel">
            ${allMedia.map((media, index) => {
                if (media.type === 'image') {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-slide="${index}" data-type="image">
                            <img src="${media.src}" alt="${media.title}" />
                            <div class="media-type-indicator">📷 Image</div>
                        </div>
                    `;
                } else if (media.type === 'video') {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-slide="${index}" data-type="video">
                            <div class="video-container" onclick="window.open('${media.src}', '_blank')">
                                <img src="${media.thumbnail}" alt="${media.title}" />
                                <div class="video-overlay">
                                    <div class="play-button">▶️</div>
                                </div>
                            </div>
                            <div class="media-type-indicator">🎥 ${media.title}</div>
                        </div>
                    `;
                } else if (media.type === 'website') {
                    return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-slide="${index}" data-type="website">
                            <div class="website-container" onclick="window.open('${media.src}', '_blank')">
                                <img src="${media.preview}" alt="${media.title}" />
                                <div class="website-overlay">
                                    <div class="website-icon">🌐</div>
                                    <div class="website-text">Visit Site</div>
                                </div>
                            </div>
                            <div class="media-type-indicator">🌐 ${media.title}</div>
                        </div>
                    `;
                }
            }).join('')}
            
            ${hasMultipleMedia ? `
                <button class="carousel-nav carousel-prev" data-direction="prev">‹</button>
                <button class="carousel-nav carousel-next" data-direction="next">›</button>
                <div class="carousel-counter">
                    <span class="current-slide">1</span> of <span class="total-slides">${allMedia.length}</span>
                </div>
                <div class="media-type-filter">
                    <button class="media-filter-btn active" data-filter="all">🎯 All</button>
                    ${images.length > 0 ? '<button class="media-filter-btn" data-filter="image">📷 Images</button>' : ''}
                    ${videos.length > 0 ? '<button class="media-filter-btn" data-filter="video">🎥 Videos</button>' : ''}
                    ${websites.length > 0 ? '<button class="media-filter-btn" data-filter="website">🌐 Websites</button>' : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    return carouselHTML;
}

function setupCarouselNavigation() {
    // Remove any existing carousel event listeners
    $(document).off('click', '.carousel-nav');
    $(document).off('click', '.media-filter-btn');
    
    // Navigation arrows
    $(document).on('click', '.carousel-nav', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🎠 Carousel nav clicked:', $(this).attr('data-direction'));
        
        const carousel = $(this).closest('.media-carousel');
        const allSlides = carousel.find('.carousel-slide');
        
        // Get currently active slide
        const currentActiveSlide = carousel.find('.carousel-slide.active');
        const currentIndex = parseInt(currentActiveSlide.attr('data-slide')) || 0;
        const direction = $(this).attr('data-direction');
        
        console.log('🎠 Current active slide index:', currentIndex);
        console.log('🎠 Total slides:', allSlides.length);
        
        if (allSlides.length <= 1) {
            console.log('🎠 Only one slide, skipping navigation');
            return;
        }
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = currentIndex + 1 >= allSlides.length ? 0 : currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1 < 0 ? allSlides.length - 1 : currentIndex - 1;
        }
        
        console.log('🎠 Moving from slide', currentIndex, 'to slide', nextIndex);
        
        // Remove active class from all slides
        allSlides.removeClass('active');
        
        // Add active class to next slide using data-slide attribute
        const nextSlide = carousel.find(`[data-slide="${nextIndex}"]`);
        nextSlide.addClass('active');
        
        console.log('🎠 Next slide found:', nextSlide.length > 0);
        
        // Update counter
        const counter = carousel.find('.current-slide');
        if (counter.length) {
            counter.text(nextIndex + 1);
        }
    });
    
    // Media type filtering
    $(document).on('click', '.media-filter-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const carousel = $(this).closest('.media-carousel');
        const filter = $(this).attr('data-filter');
        
        console.log('🎯 Filter clicked:', filter);
        
        // Update active filter button
        carousel.find('.media-filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // Show/hide slides based on filter
        const allSlides = carousel.find('.carousel-slide');
        if (filter === 'all') {
            allSlides.show();
        } else {
            allSlides.hide();
            allSlides.filter(`[data-type="${filter}"]`).show();
        }
        
        // Activate first visible slide
        const visibleSlides = carousel.find('.carousel-slide:visible');
        allSlides.removeClass('active');
        if (visibleSlides.length > 0) {
            visibleSlides.first().addClass('active');
        }
        
        // Update counter
        const counter = carousel.find('.current-slide');
        const totalCounter = carousel.find('.total-slides');
        if (counter.length) {
            counter.text('1');
            totalCounter.text(visibleSlides.length);
        }
    });
}