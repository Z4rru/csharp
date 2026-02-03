/**
 * C# OOP Learning Platform - Polymorphism Module
 * Handles polymorphism-specific functionality
 */

const PolymorphismModule = {
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
        const runBtn = document.getElementById('run-polymorphism');
        const resetBtn = document.getElementById('reset-polymorphism');
        
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
                <div class="output-line">=== Regular Bank Account ===</div>
                <div class="output-line">Withdrew $100</div>
                <div class="output-line">New balance: $400</div>
                <div class="output-line"></div>
                <div class="output-line">=== Checking Account (with fees) ===</div>
                <div class="output-line">Withdrew $100 + $2.50 fee</div>
                <div class="output-line">Total deducted: $102.50</div>
                <div class="output-line">New balance: $397.50</div>
                <div class="output-line"></div>
                <div class="output-line">💡 Same method name 'Withdraw'</div>
                <div class="output-line">   Different behavior based on account type!</div>
            `;
            
            // Track progress
            if (typeof App !== 'undefined') {
                App.trackProgress('polymorphism', 10);
                App.markCodeRun();
            }
        }, 500);
    },

    /**
     * Reset polymorphism example
     */
    resetPolymorphismExample() {
        const editor = document.getElementById('code-editor-polymorphism');
        const output = document.getElementById('output-polymorphism');
        
        if (editor && CodeEditor.originalCode['code-editor-polymorphism']) {
            editor.value = CodeEditor.originalCode['code-editor-polymorphism'];
        }
        
        if (output) {
            output.innerHTML = '<span class="output-placeholder">Click "Run Code" to see the output...</span>';
        }
        
                // Show toast notification
        const toast = document.createElement('div');
        toast.textContent = 'Code reset to original';
        toast.style.cssText = `
            position: fixed; top: 80px; right: 20px; padding: 12px 20px;
            background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999; border-left: 4px solid #3b82f6;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    /**
     * Show type details when card is clicked
     */
    showTypeDetails(card) {
        const isOverriding = card.querySelector('h4').textContent.includes('Overriding');
        
        // Add highlight effect
        card.style.transform = 'scale(1.02)';
        card.style.borderColor = 'var(--color-primary)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.borderColor = '';
        }, 300);
        
        // Could show a modal with more details here
    },

    /**
     * Create interactive visualization
     */
    createVisualization() {
        const container = document.createElement('div');
        container.className = 'polymorphism-visualization';
        
        // This could be expanded to show animated examples
        // of polymorphism in action
        
        return container;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PolymorphismModule.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PolymorphismModule;
}
