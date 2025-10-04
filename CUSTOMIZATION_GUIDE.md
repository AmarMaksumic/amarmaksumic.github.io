# Portfolio Customization Guide 🎨

This guide explains how to customize your portfolio website's visual elements, colors, backgrounds, and modal styling. All styling uses a modern design system with CSS custom properties for consistent theming.

## 🎯 Quick Reference

### Main Style Files
- **`css/projects-clean.css`** - Project page styling, modal styling, backgrounds (with CSS custom properties)
- **`css/modern.css`** - Site-wide design system, navbar, animations  
- **`css/home-modern.css`** - Home page specific styling
- **`css/navbar-modern.css`** - Navbar specific styling

### Color System
The site now uses a modern design system with CSS custom properties defined in both `modern.css` and `projects-clean.css`:

**Primary Colors:**
- `--modal-primary: #2563eb` (Primary Blue)
- `--modal-primary-light: #3b82f6` (Light Blue)  
- `--modal-orange: #f97316` (Primary Orange)
- `--modal-orange-light: #fb923c` (Lighter Orange)

**Semantic Colors:**
- `--modal-success: #22c55e` / `--modal-success-light: #4ade80`
- `--modal-warning: #eab308` / `--modal-warning-light: #facc15`  
- `--modal-error: #ef4444` / `--modal-error-light: #f87171`

**Neutral Scale:**
- `--modal-neutral-50` through `--modal-neutral-900` (Light to Dark)

## 🎨 Customizing Modal Colors & Backgrounds

### Changing the Color System Variables
**Quick Theme Changes** - Edit these CSS custom properties in `projects-clean.css` (around line 5):

```css
:root {
  /* Change primary theme colors here */
  --modal-primary: #2563eb;        /* Main brand color */
  --modal-primary-light: #3b82f6;  /* Lighter variant */
  --modal-orange: #f97316;         /* Accent color */
  --modal-orange-light: #fb923c;   /* Lighter accent */
  
  /* Semantic colors for different sections */
  --modal-success: #22c55e;        /* Success/Impact sections */
  --modal-warning: #eab308;        /* Challenges sections */  
  --modal-error: #ef4444;          /* Close button, errors */
}
```

### Modal Container & Backdrop
```css
/* Modal backdrop blur effect */
.modal-backdrop {
  background: rgba(17, 24, 39, 0.85); /* ← CHANGE: Try 0.9 for darker */
  backdrop-filter: blur(8px);          /* ← CHANGE: Try blur(12px) for more blur */
}

/* Main modal background */
.modal-content {
  background: linear-gradient(135deg, var(--modal-neutral-50) 0%, white 100%);
  /* ← CHANGE: Try solid white, or var(--modal-neutral-100) for light gray */
}
```

### Section-Specific Backgrounds
Each section uses light gradients with semantic colors:

```css
/* Project Overview - Blue theme */
.modal-overview {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, var(--modal-neutral-50) 100%);
  border-left: 4px solid var(--modal-primary-light);
}

/* Technical Details - Orange theme */  
.modal-tech-details {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.04) 0%, var(--modal-neutral-50) 100%);
  border-left: 4px solid var(--modal-orange-light);
}

/* Impact & Results - Green theme */
.modal-impact {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, var(--modal-neutral-50) 100%);
  border-left: 4px solid var(--modal-success-light);
}

/* Challenges - Yellow theme */
.modal-challenges {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.04) 0%, var(--modal-neutral-50) 100%);
  border-left: 4px solid var(--modal-warning-light);
}
```

### Tag & Button Styling
```css
/* Technology tags - Uses primary colors */
.modal-tech-tag {
  background: linear-gradient(135deg, var(--modal-primary) 0%, var(--modal-primary-light) 100%);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

/* Skills tags - Uses orange colors */
.modal-skill-tag {
  background: linear-gradient(135deg, var(--modal-orange) 0%, var(--modal-orange-light) 100%);
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
}

/* Modal buttons */
.modal-link {
  background: linear-gradient(135deg, var(--modal-primary) 0%, var(--modal-primary-light) 100%);
}
.modal-link.demo {
  background: linear-gradient(135deg, var(--modal-orange) 0%, var(--modal-orange-light) 100%);
}
```

## 🌊 Page Background Customization

### Wave Animation Colors
```css
/* Wave 1 - Background wave (line ~45 in projects-clean.css) */
.wave-bg::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ← EDIT: Change wave colors here */
}

/* Wave 2 - Foreground wave */
.wave-bg::after {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ← EDIT: Change second wave colors here */
}
```

### Solid Page Backgrounds
If you want solid colors instead of waves, add this to `projects-clean.css`:

```css
/* Add solid background to entire page */
body {
  background: #f5f7fa; /* ← Light gray background */
  /* OR try: #1a1a1a for dark theme */
  /* OR try: linear-gradient(135deg, #667eea 0%, #764ba2 100%) for gradient */
}

/* Hide waves if using solid background */
.wave-bg::before,
.wave-bg::after {
  display: none;
}
```

## 🎭 Project Card Styling

### Card Colors & Effects
```css
/* Project card background */
.project-card {
  background: rgba(255, 255, 255, 0.95); /* ← EDIT: Change transparency */
  /* Try: rgba(248, 249, 250, 0.95) for light gray */
  /* Try: rgba(26, 26, 26, 0.95) for dark theme */
}

/* Card hover effect */
.project-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  /* ← EDIT: Change hover shadow color/intensity */
}
```

