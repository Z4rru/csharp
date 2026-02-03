/**
 * C# OOP Learning Platform - Interfaces Module
 * Handles interface-specific functionality and quiz
 */

const InterfacesModule = {
    // Quiz state
    quizState: {
        currentQuestion: 1,
        totalQuestions: 3,
        answers: {},
        score: 0
    },

    /**
     * Get utility functions
     */
    getUtils() {
        return typeof Utils !== 'undefined' ? Utils : {
            showToast(msg, type) {
                console.log(`[${type}] ${msg}`);
            },
            storage: {
                get(key, def) { 
                    try { return JSON.parse(localStorage.getItem(key)) || def; } 
                    catch(e) { return def; }
                },
                set(key, val) { 
                    try { localStorage.setItem(key, JSON.stringify(val)); } 
                    catch(e) {}
                }
            }
        };
    },

    /**
     * Initialize the interfaces module
     */
    init() {
        this.setupQuiz();
        this.setupTabSwitching();
        this.setupCodeExamples();
    },

    /**
     * Setup code examples
     */
    setupCodeExamples() {
        // Run buttons for interface examples
        document.querySelectorAll('[data-editor^="editor-"]').forEach(btn => {
            if (btn.classList.contains('run-btn')) {
                btn.addEventListener('click', () => {
                    const editorId = btn.dataset.editor;
                    if (editorId && typeof CodeEditor !== 'undefined') {
                        CodeEditor.runCode(editorId.replace('editor-', ''));
                    }
                });
            }
        });
    },

    /**
     * Setup quiz functionality
     */
    setupQuiz() {
        const quizContainer = document.getElementById('interface-quiz');
        if (!quizContainer) return;

        // Setup quiz option clicks
        quizContainer.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!option.disabled) {
                    this.handleQuizAnswer(e.target);
                }
            });
        });

        // Setup navigation buttons
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPreviousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToNextQuestion());
        }
    },

    /**
     * Handle quiz answer selection
     */
    handleQuizAnswer(optionEl) {
        const questionEl = optionEl.closest('.quiz-question');
        if (!questionEl) return;

        const questionNum = questionEl.getAttribute('data-question');
        const isCorrect = optionEl.getAttribute('data-answer') === 'correct';
        
        // Disable all options in this question
        questionEl.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.disabled = true;
        });

        // Mark current selection
        optionEl.classList.add('selected');
        optionEl.classList.add(isCorrect ? 'correct' : 'incorrect');

        // If wrong, show correct answer
        if (!isCorrect) {
            const correctOption = questionEl.querySelector('[data-answer="correct"]');
            if (correctOption) {
                correctOption.classList.add('correct');
            }
        }

        // Show feedback
        const feedback = questionEl.querySelector('.quiz-feedback');
        if (feedback) {
            feedback.classList.add('show');
            feedback.classList.remove('correct', 'incorrect');
            feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            feedback.textContent = isCorrect 
                ? '✓ Correct! Great job!' 
                : '✗ Not quite. The correct answer is highlighted.';
        }

        // Store answer
        this.quizState.answers[questionNum] = isCorrect;
        if (isCorrect) {
            this.quizState.score++;
        }

        // Track progress
        if (typeof App !== 'undefined' && App.trackProgress) {
            App.trackProgress('interfaces', isCorrect ? 15 : 5);
        }

        // Auto advance after delay
        setTimeout(() => {
            if (this.quizState.currentQuestion < this.quizState.totalQuestions) {
                this.goToNextQuestion();
            } else {
                this.showQuizResults();
            }
        }, 1500);
    },

    /**
     * Go to previous question
     */
    goToPreviousQuestion() {
        if (this.quizState.currentQuestion > 1) {
            this.showQuestion(this.quizState.currentQuestion - 1);
        }
    },

    /**
     * Go to next question
     */
    goToNextQuestion() {
        if (this.quizState.currentQuestion < this.quizState.totalQuestions) {
            this.showQuestion(this.quizState.currentQuestion + 1);
        } else {
            this.showQuizResults();
        }
    },

    /**
     * Show specific question
     */
    showQuestion(num) {
        this.quizState.currentQuestion = num;

        // Update question visibility
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.classList.remove('active');
            if (q.getAttribute('data-question') === String(num)) {
                q.classList.add('active');
            }
        });

        // Update progress display
        const currentQ = document.getElementById('current-q');
        const progressFill = document.querySelector('.quiz-progress .progress-fill');
        
        if (currentQ) {
            currentQ.textContent = num;
        }
        
        if (progressFill) {
            const percentage = (num / this.quizState.totalQuestions) * 100;
            progressFill.style.width = `${percentage}%`;
        }

        // Update button states
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn) {
            prevBtn.disabled = num === 1;
        }
        
        if (nextBtn) {
            nextBtn.textContent = num === this.quizState.totalQuestions ? 'Finish' : 'Next →';
        }
    },

    /**
     * Show quiz results
     */
    showQuizResults() {
        const quizContainer = document.getElementById('interface-quiz');
        if (!quizContainer) return;

        const percentage = Math.round((this.quizState.score / this.quizState.totalQuestions) * 100);
        
        let message, emoji;
        
        if (percentage === 100) {
            message = 'Perfect score! You\'ve mastered interfaces!';
            emoji = '🏆';
        } else if (percentage >= 66) {
            message = 'Great job! You understand interfaces well!';
            emoji = '🎉';
        } else {
            message = 'Keep practicing! Review the material and try again.';
            emoji = '📚';
        }

        quizContainer.innerHTML = `
            <div class="quiz-results">
                <div class="results-emoji">${emoji}</div>
                <h3>Quiz Complete!</h3>
                <p class="results-score">You scored ${this.quizState.score} out of ${this.quizState.totalQuestions}</p>
                <p class="results-percentage">${percentage}%</p>
                <p class="results-message">${message}</p>
                <button class="btn btn-primary" onclick="InterfacesModule.resetQuiz()">
                    Try Again
                </button>
            </div>
        `;

        // Save quiz score
        const utils = this.getUtils();
        const quizScores = utils.storage.get('quizScores', {});
        quizScores.interfaces = Math.max(quizScores.interfaces || 0, percentage);
        utils.storage.set('quizScores', quizScores);
        
        utils.showToast(`Quiz completed! Score: ${percentage}%`, percentage >= 66 ? 'success' : 'info');
    },

    /**
     * Reset quiz
     */
    resetQuiz() {
        this.quizState = {
            currentQuestion: 1,
            totalQuestions: 3,
            answers: {},
            score: 0
        };
        
        // Reload page to reset quiz
        location.reload();
    },

    /**
     * Setup tab switching for code examples
     */
    setupTabSwitching() {
        document.querySelectorAll('.editor-tabs').forEach(tabContainer => {
            tabContainer.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active from all tabs
                    tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    // Add active to clicked tab
                    tab.classList.add('active');
                    
                    const file = tab.getAttribute('data-file');
                    console.log(`Switched to file: ${file}`);
                });
            });
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    InterfacesModule.init();
});

// Make globally available
window.InterfacesModule = InterfacesModule;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InterfacesModule;
}
