/**
 * C# Compiler Module
 * Uses Piston API for real C# code compilation and execution
 */

const CSharpCompiler = (function() {
    'use strict';
    
    const API_URL = 'https://emkc.org/api/v2/piston/execute';
    const LANGUAGE = 'csharp';
    const VERSION = '*'; // Latest version
    
    // Rate limiting
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
    
    /**
     * Execute C# code
     * @param {string} code - The C# code to compile and run
     * @returns {Promise<Object>} - Result object with success, output, and error properties
     */
    async function run(code) {
        // Rate limiting check
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
        }
        
        lastRequestTime = Date.now();
        
        try {
            showStatus('compiling', 'Compiling...');
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: LANGUAGE,
                    version: VERSION,
                    files: [{
                        name: 'Program.cs',
                        content: code
                    }],
                    stdin: '',
                    args: [],
                    compile_timeout: 10000,
                    run_timeout: 5000,
                    compile_memory_limit: -1,
                    run_memory_limit: -1
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            return processResult(result);
            
        } catch (error) {
            console.error('Compilation error:', error);
            showStatus('error', 'Error');
            
            return {
                success: false,
                output: formatError(error),
                error: true,
                errorType: 'network'
            };
        }
    }
    
    /**
     * Process the API response
     */
    function processResult(result) {
        if (!result.run) {
            showStatus('error', 'Invalid Response');
            return {
                success: false,
                output: 'Invalid response from compiler service.',
                error: true,
                errorType: 'invalid'
            };
        }
        
        const stdout = result.run.stdout || '';
        const stderr = result.run.stderr || '';
        const output = result.run.output || '';
        const exitCode = result.run.code;
        
        // Check for compilation errors
        if (result.compile && result.compile.code !== 0) {
            showStatus('error', 'Compile Error');
            return {
                success: false,
                output: result.compile.stderr || result.compile.output || 'Compilation failed',
                error: true,
                errorType: 'compile'
            };
        }
        
        // Check for runtime errors
        if (exitCode !== 0) {
            showStatus('error', 'Runtime Error');
            return {
                success: false,
                output: stderr || output || 'Runtime error occurred',
                error: true,
                errorType: 'runtime'
            };
        }
        
        // Success
        showStatus('success', 'Success');
        return {
            success: true,
            output: stdout || output || '(No output)',
            error: false,
            errorType: null
        };
    }
    
    /**
     * Format error message for display
     */
    function formatError(error) {
        let message = 'Failed to compile code.\n\n';
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            message += '🌐 Network Error\n';
            message += 'Unable to reach the compiler service.\n';
            message += 'Please check your internet connection and try again.';
        } else if (error.message.includes('HTTP error')) {
            message += '🖥️ Server Error\n';
            message += `${error.message}\n`;
            message += 'The compiler service may be temporarily unavailable.';
        } else if (error.message.includes('timeout')) {
            message += '⏱️ Timeout Error\n';
            message += 'The code took too long to execute.\n';
            message += 'Please simplify your code or check for infinite loops.';
        } else {
            message += `❌ Error: ${error.message}`;
        }
        
        return message;
    }
    
    /**
     * Show compiler status indicator
     */
    function showStatus(status, text) {
        const indicator = document.getElementById('compiler-status');
        if (!indicator) return;
        
        const statusText = indicator.querySelector('.status-text');
        const statusDot = indicator.querySelector('.status-dot');
        
        // Remove previous status classes
        indicator.classList.remove('compiling', 'error', 'success', 'visible');
        
        // Add new status
        indicator.classList.add(status, 'visible');
        
        if (statusText) {
            statusText.textContent = text;
        }
        
        // Auto-hide after success or error
        if (status === 'success' || status === 'error') {
            setTimeout(() => {
                indicator.classList.remove('visible');
            }, 3000);
        }
    }
    
    /**
     * Test compiler connection
     */
    async function testConnection() {
        const testCode = `
using System;
class Program {
    static void Main() {
        Console.WriteLine("Compiler connection successful!");
    }
}`;
        
        try {
            const result = await run(testCode);
            return result.success;
        } catch (e) {
            console.error('Compiler test failed:', e);
            return false;
        }
    }
    
    /**
     * Get available language versions
     */
    async function getVersions() {
        try {
            const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
            const runtimes = await response.json();
            return runtimes.filter(r => r.language === 'csharp');
        } catch (e) {
            console.error('Failed to fetch versions:', e);
            return [];
        }
    }
    
    /**
     * Sleep helper
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API
    return {
        run,
        testConnection,
        getVersions,
        showStatus
    };
})();

// Make available globally
window.CSharpCompiler = CSharpCompiler;
