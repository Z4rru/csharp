/**
 * C# OOP Learning Platform - Main Application
 * Core functionality and initialization
 */

const App = {
    // Application state
    state: {
        theme: 'dark',
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
     * Get utility functions
     */
    getUtils() {
        if (typeof Utils !== 'undefined') {
            return Utils;
        }
        // Fallback utilities
        return {
            debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func(...args), wait);
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
                const update = () => {
                    current += increment;
                    element.textContent = current < target ? Math.floor(current) : target;
                    if (current < target) requestAnimationFrame(update);
                };
                update();
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
                const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
                const toast = document.createElement('div');
                toast.textContent = message;
                toast.style.cssText = `
                    position: fixed; top: 80px; right: 20px; padding: 12px 20px;
                    background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999; transform: translateX(120%); transition: transform 0.3s ease;
                    border-left: 4px solid ${colors[type] || colors.info};
                    font-size: 14px; color: #1e293b;
                `;
                document.body.appendChild(toast);
                requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
                setTimeout(() => {
                    toast.style.transform = 'translateX(120%)';
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            }
        };
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
        const utils = this.getUtils();
        const savedState = utils.storage.get('appState');
        if (savedState) {
            this.state = { ...this.state, ...savedState };
        }
    },

    /**
     * Save state to local storage
     */
    saveState() {
        const utils = this.getUtils();
        utils.storage.set('appState', this.state);
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
        const utils = this.getUtils();
        const savedTheme = utils.storage.get('theme', 'dark');
        this.setTheme(savedTheme);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }

        // Check system preference
        if (window.matchMedia && !utils.storage.get('theme')) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (mediaQuery.matches) {
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
        this.getUtils().storage.set('theme', theme);
    },

    /**
     * Setup navigation
     */
    setupNavigation() {
        const utils = this.getUtils();
        
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
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    utils.scrollToElement(href, 80);
                    
                    // Close mobile menu if open
                    if (navLinks) {
                        navLinks.classList.remove('active');
                    }
                    if (mobileToggle) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                    
                    this.updateActiveNavLink(href);
                }
            });
        });

        // Card navigation buttons
        document.querySelectorAll('.card-action[data-navigate]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-navigate');
                utils.scrollToElement(`#${target}`, 80);
                this.trackProgress(target, 10);
            });
        });

        // Hero buttons
        const beginBtn = document.getElementById('begin-journey-btn');
        if (beginBtn) {
            beginBtn.addEventListener('click', () => {
                utils.scrollToElement('#learning-path', 80);
            });
        }

        const startBtn = document.getElementById('start-learning-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                utils.scrollToElement('#interfaces', 80);
            });
        }

        const testCompilerBtn = document.getElementById('test-compiler-btn');
        if (testCompilerBtn) {
            testCompilerBtn.addEventListener('click', () => {
                utils.showToast('Compiler simulation ready! Try running any code example.', 'success');
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
        const utils = this.getUtils();
        const header = document.querySelector('.header');
        
        const handleScroll = utils.throttle(() => {
            // Header scroll effect
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }

            // Update active section based on scroll position
            this.updateActiveSectionOnScroll();
        }, 100);

        window.addEventListener('scroll', handleScroll);
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
                    entry.target.classList.add('active', 'visible');
                    
                    // Track section views
                    const sectionId = entry.target.id;
                    if (sectionId) {
                        this.trackSectionView(sectionId);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToObserve = document.querySelectorAll(
            '.learning-card, .concept-explainer, .interactive-example, .resource-card'
        );
        
        elementsToObserve.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });

        // Also observe sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    },

    /**
     * Setup counter animations
     */
    setupCounters() {
        const utils = this.getUtils();
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'), 10);
                    utils.animateCounter(entry.target, target);
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
        
        // Update overall percentage display
        const percentageEl = document.getElementById('overall-percentage');
        if (percentageEl) {
            percentageEl.textContent = overall;
        }

        // Update progress ring
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
        const utils = this.getUtils();
        
        const achievementChecks = {
            'first-steps': () => Object.values(this.state.progress).some(v => v > 0),
            'code-runner': () => utils.storage.get('hasRunCode', false),
            'interface-master': () => this.state.progress.interfaces >= 100,
            'inheritance-hero': () => this.state.progress.inheritance >= 100,
            'oop-champion': () => Object.values(this.state.progress).every(v => v >= 100)
        };

        document.querySelectorAll('.achievement').forEach((el, index) => {
            const achievementKeys = Object.keys(achievementChecks);
            const key = achievementKeys[index];
            
            if (key && achievementChecks[key] && achievementChecks[key]()) {
                el.classList.add('unlocked');
                
                if (!this.state.achievements.includes(key)) {
                    this.state.achievements.push(key);
                    this.saveState();
                    
                    const name = el.querySelector('.achievement-name');
                    if (name) {
                        utils.showToast(`🏆 Achievement Unlocked: ${name.textContent}!`, 'success');
                    }
                }
            }
        });
    },

    /**
     * Track first visit
     */
    trackFirstVisit() {
        const utils = this.getUtils();
        
        if (!utils.storage.get('hasVisited')) {
            utils.storage.set('hasVisited', true);
            utils.storage.set('firstVisit', new Date().toISOString());
            
            setTimeout(() => {
                utils.showToast('👋 Welcome! Start your C# learning journey!', 'info', 5000);
            }, 2000);
        }
    },

    /**
     * Mark code as run (for achievements)
     */
    markCodeRun() {
        const utils = this.getUtils();
        utils.storage.set('hasRunCode', true);
        this.checkAchievements();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if not already handled by inline bridge script
    if (!window.PlatformBridge) {
        App.init();
    } else {
        console.log('App.js loaded - platform bridge detected, skipping duplicate init');
    }
});

// Make globally available
window.App = App;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
