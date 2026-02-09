/**
 * C# OOP Learning Platform - Code Editor Module
 * Handles code editing, syntax highlighting, and execution
 */

const CodeEditor = {
    // Code templates for the playground
    templates: {
        blank: `using System;

public class Program
{
    public static void Main()
    {
        // Write your code here
        
    }
}`,

        hello: `using System;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello, C# World!");
        Console.WriteLine("Welcome to Object-Oriented Programming!");
        
        // Try modifying the message above!
    }
}`,

        interface: `using System;

// Step 1: Define an interface
public interface IGreeter
{
    void SayHello(string name);
    string GetGreeting();
}

// Step 2: Implement the interface
public class FriendlyGreeter : IGreeter
{
    private string greeting = "Hello";
    
    public void SayHello(string name)
    {
        Console.WriteLine($"{greeting}, {name}! Nice to meet you!");
    }
    
    public string GetGreeting()
    {
        return greeting;
    }
}

public class Program
{
    public static void Main()
    {
        IGreeter greeter = new FriendlyGreeter();
        greeter.SayHello("Student");
        Console.WriteLine($"Current greeting: {greeter.GetGreeting()}");
    }
}`,

        inheritance: `using System;

// Base class (Parent)
public class Animal
{
    protected string name;
    
    public Animal(string name)
    {
        this.name = name;
    }
    
    public virtual void Speak()
    {
        Console.WriteLine($"{name} makes a sound.");
    }
}

// Derived class (Child)
public class Dog : Animal
{
    public Dog(string name) : base(name) { }
    
    public override void Speak()
    {
        Console.WriteLine($"{name} says: Woof! Woof!");
    }
    
    public void Fetch()
    {
        Console.WriteLine($"{name} is fetching the ball!");
    }
}

// Another derived class
public class Cat : Animal
{
    public Cat(string name) : base(name) { }
    
    public override void Speak()
    {
        Console.WriteLine($"{name} says: Meow!");
    }
}

public class Program
{
    public static void Main()
    {
        Dog dog = new Dog("Buddy");
        Cat cat = new Cat("Whiskers");
        
        dog.Speak();
        dog.Fetch();
        
        cat.Speak();
    }
}`,

        polymorphism: `using System;

// Base class with virtual method
public class Shape
{
    public virtual double GetArea()
    {
        return 0;
    }
    
    public virtual void Describe()
    {
        Console.WriteLine("I am a shape.");
    }
}

// Derived classes override the virtual methods
public class Circle : Shape
{
    private double radius;
    
    public Circle(double radius)
    {
        this.radius = radius;
    }
    
    public override double GetArea()
    {
        return Math.PI * radius * radius;
    }
    
    public override void Describe()
    {
        Console.WriteLine($"I am a circle with radius {radius}");
    }
}

public class Rectangle : Shape
{
    private double width, height;
    
    public Rectangle(double width, double height)
    {
        this.width = width;
        this.height = height;
    }
    
    public override double GetArea()
    {
        return width * height;
    }
    
    public override void Describe()
    {
        Console.WriteLine($"I am a rectangle ({width} x {height})");
    }
}

public class Program
{
    public static void Main()
    {
        // Polymorphism in action!
        Shape[] shapes = new Shape[]
        {
            new Circle(5),
            new Rectangle(4, 6),
            new Circle(3)
        };
        
        foreach (Shape shape in shapes)
        {
            shape.Describe();
            Console.WriteLine($"Area: {shape.GetArea():F2}\\n");
        }
    }
}`,

        properties: `using System;

public class Person
{
    // Private fields
    private string firstName;
    private string lastName;
    private int age;
    
    // Properties with get and set
    public string FirstName
    {
        get { return firstName; }
        set { firstName = value; }
    }
    
    public string LastName
    {
        get { return lastName; }
        set { lastName = value; }
    }
    
    // Property with validation
    public int Age
    {
        get { return age; }
        set
        {
            if (value >= 0 && value <= 150)
                age = value;
            else
                Console.WriteLine("Invalid age!");
        }
    }
    
    // Read-only property
    public string FullName
    {
        get { return $"{firstName} {lastName}"; }
    }
    
    // Auto-implemented property
    public string Email { get; set; }
    
    public void DisplayInfo()
    {
        Console.WriteLine($"Name: {FullName}");
        Console.WriteLine($"Age: {Age}");
        Console.WriteLine($"Email: {Email}");
    }
}

public class Program
{
    public static void Main()
    {
        Person person = new Person();
        
        // Using properties
        person.FirstName = "John";
        person.LastName = "Doe";
        person.Age = 25;
        person.Email = "john.doe@email.com";
        
        person.DisplayInfo();
        
        // Try setting invalid age
        Console.WriteLine("\\nTrying to set age to 200:");
        person.Age = 200;
    }
}`
    },

    // Original code for reset functionality
    originalCode: {},

    /**
     * Get utility functions (with fallback)
     */
    getUtils() {
        if (typeof Utils !== 'undefined') {
            return Utils;
        }
        // Fallback utilities
        return {
            storage: {
                set(key, value) {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                get(key, defaultValue = null) {
                    try {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : defaultValue;
                    } catch (e) {
                        return defaultValue;
                    }
                }
            },
            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            },
            showToast(message, type = 'info', duration = 3000) {
                const toast = document.createElement('div');
                toast.textContent = message;
                const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
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
     * Initialize the code editor
     */
    init() {
        this.setupEditors();
        this.setupEventListeners();
        this.loadSavedCode();
    },

    /**
     * Setup all code editors on the page
     */
    setupEditors() {
        const editors = document.querySelectorAll('.code-editor');
        editors.forEach(editor => {
            // Store original code
            this.originalCode[editor.id] = editor.value;
            
            // Add line numbers
            this.updateLineNumbers(editor);
            
            // Handle tab key
            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 4;
                }
            });
            
            // Update line numbers on input
            editor.addEventListener('input', () => {
                this.updateLineNumbers(editor);
            });

            // Sync scroll with line numbers
            editor.addEventListener('scroll', () => {
                this.syncLineNumberScroll(editor);
            });
        });
    },

    /**
     * Update line numbers for an editor
     */
    updateLineNumbers(editor) {
        // Try multiple ID patterns
        const lineNumbersId = editor.id.replace('code-editor', 'line-numbers')
                                       .replace('editor-', 'lines-')
                                       .replace('playground-editor', 'lines-playground');
        let lineNumbersEl = document.getElementById(lineNumbersId);
        
        // Fallback: look for sibling line numbers element
        if (!lineNumbersEl) {
            const wrapper = editor.closest('.editor-wrapper');
            if (wrapper) {
                lineNumbersEl = wrapper.querySelector('.line-numbers');
            }
        }
        
        if (lineNumbersEl) {
            const lines = editor.value.split('\n').length;
            let numbers = '';
            for (let i = 1; i <= lines; i++) {
                numbers += i + '\n';
            }
            lineNumbersEl.textContent = numbers;
        }
    },

    /**
     * Sync line number scroll with editor
     */
    syncLineNumberScroll(editor) {
        const lineNumbersId = editor.id.replace('code-editor', 'line-numbers')
                                       .replace('editor-', 'lines-')
                                       .replace('playground-editor', 'lines-playground');
        let lineNumbersEl = document.getElementById(lineNumbersId);
        
        if (!lineNumbersEl) {
            const wrapper = editor.closest('.editor-wrapper');
            if (wrapper) {
                lineNumbersEl = wrapper.querySelector('.line-numbers');
            }
        }
        
        if (lineNumbersEl) {
            lineNumbersEl.scrollTop = editor.scrollTop;
        }
    },

    /**
     * Setup event listeners for buttons
     */
    setupEventListeners() {
        // Run buttons
        document.querySelectorAll('[id^="run-"], .run-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const editorAttr = btn.dataset?.editor;
                const id = editorAttr 
                    ? editorAttr.replace('editor-', '') 
                    : (btn.id?.replace('run-', '') || '');
                if (id) {
                    this.runCode(id);
                }
            });
        });

        // Reset buttons
        document.querySelectorAll('[id^="reset-"], .reset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const editorAttr = btn.dataset?.editor;
                const id = editorAttr 
                    ? editorAttr.replace('editor-', '') 
                    : (btn.id?.replace('reset-', '') || '');
                if (id) {
                    this.resetCode(id);
                }
            });
        });

        // Clear output buttons
        document.querySelectorAll('[id^="clear-output"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.id.replace('clear-output-', '');
                this.clearOutput(id);
            });
        });

        // Playground specific
        this.setupPlaygroundListeners();
    },

    /**
     * Setup playground-specific event listeners
     */
    setupPlaygroundListeners() {
        const templateSelector = document.getElementById('code-template');
        if (templateSelector) {
            templateSelector.addEventListener('change', (e) => {
                this.loadTemplate(e.target.value);
            });
        }

        const saveBtn = document.getElementById('save-code');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCode());
        }

        const clearPlaygroundBtn = document.getElementById('clear-playground');
        if (clearPlaygroundBtn) {
            clearPlaygroundBtn.addEventListener('click', () => {
                const editor = document.getElementById('playground-editor');
                if (editor) {
                    editor.value = this.templates.blank;
                    this.updateLineNumbers(editor);
                }
            });
        }

        const runPlaygroundBtn = document.getElementById('run-playground');
        if (runPlaygroundBtn) {
            runPlaygroundBtn.addEventListener('click', () => {
                this.runCode('playground');
            });
        }

        const clearConsoleBtn = document.getElementById('clear-console');
        if (clearConsoleBtn) {
            clearConsoleBtn.addEventListener('click', () => {
                const output = document.getElementById('playground-output');
                if (output) {
                    output.innerHTML = '<div class="console-welcome"><p>Console cleared.</p></div>';
                }
            });
        }

        const formatBtn = document.getElementById('format-code');
        if (formatBtn) {
            formatBtn.addEventListener('click', () => this.formatCode());
        }
    },

    /**
     * Run code and display simulated output
     */
    runCode(id) {
        const editor = document.getElementById(`editor-${id}`) || 
                       document.getElementById(`code-editor-${id}`) ||
                       document.getElementById('playground-editor');
        const output = document.getElementById(`output-${id}`) || 
                       document.getElementById('playground-output');
        
        if (!editor || !output) {
            console.warn(`Editor or output not found for id: ${id}`);
            return;
        }

        const code = editor.value;
        
        // Show loading state
        output.innerHTML = '<span class="output-loading">⏳ Compiling and running...</span>';

        // Simulate execution delay
        setTimeout(() => {
            const result = this.simulateExecution(code);
            output.innerHTML = result;
            
            // Track that code was run
            if (typeof App !== 'undefined' && App.markCodeRun) {
                App.markCodeRun();
            }
        }, 500);
    },

    /**
     * Simulate C# code execution
     */
    simulateExecution(code) {
        let output = [];
        
        try {
            // Extract Console.WriteLine statements
            const writeLineRegex = /Console\.WriteLine\s*\(\s*(?:\$?"([^"]*(?:\{[^}]*\}[^"]*)*)"|([^)]+))\s*\)/g;
            
            let match;
            while ((match = writeLineRegex.exec(code)) !== null) {
                let text = match[1] || match[2] || '';
                text = this.processInterpolation(text, code);
                output.push(`<div class="output-line">${this.escapeHtml(text)}</div>`);
            }

            // Check for specific examples and provide appropriate output
            output = this.getContextualOutput(code, output);

            if (output.length === 0) {
                output = ['<div class="output-line output-success">✓ Code compiled successfully. No output.</div>'];
            }

            return output.join('');

        } catch (error) {
            return `<div class="output-line output-error">❌ Error: ${this.escapeHtml(error.message)}</div>`;
        }
    },

    /**
     * Get contextual output based on code patterns
     */
    getContextualOutput(code, existingOutput) {
        if (existingOutput.length > 0) return existingOutput;

        // Interface example
        if (code.includes('ITransactions') && code.includes('Transaction')) {
            return [
                '<div class="output-line">Transaction code: ABC20190001</div>',
                '<div class="output-line">Amount: $5000.35</div>'
            ];
        }

        // Shape calculator example
        if (code.includes('CalculateAreas') || code.includes('ShapeCalculator')) {
            return [
                '<div class="output-line">=== Shape Calculator ===</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">Square (side=5): Area = 25</div>',
                '<div class="output-line">Rectangle (4.5 x 3): Area = 13.5</div>',
                '<div class="output-line">Triangle (base=6, height=4): Area = 12</div>'
            ];
        }

        // Student/Person inheritance example
        if (code.includes('Student') && code.includes('Person') && code.includes('DisplayInfo')) {
            return [
                '<div class="output-line">=== Student Information ===</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">Name: Alice Johnson</div>',
                '<div class="output-line">Age: 20</div>',
                '<div class="output-line">Student ID: 2024001</div>',
                '<div class="output-line">Program: Computer Science</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">Alice Johnson is walking...</div>',
                '<div class="output-line">Alice Johnson is studying Computer Science...</div>'
            ];
        }

        // Bank account polymorphism example
        if (code.includes('BankAccount') && code.includes('CheckingAccount')) {
            return [
                '<div class="output-line">=== Polymorphism Demo ===</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">[Basic] Withdrew $450</div>',
                '<div class="output-line">New balance: $50.00</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">[Checking] Withdrew $450 + $2.50 fee</div>',
                '<div class="output-line">New balance: $47.50</div>',
                '<div class="output-line"></div>',
                '<div class="output-line">[Savings] Cannot withdraw!</div>',
                '<div class="output-line">Minimum balance of $100 required</div>'
            ];
        }

        return existingOutput;
    },

    /**
     * Process string interpolation (simplified)
     */
    processInterpolation(text, code) {
        return text.replace(/\{([^}]+)\}/g, (match, expr) => {
            return `[${expr.trim()}]`;
        });
    },

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Reset code to original
     */
    resetCode(id) {
        const possibleIds = [`editor-${id}`, `code-editor-${id}`, 'playground-editor'];
        let editor = null;
        let editorId = null;

        for (const eid of possibleIds) {
            editor = document.getElementById(eid);
            if (editor) {
                editorId = eid;
                break;
            }
        }
        
        if (editor && this.originalCode[editorId]) {
            editor.value = this.originalCode[editorId];
            this.updateLineNumbers(editor);
            this.clearOutput(id);
            this.getUtils().showToast('Code reset to original', 'info');
        }
    },

    /**
     * Clear output
     */
    clearOutput(id) {
        const output = document.getElementById(`output-${id}`) || 
                       document.getElementById('playground-output');
        if (output) {
            output.innerHTML = '<span class="output-placeholder">Click "Run Code" to see the output...</span>';
        }
    },

    /**
     * Load template into playground
     */
    loadTemplate(templateName) {
        const editor = document.getElementById('playground-editor');
        if (editor && this.templates[templateName]) {
            editor.value = this.templates[templateName];
            this.updateLineNumbers(editor);
            this.getUtils().showToast(`Loaded ${templateName} template`, 'success');
        }
    },

    /**
     * Save code to local storage
     */
    saveCode() {
        const editor = document.getElementById('playground-editor');
        if (editor) {
            const code = editor.value;
            const utils = this.getUtils();
            const savedCodes = utils.storage.get('savedCodes', []);
            
            const newSave = {
                id: utils.generateId(),
                code: code,
                timestamp: new Date().toISOString(),
                name: `Code Snippet ${savedCodes.length + 1}`
            };
            
            savedCodes.unshift(newSave);
            
            // Keep only last 10 saves
            if (savedCodes.length > 10) {
                savedCodes.pop();
            }
            
            utils.storage.set('savedCodes', savedCodes);
            utils.storage.set('lastPlaygroundCode', code);
            utils.showToast('Code saved successfully! 💾', 'success');
        }
    },

    /**
     * Load saved code from local storage
     */
    loadSavedCode() {
        const editor = document.getElementById('playground-editor');
        if (editor) {
            const savedCode = this.getUtils().storage.get('lastPlaygroundCode');
            if (savedCode) {
                editor.value = savedCode;
                this.updateLineNumbers(editor);
            }
        }
    },

    /**
     * Format code (basic indentation)
     */
    formatCode() {
        const editor = document.getElementById('playground-editor');
        if (!editor) return;

        let code = editor.value;
        let formatted = '';
        let indentLevel = 0;
        const indentSize = 4;
        const lines = code.split('\n');

        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Decrease indent for closing braces
            if (trimmedLine.startsWith('}') || trimmedLine.startsWith(')')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Add indentation
            if (trimmedLine.length > 0) {
                formatted += ' '.repeat(indentLevel * indentSize) + trimmedLine + '\n';
            } else {
                formatted += '\n';
            }

            // Increase indent for opening braces
            if (trimmedLine.endsWith('{') || trimmedLine.endsWith('(')) {
                indentLevel++;
            }
        });

        editor.value = formatted.trim();
        this.updateLineNumbers(editor);
        this.getUtils().showToast('Code formatted! ✨', 'success');
    },

    /**
     * Auto-save functionality
     */
    startAutoSave() {
        setInterval(() => {
            const editor = document.getElementById('playground-editor');
            if (editor && editor.value.trim()) {
                this.getUtils().storage.set('lastPlaygroundCode', editor.value);
            }
        }, 30000); // Auto-save every 30 seconds
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only init if not already handled by inline bridge script
    if (!window.PlatformBridge) {
        CodeEditor.init();
        CodeEditor.startAutoSave();
    } else {
        // Make CodeEditor templates available via bridge
        if (window.PlatformBridge.templates) {
            Object.keys(CodeEditor.templates).forEach(function(key) {
                if (!window.PlatformBridge.templates[key]) {
                    window.PlatformBridge.templates[key] = CodeEditor.templates[key];
                }
            });
        }
        console.log('CodeEditor.js loaded - platform bridge detected, skipping duplicate init');
    }
});

// Make globally available
window.CodeEditor = CodeEditor;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeEditor;
}
