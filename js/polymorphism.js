/**
 * C# OOP Learning Platform - Polymorphism Module
 * Handles polymorphism-specific functionality
 */

const PolymorphismModule = {
    /**
     * Get utility functions
     */
    getUtils() {
        return typeof Utils !== 'undefined' ? Utils : {
            showToast(msg, type) {
                const toast = document.createElement('div');
                toast.textContent = msg;
                toast.style.cssText = `
                    position: fixed; top: 80px; right: 20px; padding: 12px 20px;
                    background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999; border-left: 4px solid #3b82f6;
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        };
    },

    /**
     * Initialize the polymorphism module
     */
    init() {
        this.setupCodeExamples();
        this.setupTypeCards();
    },

    /**
     * Setup code examples
     */
    setupCodeExamples() {
        const runBtn = document.getElementById('run-polymorphism') ||
                       document.querySelector('[data-editor="editor-polymorphism"].run-btn');
        const resetBtn = document.getElementById('reset-polymorphism') ||
                         document.querySelector('[data-editor="editor-polymorphism"].reset-btn');
        
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runPolymorphismExample();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetPolymorphismExample();
            });
        }
    },

    /**
     * Setup type cards interactions
     */
    setupTypeCards() {
        const typeCards = document.querySelectorAll('.type-card');
        
        typeCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showTypeDetails(card);
            });

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    },

    /**
     * Run polymorphism example
     */
    runPolymorphismExample() {
        const output = document.getElementById('output-polymorphism');
        if (!output) return;

        output.innerHTML = '<span class="output-loading">⏳ Compiling and running...</span>';

        setTimeout(() => {
            output.innerHTML = `
                <div class="output-line">=== Polymorphism Demo ===</div>
                <div class="output-line"></div>
                <div class="output-line">[Basic] Withdrew $450</div>
                <div class="output-line">New balance: $50.00</div>
                <div class="output-line"></div>
                <div class="output-line">[Checking] Withdrew $450 + $2.50 fee</div>
                <div class="output-line">New balance: $47.50</div>
                <div class="output-line"></div>
                <div class="output-line">[Savings] Cannot withdraw!</div>
                <div class="output-line">Minimum balance of $100 required</div>
                <div class="output-line"></div>
            `;
            
            // Track progress
            if (typeof App !== 'undefined') {
                if (App.trackProgress) App.trackProgress('polymorphism', 10);
                if (App.markCodeRun) App.markCodeRun();
            }
        }, 500);
    },

    /**
     * Reset polymorphism example
     */
    resetPolymorphismExample() {
        const editor = document.getElementById('editor-polymorphism');
        const output = document.getElementById('output-polymorphism');
        
        if (editor && typeof CodeEditor !== 'undefined' && CodeEditor.originalCode['editor-polymorphism']) {
            editor.value = CodeEditor.originalCode['editor-polymorphism'];
            CodeEditor.updateLineNumbers(editor);
        }
        
        if (output) {
            output.innerHTML = '<span class="output-placeholder">Click "Run Code" to see the output...</span>';
        }
        
        this.getUtils().showToast('Code reset to original', 'info');
    },

    /**
     * Show type details when card is clicked
     */
    showTypeDetails(card) {
        // Add highlight effect
        card.style.transform = 'scale(1.02)';
        card.style.borderColor = 'var(--color-primary, #6366f1)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.borderColor = '';
        }, 300);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PolymorphismModule.init();
});

// Make globally available
window.PolymorphismModule = PolymorphismModule;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PolymorphismModule;
}
