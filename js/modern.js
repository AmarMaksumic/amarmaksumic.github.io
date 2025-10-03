// Modern JavaScript for Enhanced Portfolio Functionality

class PortfolioManager {
  constructor() {
    console.log('🏗️ PortfolioManager constructor started');
    this.currentSection = 'home';
    this.isTransitioning = false;
    console.log('📋 Basic properties set, calling init()');
    this.init();
    console.log('✅ PortfolioManager constructor completed');
  }

  init() {
    console.log('🔧 PortfolioManager init() started');
    try {
      console.log('🔧 Setting up event listeners...');
      this.setupEventListeners();
      console.log('🔧 Initializing scroll effects...');
      this.initializeScrollEffects();
      console.log('🔧 Setting up typewriter...');
      this.setupTypewriter();
      console.log('✅ PortfolioManager init() completed');
    } catch (error) {
      console.error('❌ Error in PortfolioManager init():', error);
    }
  }

  setupEventListeners() {
    // Smooth scroll for navigation links
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-scroll]')) {
        e.preventDefault();
        this.smoothScrollTo(e.target.getAttribute('data-scroll'));
      }
    });

    // Enhanced tab switching with better animations
    const portfolioInstance = this;
    window.switchTab = (tabNumber) => {
      console.log('🔄 switchTab called with tab number:', tabNumber);
      if (portfolioInstance.isTransitioning) {
        console.log('⏳ Tab switching already in progress, skipping');
        return;
      }
      portfolioInstance.switchTabEnhanced(tabNumber);
    };

    // Intersection observer for animations
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger counters if they exist
          const counters = entry.target.querySelectorAll('[data-counter]');
          counters.forEach(counter => this.animateCounter(counter));
        }
      });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.section, .card-modern, .timeline-event').forEach(el => {
      observer.observe(el);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  setupTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.getAttribute('data-typewriter');
      const speed = parseInt(element.getAttribute('data-speed')) || 100;
      this.typeWriter(element, text, speed);
    });
  }

  typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
  }

  async switchTabEnhanced(tabNumber) {
    console.log('🚀 switchTabEnhanced called for tab:', tabNumber);
    console.log('🔍 Current isTransitioning state:', this.isTransitioning);
    
    if (this.isTransitioning) {
      console.log('❌ Exiting early - already transitioning');
      return;
    }
    
    console.log('✅ Setting isTransitioning to true');
    this.isTransitioning = true;

    // Update active tab
    console.log('🎯 Updating active tab classes');
    document.querySelectorAll('[id^="tab_"]').forEach(tab => {
      tab.classList.remove('active');
    });
    const targetTab = document.getElementById(`tab_${tabNumber}`);
    console.log('🎯 Target tab element:', targetTab ? 'found' : 'NOT FOUND');
    targetTab?.classList.add('active');

    // Enhanced page transition
    console.log('🔄 Starting pageTransition for tab:', tabNumber);
    try {
      await this.pageTransition(tabNumber);
      console.log('✅ pageTransition completed successfully');
    } catch (error) {
      console.error('❌ pageTransition failed:', error);
    }
    
    console.log('✅ Setting isTransitioning to false');
    this.isTransitioning = false;
  }

  async pageTransition(tabNumber) {
    console.log('🎬 pageTransition started for tab:', tabNumber);
    const pageContent = document.getElementById('cont');
    const stripe = document.getElementById('page_stripe');
    
    console.log('🔍 Elements found:');
    console.log('  - pageContent (#cont):', pageContent ? 'YES' : 'NO');
    console.log('  - stripe (#page_stripe):', stripe ? 'YES' : 'NO');
    
    // Fade out current content
    console.log('🌅 Fading out current content');
    pageContent.style.opacity = '0';
    pageContent.style.transform = 'translateY(20px)';
    
    // Animate stripe across screen
    stripe.style.width = '100%';
    stripe.style.left = '0';
    stripe.style.right = 'auto';
    
    await this.delay(600);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load new content
    console.log('📥 About to call loadPageContent for tab:', tabNumber);
    try {
      await this.loadPageContent(tabNumber);
      console.log('✅ loadPageContent completed successfully');
    } catch (error) {
      console.error('❌ loadPageContent failed:', error);
    }
    
    // Animate stripe out
    stripe.style.left = 'auto';
    stripe.style.right = '0';
    
    await this.delay(300);
    
    stripe.style.width = '0%';
    
    // Fade in new content
    pageContent.style.opacity = '1';
    pageContent.style.transform = 'translateY(0)';
    
    // Reinitialize animations for new content
    this.initializeScrollEffects();
  }

  async loadPageContent(tabNumber) {
    console.log('🔄 loadPageContent called with tabNumber:', tabNumber);
    return new Promise((resolve) => {
      const isMobile = window.matchMedia("(max-width: 1000px)").matches;
      let fileName;
      
      switch(tabNumber) {
        case 1:
          fileName = isMobile ? 'html/m_home.html' : 'html/home.html';
          break;
        case 2:
          fileName = 'html/education.html';
          break;
        case 3:
          fileName = 'html/experience.html';
          break;
        case 4:
          fileName = 'html/projects.html';
          break;
        default:
          fileName = isMobile ? 'html/m_home.html' : 'html/home.html';
      }
      
      console.log('📄 Loading HTML file:', fileName);
      console.log('🔍 jQuery load starting...');
      $('#cont').load(fileName, (response, status, xhr) => {
        console.log('📥 jQuery load callback triggered');
        console.log('📊 Load status:', status);
        console.log('📊 Response length:', response ? response.length : 0);
        console.log('📊 XHR status:', xhr ? xhr.status : 'no xhr');
        
        if (status === 'error') {
          console.error('❌ HTML load failed for:', fileName);
          console.error('❌ Error details:', xhr);
          return;
        }
        
        console.log('✅ HTML loaded successfully for tab:', tabNumber);
        console.log('📋 Content length loaded:', $('#cont').html().length);
        
        // Initialize page-specific functionality after content loads
        console.log('⏰ Setting 50ms timeout for page initialization');
        setTimeout(() => {
          switch(tabNumber) {
            case 2:
              this.loadScriptIfNeeded('js/education.js', () => {
                if (typeof initializeEducation === 'function') {
                  initializeEducation();
                }
              });
              break;
            case 3:
              this.loadScriptIfNeeded('js/experience.js', () => {
                if (typeof initializeExperience === 'function') {
                  initializeExperience();
                }
              });
              break;
            case 4:
              // Load projects script and initialize
              console.log('🚀 Loading projects page...');
              this.loadScriptIfNeeded('js/projects-simple.js', () => {
                console.log('✅ Projects script loaded, initializing...');
                if (typeof initializeProjects === 'function') {
                  console.log('🎯 Calling initializeProjects...');
                  initializeProjects();
                  console.log('✅ Projects page initialized via initializeProjects');
                } else {
                  console.error('❌ initializeProjects function not found');
                }
              });
              break;
          }
        }, 100); // Small delay to ensure DOM is ready
        resolve();
      });
    });
  }

  loadScriptIfNeeded(src, callback) {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      console.log(`Script already loaded: ${src}`);
      if (callback) {
        // Small delay to ensure script is fully executed
        setTimeout(callback, 100);
      }
      return;
    }

    // Load script dynamically
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`Dynamically loaded: ${src}`);
      if (callback) {
        // Small delay to ensure script is fully executed
        setTimeout(callback, 100);
      }
    };
    script.onerror = () => {
      console.error(`Failed to load: ${src}`);
    };
    document.head.appendChild(script);
  }

  initializeScrollEffects() {
    // Parallax effects
    this.setupParallax();
    
    // Scroll-triggered animations
    this.setupScrollAnimations();
  }

  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.getAttribute('data-animation') || 'fadeInUp';
          entry.target.classList.add(animationType);
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}

