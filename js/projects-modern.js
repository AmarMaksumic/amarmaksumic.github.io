// Modern Projects JavaScript - Enhanced version that loads from JSON

// Prevent redeclaration errors
if (typeof ModernProjectManager === 'undefined') {
  console.log('Creating ModernProjectManager class');

class ModernProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.allTags = new Set();
    this.init();
  }

  async init() {
    try {
      console.log('Initializing ModernProjectManager...');
      await this.loadProjects();
      console.log('Projects loaded, rendering...');
      this.renderFilterButtons();
      this.renderProjects();
      this.setupEventListeners();
      this.showFeaturedProject();
      console.log('Projects initialization complete!');
    } catch (error) {
      console.error('Error initializing projects:', error);
      this.showError();
    }
  }

  async loadProjects() {
    try {
      console.log('Loading projects from ./files/projects.json...');
      const response = await fetch('./files/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Projects JSON loaded successfully:', Object.keys(data).length, 'projects found');
      
      // Transform JSON data to array format with enhanced info
      this.projects = Object.entries(data).map(([name, details], index) => ({
        id: `project-${index}`,
        name,
        ...details,
        // Extract tags or create them from other data
        tags: details.tags || this.generateTagsFromProject(details)
      }));

      // Collect all unique tags
      this.projects.forEach(project => {
        if (project.tags) {
          project.tags.forEach(tag => this.allTags.add(tag));
        }
      });

      this.filteredProjects = [...this.projects];
      
      console.log(`Loaded ${this.projects.length} projects with ${this.allTags.size} unique tags`);
    } catch (error) {
      console.error('Error loading projects:', error);
      throw error;
    }
  }

  generateTagsFromProject(project) {
    // Generate tags based on project content if none exist
    const tags = [];
    
    const description = project.description?.toLowerCase() || '';
    
    // Technology detection
    if (description.includes('python') || description.includes('opencv') || description.includes('machine learning')) {
      tags.push('Machine Learning');
    }
    if (description.includes('c++') || description.includes('embedded') || description.includes('control')) {
      tags.push('Embedded Systems');
    }
    if (description.includes('robotics') || description.includes('robot')) {
      tags.push('Robotics');
    }
    if (description.includes('automotive') || description.includes('motorsport')) {
      tags.push('Automotive');
    }
    if (description.includes('computer vision') || description.includes('vision')) {
      tags.push('Computer Vision');
    }
    if (description.includes('web') || description.includes('website') || description.includes('app')) {
      tags.push('Web Development');
    }
    
    return tags.length > 0 ? tags : ['Engineering'];
  }

  renderFilterButtons() {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;

    const sortedTags = Array.from(this.allTags).sort();
    
    const filterHTML = `
      <button class="filter-btn active" data-filter="all">All Projects</button>
      ${sortedTags.map(tag => `
        <button class="filter-btn" data-filter="${tag}">${tag}</button>
      `).join('')}
    `;

    filterContainer.innerHTML = filterHTML;
  }

  renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) {
      console.error('Projects container not found! Looking for #projects-grid');
      console.log('Available containers:', document.querySelectorAll('[id*="project"]'));
      return;
    }
    console.log('Projects container found, rendering', this.filteredProjects.length, 'projects...');

    if (this.filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="no-projects">
          <i class="fas fa-search"></i>
          <h3>No projects found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');
    
    // Initialize animations
    this.initializeCardAnimations();
  }

  createProjectCard(project) {
    const hasResources = project.resources && (project.resources.github || project.resources.website || project.resources.cad);
    
    return `
      <article class="project-card" data-project-id="${project.id}">
        <div class="project-image">
          <img src="${project.img}" alt="${project.name}" loading="lazy" onerror="this.src='img/projects/place_hold.jpg'">
          ${hasResources ? `
            <div class="project-overlay">
              <div class="project-links">
                ${project.resources?.github ? `
                  <a href="${project.resources.github}" target="_blank" class="project-link" title="View Code">
                    <i class="fab fa-github"></i>
                  </a>
                ` : ''}
                ${project.resources?.website ? `
                  <a href="${project.resources.website}" target="_blank" class="project-link" title="Visit Website">
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                ` : ''}
                ${project.resources?.cad ? `
                  <a href="${project.resources.cad}" target="_blank" class="project-link" title="View CAD Model">
                    <i class="fas fa-cube"></i>
                  </a>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="project-content">
          <h3>${project.name}</h3>
          <p class="project-time">${project.time}</p>
          <p class="project-description">${this.truncateText(project.description, 150)}</p>
          ${project.tags && project.tags.length > 0 ? `
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  showFeaturedProject() {
    // Find the most impressive project (Rensselaer Motorsport ECU)
    const featuredProject = this.projects.find(p => 
      p.name.toLowerCase().includes('control systems unit') || 
      p.name.toLowerCase().includes('motorsport')
    ) || this.projects[0];

    if (!featuredProject) return;

    const container = document.getElementById('projects-grid');
    const featuredHTML = `
      <div class="featured-project">
        <div class="featured-content">
          <div class="featured-text">
            <h3>Featured Project: <span class="highlight">${featuredProject.name}</span></h3>
            <p class="featured-description">
              ${featuredProject.description}
            </p>
            <div class="achievements">
              <h4>Key Achievements:</h4>
              <ul class="achievement-list">
                <li>Leading cross-functional engineering team</li>
                <li>Implementing safety-critical automotive software</li>
                <li>Developing advanced control algorithms</li>
                <li>Real-world Formula SAE racing application</li>
              </ul>
            </div>
            <div class="tech-stack">
              <span class="tech-tag">C/C++</span>
              <span class="tech-tag">MATLAB/Simulink</span>
              <span class="tech-tag">CAN Protocol</span>
              <span class="tech-tag">Embedded Systems</span>
              <span class="tech-tag">Control Theory</span>
            </div>
          </div>
          <div class="featured-showcase">
            <img src="${featuredProject.img}" alt="${featuredProject.name}">
          </div>
        </div>
      </div>
    `;

    // Insert featured project before the grid
    container.insertAdjacentHTML('beforebegin', featuredHTML);
  }

  setupEventListeners() {
    // Filter buttons
    const filterContainer = document.getElementById('project-filters');
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        if (e.target.matches('.filter-btn')) {
          this.handleFilterClick(e.target);
        }
      });
    }

    // Search input
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 300); // Debounce search
      });
    }

    // Project card clicks for details
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) {
        this.handleProjectClick(card);
      }
    });
  }

  handleFilterClick(button) {
    const filter = button.getAttribute('data-filter');
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Filter projects
    this.filterProjects(filter);
  }

  filterProjects(filter) {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.tags && project.tags.includes(filter)
      );
    }
    
    this.renderProjects();
    this.updateURL(filter);
  }

  handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filterProjects(this.currentFilter);
      return;
    }

    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(term))) ||
      project.time.toLowerCase().includes(term)
    );

    this.renderProjects();
  }

  handleProjectClick(card) {
    const projectId = card.getAttribute('data-project-id');
    const project = this.projects.find(p => p.id === projectId);
    
    if (project) {
      this.showProjectModal(project);
    }
  }

  showProjectModal(project) {
    // Create and show detailed project modal
    const modalHTML = `
      <div class="project-modal" id="project-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>${project.name}</h2>
            <button class="modal-close" onclick="this.closest('.project-modal').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <img src="${project.img}" alt="${project.name}" class="modal-image">
            <div class="modal-details">
              <p class="modal-time">${project.time}</p>
              <p class="modal-description">${project.description}</p>
              ${project.resources ? `
                <div class="modal-resources">
                  <h4>Resources:</h4>
                  ${project.resources.github ? `<a href="${project.resources.github}" target="_blank" class="resource-link"><i class="fab fa-github"></i> View Code</a>` : ''}
                  ${project.resources.website ? `<a href="${project.resources.website}" target="_blank" class="resource-link"><i class="fas fa-external-link-alt"></i> Visit Website</a>` : ''}
                  ${project.resources.cad ? `<a href="${project.resources.cad}" target="_blank" class="resource-link"><i class="fas fa-cube"></i> View CAD</a>` : ''}
                </div>
              ` : ''}
              ${project.tags ? `
                <div class="modal-tags">
                  ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add click outside to close
    setTimeout(() => {
      const modal = document.getElementById('project-modal');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }, 100);
  }

  initializeCardAnimations() {
    // Intersection Observer for card entrance animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      document.querySelectorAll('.project-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
      });
    }
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }

  updateURL(filter) {
    const url = new URL(window.location);
    if (filter === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', filter);
    }
    window.history.replaceState({}, '', url);
  }

  showError() {
    const container = document.getElementById('projects-grid');
    if (container) {
      container.innerHTML = `
        <div class="projects-error">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Unable to load projects</h3>
          <p>Please check your connection and try again.</p>
        </div>
      `;
    }
  }
}