### Tag Colors
```css
.tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ← EDIT: Change project tag colors */
}
```

## 🧭 Navbar Customization

### Navbar Background & Colors
```css
/* Navbar background (in modern.css) */
.nav-modern {
  background: rgba(255, 255, 255, 0.95);
  /* ← EDIT: Try rgba(26, 26, 26, 0.95) for dark navbar */
}

/* Navbar when scrolled */
.nav-modern.scrolled {
  background: rgba(255, 255, 255, 0.98);
  /* ← EDIT: Change scrolled navbar transparency */
}

/* Navbar button colors */
.nav-btn {
  color: #2c3e50;
  /* ← EDIT: Change button text color */
}

.nav-btn:hover {
  color: #3498db;
  /* ← EDIT: Change button hover color */
}
```

## 🎨 Color Palette Suggestions

### Theme Examples Using CSS Custom Properties

### Ocean Blue Professional Theme
```css
:root {
  --modal-primary: #0ea5e9;        /* Sky blue */
  --modal-primary-light: #38bdf8;  
  --modal-orange: #06b6d4;         /* Cyan accent */
  --modal-orange-light: #22d3ee;
  --modal-success: #10b981;        
  --modal-warning: #f59e0b;
  --modal-error: #ef4444;
}
```

### Warm Sunset Theme  
```css
:root {
  --modal-primary: #f97316;        /* Orange primary */
  --modal-primary-light: #fb923c;
  --modal-orange: #ec4899;         /* Pink accent */
  --modal-orange-light: #f472b6;
  --modal-success: #22c55e;
  --modal-warning: #eab308;
  --modal-error: #dc2626;
}
```

### Purple Gradient Theme
```css
:root {
  --modal-primary: #8b5cf6;        /* Purple */
  --modal-primary-light: #a78bfa;
  --modal-orange: #ec4899;         /* Pink */
  --modal-orange-light: #f472b6;
  --modal-success: #10b981;
  --modal-warning: #f59e0b;
  --modal-error: #ef4444;
}
```

### Dark Mode Theme
```css
:root {
  --modal-primary: #60a5fa;        /* Light blue for dark mode */
  --modal-primary-light: #93c5fd;
  --modal-orange: #fb7185;         /* Light coral */
  --modal-orange-light: #fda4af;
  --modal-neutral-50: #1f2937;     /* Dark backgrounds */
  --modal-neutral-100: #374151;
  --modal-neutral-800: #f3f4f6;    /* Light text */
  --modal-neutral-900: #ffffff;
}

/* Additional dark mode changes */
.modal-content {
  background: linear-gradient(135deg, var(--modal-neutral-50) 0%, #111827 100%);
  color: var(--modal-neutral-900);
}
```

## 🔧 Advanced Customizations

### Adding Custom Animations
```css
/* Custom fade-in animation for cards */
@keyframes customFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.project-card {
  animation: customFadeIn 0.6s ease forwards;
}
```

### Custom Gradient Backgrounds
```css
/* Custom page gradient */
body {
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%, 
    #f093fb 50%, 
    #f5576c 75%, 
    #4facfe 100%
  );
  min-height: 100vh;
}
```

### Responsive Customization
```css
/* Mobile-specific styling */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .project-card {
    background: rgba(255, 255, 255, 0.98); /* More opaque on mobile */
  }
}
```

## 🚀 Implementation Tips

### 1. Test Changes Incrementally
- Make one change at a time
- Refresh the page to see effects
- Use browser DevTools to test colors before editing files

### 2. Backup Before Major Changes
- Copy your CSS files before making significant changes
- Git commit your changes regularly

### 3. Color Tools
- Use [Coolors.co](https://coolors.co) for color palette generation
- Use [UI Gradients](https://uigradients.com) for gradient inspiration
- Use browser DevTools color picker for precision

### 4. Cache Busting
The site uses timestamp-based cache busting, so changes should appear immediately. If not:
- Hard refresh with `Ctrl+F5`
- Clear browser cache
- Check browser console for errors

## 📍 File Locations Quick Reference

```
css/
├── projects-clean.css    ← Modal styling, project cards, waves
├── modern.css           ← Site-wide styling, navbar
├── home-modern.css      ← Home page specific
└── navbar-modern.css    ← Navbar specific

js/
└── projects-clean.js    ← Modal functionality (NO STYLING HERE!)
```

## 🎯 Common Customization Scenarios

### "I want a dark theme"
1. Edit `.modal-content` background to `#1a1a1a`
2. Change all section text colors to `#ffffff`
3. Update section backgrounds to dark variants (`#2a2a2a`)
4. Adjust tag gradients to lighter colors

### "I want different wave colors"
1. Find `.wave-bg::before` and `.wave-bg::after` in `projects-clean.css`
2. Change the `background: linear-gradient(...)` values
3. Consider complementary colors for harmony

### "I want to remove animations"
1. Set `animation: none;` on `.modal-content`
2. Remove `transform` properties from hover effects
3. Set `transition: none;` to disable transitions

### "I want bigger/smaller modals"
1. Adjust `.modal-content` `max-width` (currently `900px`)
2. Modify `width` percentage (currently `90%`)
3. Adjust `max-height` for vertical sizing (currently `90vh`)

---

**Remember**: All styling should be in CSS files only. The JavaScript files handle functionality and should not contain any `style=` attributes or CSS rules!