/**
 * C# OOP Learning Platform - Inheritance Module
 * Handles inheritance-specific functionality
 */

const InheritanceModule = {
    /**
     * Initialize the inheritance module
     */
    init() {
        this.setupDiagramInteractions();
        this.setupCodeExamples();
    },

    /**
     * Setup UML diagram interactions
     */
    setupDiagramInteractions() {
        const umlBoxes = document.querySelectorAll('.uml-box');
        
        umlBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                this.highlightRelatedCode(box);
            });
            
            box.addEventListener('mouseleave', () => {
                this.removeCodeHighlights();
            });
        });
    },

    /**
     * Highlight related code when hovering on diagram
     */
    highlightRelatedCode(box) {
        const isParent = box.classList.contains('parent');
        const isChild = box.classList.contains('child');
        
        // Add visual feedback
        box.style.transform = 'scale(1.02)';
        box.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
    },

    /**
     * Remove code highlights
     */
    removeCodeHighlights() {
        document.querySelectorAll('.uml-box').forEach(box => {
            box.style.transform = '';
            box.style.boxShadow = '';
        });
    },

    /**
     * Setup code examples
     */
    setupCodeExamples() {
        // Handle inheritance example run
        const runBtn = document.getElementById('run-inheritance');
        const resetBtn = document.getElementById('reset-inheritance');
        
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runInheritanceExample();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetInheritanceExample();
            });
        }
    },

    /**
     * Run inheritance example
     */
    runInheritanceExample() {
        const output = document.getElementById('output-inheritance');
        if (!output) return;

        output.innerHTML = '<span class="output-loading">⏳ Compiling and running...</span>';

        setTimeout(() => {
            output.innerHTML = `
                <div class="output-line">=== Student Information ===</div>
                <div class="output-line"></div>
                <div class="output-line">Name: Jack Paul</div>
                <div class="output-line">Age: 18</div>
                <div class="output-line">Student ID: 20191001</div>
                <div class="output-line">Program: BSCS</div>
                <div class="output-line"></div>
                <div class="output-line">Jack Paul is walking...</div>
                <div class="output-line">Jack Paul is studying BSCS...</div>
            `;
            
            // Track progress
            if (typeof App !== 'undefined') {
                App.trackProgress('inheritance', 10);
                App.markCodeRun();
            }
        }, 500);
    },

    /**
     * Reset inheritance example
     */
    resetInheritanceExample() {
        const editor = document.getElementById('code-editor-inheritance');
        const output = document.getElementById('output-inheritance');
        
        if (editor && CodeEditor.originalCode['code-editor-inheritance']) {
            editor.value = CodeEditor.originalCode['code-editor-inheritance'];
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
     * Animate inheritance arrows
     */
    animateArrows() {
        const arrows = document.querySelectorAll('.arrow-line');
        arrows.forEach((arrow, index) => {
            arrow.style.animation = `arrowPulse 1.5s ease-in-out ${index * 0.2}s infinite`;
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    InheritanceModule.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InheritanceModule;
}
