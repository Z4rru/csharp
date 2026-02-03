/**
 * C# OOP Learning Platform - Inheritance Module
 * Handles inheritance-specific functionality
 */

const InheritanceModule = {
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
        box.style.transform = 'scale(1.02)';
        box.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
        box.style.transition = 'all 0.2s ease';
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
        // Run button for inheritance example
        const runBtn = document.getElementById('run-inheritance') || 
                       document.querySelector('[data-editor="editor-inheritance"].run-btn');
        const resetBtn = document.getElementById('reset-inheritance') ||
                         document.querySelector('[data-editor="editor-inheritance"].reset-btn');
        
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
                <div class="output-line">=== Creating a Student ===</div>
                <div class="output-line"></div>
                <div class="output-line">Name: Alice Johnson</div>
                <div class="output-line">Age: 20</div>
                <div class="output-line">Student ID: 2024001</div>
                <div class="output-line">Program: Computer Science</div>
                <div class="output-line"></div>
                <div class="output-line">Alice Johnson is walking...</div>
                <div class="output-line">Alice Johnson is studying Computer Science...</div>
            `;
            
            // Track progress
            if (typeof App !== 'undefined') {
                if (App.trackProgress) App.trackProgress('inheritance', 10);
                if (App.markCodeRun) App.markCodeRun();
            }
        }, 500);
    },

    /**
     * Reset inheritance example
     */
    resetInheritanceExample() {
        const editor = document.getElementById('editor-inheritance');
        const output = document.getElementById('output-inheritance');
        
        if (editor && typeof CodeEditor !== 'undefined' && CodeEditor.originalCode['editor-inheritance']) {
            editor.value = CodeEditor.originalCode['editor-inheritance'];
            CodeEditor.updateLineNumbers(editor);
        }
        
        if (output) {
            output.innerHTML = '<span class="output-placeholder">Click "Run Code" to see the output...</span>';
        }
        
        this.getUtils().showToast('Code reset to original', 'info');
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

// Make globally available
window.InheritanceModule = InheritanceModule;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InheritanceModule;
}
