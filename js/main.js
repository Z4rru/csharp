/**
 * C# OOP Learning Platform - Main Application
 * Core functionality and initialization
 */

// Inline Utils for App (fallback if utils.js not loaded)
const AppUtils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    scrollToElement(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },
    animateCounter(element, target, duration = 2000) {
        const increment = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        updateCounter();
    },
    storage: {
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); return true; }
            catch (e) { return false; }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) { return defaultValue; }
        }
    },
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 80px; right: 20px; padding: 12px 20px;
            background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999; transform: translateX(120%); transition: transform 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Helper to get utils
const getUtils = () => typeof Utils !== 'undefined' ? Utils : AppUtils;

const App = {
    // Application state
    state: {
        theme: 'light',
        currentSection: 'home',
        progress: {
            interfaces: 0,
            inheritance: 0,
            polymorphism: 0,
            classes: 0,
            methods: 0
        },
        achievements: [],
        quizScores: {}
    },

    /**
     * Initialize the application
     */
    init() {
        this.loadState();
        this.hideLoadingScreen();
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupCounters();
        this.updateProgress();
        this.trackFirstVisit();
        
        console.log('🚀 C# OOP Learning Platform initialized');
    },

    /**
     * Load saved state from local storage
     */
        loadState() {
        const savedState = getUtils().storage.get('appState');
        if (savedState) {
            this.state = { ...this.state, ...savedState };
        }
    },

    /**
     * Save state to local storage
     */
        saveState() {
        getUtils().storage.set('appState', this.state);
    },

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = '';
            }, 800);
        }
    },

    /**
     * Setup theme (dark/light mode)
     */
    setupTheme() {
        const savedTheme = getUtils().storage.get('theme', 'light');
        this.setTheme(savedTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }

        // Check system preference
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (!getUtils().storage.get('theme') && mediaQuery.matches) {
                this.setTheme('dark');
            }
        }
    },

    /**
     * Set theme
     */
    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        getUtils().storage.set('theme', theme);
    },

    /**
     * Setup navigation
     */
    setupNavigation() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
            });
        }

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    getUtils().scrollToElement(href, 80);
                    
                    // Close mobile menu if open
                    if (navLinks) {
                        navLinks.classList.remove('active');
                        if (mobileToggle) {
                            mobileToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                    
                    // Update active state
                    this.updateActiveNavLink(href);
                }
            });
        });

        // Card navigation buttons
        document.querySelectorAll('.card-action[data-navigate]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-navigate');
                getUtils().scrollToElement(`#${target}`, 80);
                this.trackProgress(target, 10);
            });
        });

        // Hero buttons
        const beginBtn = document.getElementById('begin-journey-btn');
        if (beginBtn) {
            beginBtn.addEventListener('click', () => {
                getUtils().scrollToElement('#learning-path', 80);
            });
        }

        const startBtn = document.getElementById('start-learning-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                getUtils().scrollToElement('#interfaces', 80);
            });
        }
    },

    /**
     * Update active navigation link
     */
    updateActiveNavLink(href) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    },

    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        const header = document.querySelector('.header');
        
        // Header scroll effect
        window.addEventListener('scroll', getUtils().throttle(() => {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            // Update active section based on scroll position
            this.updateActiveSectionOnScroll();
        }, 100));
    },

    /**
     * Update active section based on scroll position
     */
    updateActiveSectionOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(`#${sectionId}`);
            }
        });
    },

    /**
     * Setup animations (Intersection Observer)
     */
    setupAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Track section views
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        this.trackSectionView(sectionId);
                    }
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .learning-card, .concept-explainer, .interactive-example').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    },

    /**
     * Setup counter animations
     */
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    getUtils().animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    },

    /**
     * Track section view for progress
     */
    trackSectionView(sectionId) {
        const validSections = ['interfaces', 'inheritance', 'polymorphism', 'classes', 'methods'];
        if (validSections.includes(sectionId)) {
            this.trackProgress(sectionId, 5);
        }
    },

    /**
     * Track progress for a topic
     */
    trackProgress(topic, amount) {
        if (this.state.progress[topic] !== undefined) {
            this.state.progress[topic] = Math.min(100, this.state.progress[topic] + amount);
            this.saveState();
            this.updateProgress();
        }
    },

    /**
     * Update progress display
     */
    updateProgress() {
        // Update topic progress bars
        Object.entries(this.state.progress).forEach(([topic, value]) => {
            const progressItem = document.querySelector(`.topic-progress-item .topic-name`);
            // Find the correct progress item
            document.querySelectorAll('.topic-progress-item').forEach(item => {
                const name = item.querySelector('.topic-name');
                if (name && name.textContent.toLowerCase().includes(topic)) {
                    const fill = item.querySelector('.topic-fill');
                    const percentage = item.querySelector('.topic-percentage');
                    if (fill) fill.style.width = `${value}%`;
                    if (percentage) percentage.textContent = `${value}%`;
                }
            });
        });

        // Calculate overall progress
        const values = Object.values(this.state.progress);
        const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        
        // Update progress ring
        const percentageEl = document.getElementById('overall-percentage');
        if (percentageEl) {
            percentageEl.textContent = overall;
        }

        // Update progress ring fill
        const progressFill = document.querySelector('.progress-ring-fill');
        if (progressFill) {
            const circumference = 2 * Math.PI * 90;
            const offset = circumference - (overall / 100) * circumference;
            progressFill.style.strokeDashoffset = offset;
        }

        // Check for achievements
        this.checkAchievements();
    },

    /**
     * Check and unlock achievements
     */
    checkAchievements() {
        const achievements = {
            'first-steps': () => Object.values(this.state.progress).some(v => v > 0),
            'code-runner': () => getUtils().storage.get('hasRunCode', false),
            'interface-master': () => this.state.progress.interfaces >= 100,
            'inheritance-hero': () => this.state.progress.inheritance >= 100,
            'oop-champion': () => Object.values(this.state.progress).every(v => v >= 100)
        };

        document.querySelectorAll('.achievement').forEach(el => {
            const title = el.getAttribute('title') || '';
            const achievementKey = el.querySelector('.achievement-name')?.textContent
                .toLowerCase().replace(/\s+/g, '-');
            
            if (achievementKey && achievements[achievementKey] && achievements[achievementKey]()) {
                el.classList.add('unlocked');
                if (!this.state.achievements.includes(achievementKey)) {
                    this.state.achievements.push(achievementKey);
                    this.saveState();
                    getUtils().showToast(`🏆 Achievement Unlocked: ${el.querySelector('.achievement-name')?.textContent}!`, 'success');
                }
            }
        });
    },

    /**
     * Track first visit
     */
    trackFirstVisit() {
                if (!getUtils().storage.get('hasVisited')) {
            getUtils().storage.set('hasVisited', true);
            getUtils().storage.set('firstVisit', new Date().toISOString());
            
            // Show welcome message after a delay
            setTimeout(() => {
                getUtils().showToast('👋 Welcome! Start your C# learning journey!', 'info', 5000);
            }, 2000);
        }
    },

    /**
     * Mark code as run (for achievements)
     */
        markCodeRun() {
        getUtils().storage.set('hasRunCode', true);
        this.checkAchievements();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
