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
     * Initialize the interfaces module
     */
    init() {
        this.setupQuiz();
        this.setupTabSwitching();
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
                this.handleQuizAnswer(e.target);
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
        const questionNum = questionEl.getAttribute('data-question');
        const isCorrect = optionEl.getAttribute('data-answer') === 'correct';
        
        // Remove previous selections
        questionEl.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
            opt.disabled = true;
        });

        // Mark current selection
        optionEl.classList.add('selected');
        optionEl.classList.add(isCorrect ? 'correct' : 'incorrect');

        // If wrong, show correct answer
        if (!isCorrect) {
            questionEl.querySelector('[data-answer="correct"]').classList.add('correct');
        }

        // Show feedback
        const feedback = questionEl.querySelector('.quiz-feedback');
        if (feedback) {
            feedback.classList.add('show');
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
        if (typeof App !== 'undefined') {
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

        // Update progress
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
            if (num === this.quizState.totalQuestions) {
                nextBtn.textContent = 'Finish';
            } else {
                nextBtn.textContent = 'Next →';
            }
        }
    },

    /**
     * Show quiz results
     */
    showQuizResults() {
        const quizContainer = document.getElementById('interface-quiz');
        if (!quizContainer) return;

        const percentage = Math.round((this.quizState.score / this.quizState.totalQuestions) * 100);
        
        let message = '';
        let emoji = '';
        
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
                try {
            const quizScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
            quizScores.interfaces = Math.max(quizScores.interfaces || 0, percentage);
            localStorage.setItem('quizScores', JSON.stringify(quizScores));
        } catch (e) {
            console.warn('Could not save quiz score:', e);
        }
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
                    
                    // Here you could switch editor content based on file
                    const file = tab.getAttribute('data-file');
                    // Implementation for switching files would go here
                });
            });
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    InterfacesModule.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InterfacesModule;
}