// Add modal styles
const modalStyles = `
<style>
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
}

.modal-time {
  color: #2563eb;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.modal-description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 24px;
}

.modal-resources h4 {
  margin-bottom: 12px;
  font-weight: 600;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  margin-right: 12px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.resource-link:hover {
  background: #2563eb;
  color: white;
}

.modal-tags {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.projects-error {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.projects-error i {
  font-size: 4rem;
  color: #f59e0b;
  margin-bottom: 16px;
}
</style>
`;

// Function to initialize projects (can be called from tab switching)
function initializeProjects() {
  // Add modal styles to head if not already added
  if (!document.getElementById('project-modal-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'project-modal-styles';
    styleEl.innerHTML = modalStyles;
    document.head.appendChild(styleEl);
  }
  
  // Initialize modern project manager
  window.modernProjectManager = new ModernProjectManager();
  console.log('Projects initialized successfully');
  
  // Handle URL parameters for direct linking
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam && filterParam !== 'all') {
    setTimeout(() => {
      const filterBtn = document.querySelector(`[data-filter="${filterParam}"]`);
      if (filterBtn) {
        filterBtn.click();
      }
    }, 1000);
  }
}

// Initialize when DOM is ready (for direct page loads)
document.addEventListener('DOMContentLoaded', () => {
  initializeProjects();
});

} // End of class definition

// Make function available globally for tab switching
window.initializeProjects = initializeProjects;