// Enhanced project filtering and search
class ProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.setupProjectFilters();
    this.setupProjectSearch();
  }

  setupProjectFilters() {
    // Extract unique tags from projects for filtering
    this.loadProjects().then(() => {
      this.renderFilterButtons();
      this.renderProjects();
    });
  }

  async loadProjects() {
    try {
      const response = await fetch('./files/projects.json');
      const data = await response.json();
      this.projects = Object.entries(data).map(([name, details]) => ({
        name,
        ...details
      }));
      this.filteredProjects = [...this.projects];
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  renderFilterButtons() {
    const allTags = [...new Set(this.projects.flatMap(p => p.tags || []))];
    const filterContainer = document.querySelector('.project-filters');
    
    if (!filterContainer) return;

    const filterHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      ${allTags.map(tag => `
        <button class="filter-btn" data-filter="${tag}">${tag}</button>
      `).join('')}
    `;

    filterContainer.innerHTML = filterHTML;

    // Add event listeners
    filterContainer.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        this.filterProjects(e.target.getAttribute('data-filter'));
        
        // Update active state
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });
  }

  filterProjects(filter) {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        (project.tags || []).includes(filter)
      );
    }
    
    this.renderProjects();
  }

  setupProjectSearch() {
    const searchInput = document.querySelector('#project-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      this.searchProjects(searchTerm);
    });
  }

  searchProjects(term) {
    if (!term) {
      this.filterProjects(this.currentFilter);
      return;
    }

    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      (project.tags || []).some(tag => tag.toLowerCase().includes(term))
    );

    this.renderProjects();
  }

  renderProjects() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    container.innerHTML = this.filteredProjects.map(project => `
      <article class="project-card animate-on-scroll" data-animation="fadeInUp">
        <div class="project-image">
          <img src="${project.img}" alt="${project.name}" loading="lazy">
          <div class="project-overlay">
            <div class="project-links">
              ${project.resources?.github ? `<a href="${project.resources.github}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
              ${project.resources?.website ? `<a href="${project.resources.website}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3>${project.name}</h3>
          <p class="project-time">${project.time}</p>
          <p class="project-description">${project.description}</p>
          ${project.tags ? `
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </article>
    `).join('');

    // Reinitialize scroll animations for new content
    window.portfolioManager?.setupScrollAnimations();
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      this.recordLoadMetrics();
    });

    // Monitor navigation timing
    this.monitorNavigation();
  }

  recordLoadMetrics() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      this.metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalPageLoad: navigation.loadEventEnd - navigation.fetchStart
      };

      console.log('Portfolio Performance Metrics:', this.metrics);
    }
  }

  monitorNavigation() {
    // Track tab switching performance
    const originalSwitchTab = window.switchTab;
    window.switchTab = (tabNumber) => {
      const startTime = performance.now();
      originalSwitchTab(tabNumber);
      
      setTimeout(() => {
        const endTime = performance.now();
        console.log(`Tab switch to ${tabNumber} took ${endTime - startTime} milliseconds`);
      }, 0);
    };
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔥 DOMContentLoaded event fired - starting initialization');
  
  try {
    console.log('📝 Creating PortfolioManager...');
    window.portfolioManager = new PortfolioManager();
    console.log('✅ PortfolioManager created successfully');
    
    console.log('📝 Creating ProjectManager...');
    window.projectManager = new ProjectManager();
    console.log('✅ ProjectManager created successfully');
    
    console.log('📝 Creating PerformanceMonitor...');
    window.performanceMonitor = new PerformanceMonitor();
    console.log('✅ PerformanceMonitor created successfully');
    
    console.log('🎉 All managers initialized successfully!');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    console.error('❌ Stack trace:', error.stack);
  }
});

// Export for use in other files (commented out for compatibility)
// export { PortfolioManager, ProjectManager, PerformanceMonitor };