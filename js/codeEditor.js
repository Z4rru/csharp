/**
 * C# OOP Learning Platform - Code Editor Module
 * Handles code editing, syntax highlighting, and execution simulation
 */

// Inline Utils for CodeEditor (fallback if utils.js not loaded)
const CodeEditorUtils = {
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('LocalStorage not available:', e);
                return defaultValue;
            }
        }
    },
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    showToast(message, type = 'info', duration = 3000) {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(message, type, duration);
            return;
        }
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
        });
    },

    /**
     * Update line numbers for an editor
     */
    updateLineNumbers(editor) {
        const lineNumbersId = editor.id.replace('code-editor', 'line-numbers');
        const lineNumbersEl = document.getElementById(lineNumbersId);
        
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
     * Setup event listeners for buttons
     */
    setupEventListeners() {
        // Run buttons
        document.querySelectorAll('[id^="run-"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.id.replace('run-', '');
                this.runCode(id);
            });
        });

        // Reset buttons
        document.querySelectorAll('[id^="reset-"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.id.replace('reset-', '');
                this.resetCode(id);
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
    },

    /**
     * Run code and display simulated output
     */
    runCode(id) {
        const editor = document.getElementById(`code-editor-${id}`) || 
                       document.getElementById(`${id}-editor`) ||
                       document.getElementById('playground-editor');
        const output = document.getElementById(`output-${id}`) || 
                       document.getElementById('playground-output');
        
        if (!editor || !output) return;

        const code = editor.value;
        
        // Show loading state
        output.innerHTML = '<span class="output-loading">⏳ Compiling and running...</span>';

        // Simulate execution delay
        setTimeout(() => {
            const result = this.simulateExecution(code);
            output.innerHTML = result;
        }, 500);
    },

    /**
     * Simulate C# code execution
     * This is a simplified simulator for educational purposes
     */
    simulateExecution(code) {
        let output = [];
        
        try {
            // Extract Console.WriteLine statements
            const writeLineRegex = /Console\.WriteLine\s*\(\s*(?:\$?"([^"]*(?:\{[^}]*\}[^"]*)*)"|([^)]+))\s*\)/g;
            const writeRegex = /Console\.Write\s*\(\s*(?:\$?"([^"]*(?:\{[^}]*\}[^"]*)*)"|([^)]+))\s*\)/g;
            
            let match;
            
            // Process WriteLine
            while ((match = writeLineRegex.exec(code)) !== null) {
                let text = match[1] || match[2] || '';
                text = this.processInterpolation(text, code);
                output.push(`<div class="output-line">${this.escapeHtml(text)}</div>`);
            }

            // Check for specific examples and provide appropriate output
            if (code.includes('ITransactions') && code.includes('Transaction')) {
                if (output.length === 0) {
                    output = [
                        '<div class="output-line">Transaction code: ABC20190001</div>',
                        '<div class="output-line">Amount: $5000.35</div>'
                    ];
                }
            }

            if (code.includes('CalculateAreas') && code.includes('ISquare')) {
                if (output.length === 0) {
                    output = [
                        '<div class="output-line">=== Shape Calculator ===</div>',
                        '<div class="output-line"></div>',
                        '<div class="output-line">Square (side=5): Area = 25</div>',
                        '<div class="output-line">Rectangle (4.5 x 3): Area = 13.5</div>',
                        '<div class="output-line">Triangle (base=6, height=4): Area = 12</div>'
                    ];
                }
            }

            if (code.includes('Student') && code.includes('Person') && code.includes('DisplayStudentInfo')) {
                if (output.length === 0) {
                    output = [
                        '<div class="output-line">=== Student Information ===</div>',
                        '<div class="output-line"></div>',
                        '<div class="output-line">Name: Jack Paul</div>',
                        '<div class="output-line">Age: 18</div>',
                        '<div class="output-line">Student ID: 20191001</div>',
                        '<div class="output-line">Program: BSCS</div>',
                        '<div class="output-line"></div>',
                        '<div class="output-line">Jack Paul is walking...</div>',
                        '<div class="output-line">Jack Paul is studying BSCS...</div>'
                    ];
                }
            }

            if (code.includes('BankAccount') && code.includes('CheckingAccount') && code.includes('Withdraw')) {
                if (output.length === 0) {
                    output = [
                        '<div class="output-line">=== Regular Bank Account ===</div>',
                        '<div class="output-line">Withdrew $100</div>',
                        '<div class="output-line">New balance: $400</div>',
                        '<div class="output-line"></div>',
                        '<div class="output-line">=== Checking Account (with fees) ===</div>',
                        '<div class="output-line">Withdrew $100 + $2.50 fee</div>',
                        '<div class="output-line">Total deducted: $102.50</div>',
                        '<div class="output-line">New balance: $397.50</div>',
                        '<div class="output-line"></div>',
                        '<div class="output-line">💡 Same method name \'Withdraw\'</div>',
                        '<div class="output-line">   Different behavior based on account type!</div>'
                    ];
                }
            }

            if (output.length === 0) {
                output = ['<div class="output-line output-success">✓ Code compiled successfully. No output.</div>'];
            }

            return output.join('');

        } catch (error) {
            return `<div class="output-line output-error">❌ Error: ${this.escapeHtml(error.message)}</div>`;
        }
    },

    /**
     * Process string interpolation (simplified)
     */
    processInterpolation(text, code) {
        // This is a simplified version - real interpolation would need full parsing
        return text.replace(/\{([^}]+)\}/g, (match, expr) => {
            // Return placeholder for variable expressions
            return `[${expr}]`;
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
        const editorId = `code-editor-${id}`;
        const editor = document.getElementById(editorId);
        
        if (editor && this.originalCode[editorId]) {
            editor.value = this.originalCode[editorId];
            this.updateLineNumbers(editor);
            this.clearOutput(id);
            Utils.showToast('Code reset to original', 'info');
        }
    },

    /**
     * Clear output
     */
    clearOutput(id) {
        const output = document.getElementById(`output-${id}`);
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
            Utils.showToast(`Loaded ${templateName} template`, 'success');
        }
    },

    /**
     * Save code to local storage
     */
    saveCode() {
        const editor = document.getElementById('playground-editor');
        if (editor) {
            const code = editor.value;
            const savedCodes = Utils.storage.get('savedCodes', []);
            
            const newSave = {
                id: Utils.generateId(),
                code: code,
                timestamp: new Date().toISOString(),
                name: `Code Snippet ${savedCodes.length + 1}`
            };
            
            savedCodes.unshift(newSave);
            
            // Keep only last 10 saves
            if (savedCodes.length > 10) {
                savedCodes.pop();
            }
            
            Utils.storage.set('savedCodes', savedCodes);
            Utils.storage.set('lastPlaygroundCode', code);
            Utils.showToast('Code saved successfully! 💾', 'success');
        }
    },

    /**
     * Load saved code from local storage
     */
    loadSavedCode() {
        const editor = document.getElementById('playground-editor');
        if (editor) {
            const savedCode = Utils.storage.get('lastPlaygroundCode');
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
        Utils.showToast('Code formatted! ✨', 'success');
    },

    /**
     * Get list of saved code snippets
     */
    getSavedSnippets() {
        return Utils.storage.get('savedCodes', []);
    },

    /**
     * Load a specific saved snippet
     */
    loadSnippet(id) {
        const savedCodes = this.getSavedSnippets();
        const snippet = savedCodes.find(s => s.id === id);
        
        if (snippet) {
            const editor = document.getElementById('playground-editor');
            if (editor) {
                editor.value = snippet.code;
                this.updateLineNumbers(editor);
                Utils.showToast(`Loaded: ${snippet.name}`, 'info');
            }
        }
    },

    /**
     * Delete a saved snippet
     */
    deleteSnippet(id) {
        let savedCodes = this.getSavedSnippets();
        savedCodes = savedCodes.filter(s => s.id !== id);
        Utils.storage.set('savedCodes', savedCodes);
        Utils.showToast('Snippet deleted', 'info');
    },

    /**
     * Auto-save functionality
     */
    startAutoSave() {
        setInterval(() => {
            const editor = document.getElementById('playground-editor');
            if (editor && editor.value.trim()) {
                Utils.storage.set('lastPlaygroundCode', editor.value);
            }
        }, 30000); // Auto-save every 30 seconds
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CodeEditor.init();
    CodeEditor.startAutoSave();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeEditor;
}
