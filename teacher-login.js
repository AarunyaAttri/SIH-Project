// Teacher Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = loginForm.querySelector('.login-btn');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // Demo teacher accounts for testing
    const teacherAccounts = {
        'teacher1': {
            password: 'password123',
            name: 'John Smith',
            subjects: ['mathematics', 'science'],
            classes: ['grade-9', 'grade-10']
        },
        'teacher2': {
            password: 'password456',
            name: 'Sarah Johnson',
            subjects: ['english', 'history'],
            classes: ['grade-7', 'grade-8']
        },
        'admin': {
            password: 'admin123',
            name: 'Administrator',
            subjects: ['computer', 'physics', 'chemistry', 'biology'],
            classes: ['grade-11', 'grade-12']
        }
    };

    // Form validation
    function validateForm(formData) {
        const errors = [];

        if (!formData.get('username').trim()) {
            errors.push('Username is required');
        }

        if (!formData.get('password').trim()) {
            errors.push('Password is required');
        }

        if (!formData.get('subject')) {
            errors.push('Subject selection is required');
        }

        if (!formData.get('class')) {
            errors.push('Class selection is required');
        }

        return errors;
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Show loading state
    function setLoading(loading) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.textContent = '';
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    }

    // Authenticate user - Open access for all users
    function authenticateUser(username, password, subject, classLevel) {
        // Allow any non-empty username and password
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        // Create a generic teacher profile for any user
        const teacher = {
            name: username.charAt(0).toUpperCase() + username.slice(1),
            subjects: [subject], // Allow any selected subject
            classes: [classLevel] // Allow any selected class
        };

        return { success: true, teacher: teacher };
    }

    // Store session data
    function storeSession(teacherData, subject, classLevel) {
        const sessionData = {
            username: teacherData.username,
            name: teacherData.name,
            subject: subject,
            class: classLevel,
            loginTime: new Date().toLocaleString(),
            loginTimestamp: Date.now()
        };
        
        sessionStorage.setItem('teacherSession', JSON.stringify(sessionData));
        localStorage.setItem('lastLogin', JSON.stringify(sessionData));
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideError();

        const formData = new FormData(loginForm);
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();
        const subject = formData.get('subject');
        const classLevel = formData.get('class');
        const rememberMe = formData.get('rememberMe');

        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showError(errors.join(', '));
            return;
        }

        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const authResult = authenticateUser(username, password, subject, classLevel);

            if (authResult.success) {
                const teacherData = {
                    username: username,
                    name: authResult.teacher.name
                };

                storeSession(teacherData, subject, classLevel);

                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                    localStorage.setItem('rememberedSubject', subject);
                    localStorage.setItem('rememberedClass', classLevel);
                } else {
                    localStorage.removeItem('rememberedUser');
                    localStorage.removeItem('rememberedSubject');
                    localStorage.removeItem('rememberedClass');
                }

                // Show success message
                errorMessage.className = 'success-message';
                errorMessage.textContent = 'Login successful! Redirecting to dashboard...';
                errorMessage.style.display = 'block';

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'teacher-dashboard.html';
                }, 1500);
            } else {
                showError(authResult.message);
                setLoading(false);
            }
        }, 1000);
    });

    // Handle forgot password
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Access Information:\n\nYou can now login with any username and password!\n\nJust enter:\n- Any username (e.g., your name)\n- Any password (e.g., password123)\n- Select your subject and class\n\nThe system is now open for all teachers.');
    });

    // Auto-fill remembered user data
    function loadRememberedData() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        const rememberedSubject = localStorage.getItem('rememberedSubject');
        const rememberedClass = localStorage.getItem('rememberedClass');

        if (rememberedUser) {
            document.getElementById('username').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }

        if (rememberedSubject) {
            document.getElementById('subject').value = rememberedSubject;
        }

        if (rememberedClass) {
            document.getElementById('class').value = rememberedClass;
        }
    }

    // Input animations
    function addInputAnimations() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    // Initialize
    loadRememberedData();
    addInputAnimations();

    // Check if user is already logged in
    const existingSession = sessionStorage.getItem('teacherSession');
    if (existingSession) {
        const sessionData = JSON.parse(existingSession);
        const now = Date.now();
        const sessionAge = now - sessionData.loginTimestamp;
        const maxSessionAge = 8 * 60 * 60 * 1000; // 8 hours

        if (sessionAge < maxSessionAge) {
            // Session is still valid, redirect to dashboard
            window.location.href = 'teacher-dashboard.html';
        } else {
            // Session expired, clear it
            sessionStorage.removeItem('teacherSession');
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to submit form
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'BUTTON') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }

        // Escape key to clear form
        if (e.key === 'Escape') {
            loginForm.reset();
            hideError();
            loadRememberedData();
        }
    });
});

// Utility functions for password strength checking (for future enhancement)
function checkPasswordStrength(password) {
    const strength = {
        score: 0,
        feedback: []
    };

    if (password.length < 8) {
        strength.feedback.push('Password should be at least 8 characters long');
    } else {
        strength.score += 1;
    }

    if (!/[A-Z]/.test(password)) {
        strength.feedback.push('Password should contain uppercase letters');
    } else {
        strength.score += 1;
    }

    if (!/[a-z]/.test(password)) {
        strength.feedback.push('Password should contain lowercase letters');
    } else {
        strength.score += 1;
    }

    if (!/[0-9]/.test(password)) {
        strength.feedback.push('Password should contain numbers');
    } else {
        strength.score += 1;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        strength.feedback.push('Password should contain special characters');
    } else {
        strength.score += 1;
    }

    return strength;
}

// Security utilities
function sanitizeInput(input) {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>&"']/g, function(match) {
                    const escape = {
                        '<': '&lt;',
                        '>': '&gt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        "'": '&#39;'
                    };
                    return escape[match];
                });
}