// Student Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        if (!formData.class) {
            errors.push('Please select a class');
        }
        
        if (!formData.section) {
            errors.push('Please select a section');
        }
        
        return errors;
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        errorMessage.parentNode.insertBefore(successDiv, errorMessage);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Set loading state
    function setLoading(loading) {
        if (loading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            studentId: document.getElementById('studentId').value,
            password: document.getElementById('password').value,
            
            class: document.getElementById('class').value,
            section: document.getElementById('section').value
        };

        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showError(errors.join(', '));
            return;
        }

        // Set loading state
        setLoading(true);

        // Simulate login process
        setTimeout(() => {
            try {
                // Store student data in localStorage
                const studentData = {
                    studentId: formData.studentId,
                    studentName: formData.studentName,
                    class: formData.class,
                    section: formData.section,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentStudent', JSON.stringify(studentData));
                localStorage.setItem('studentLoggedIn', 'true');
                
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to student dashboard
                setTimeout(() => {
                    window.location.href = 'student-dashboard.html';
                }, 1500);
                
            } catch (error) {
                console.error('Login error:', error);
                showError('Login failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 1000);
    });

    // Check if already logged in
    if (localStorage.getItem('studentLoggedIn') === 'true') {
        const studentData = JSON.parse(localStorage.getItem('currentStudent') || '{}');
        if (studentData.studentId) {
            window.location.href = 'student-dashboard.html';
        }
    }

    // Add input event listeners for better UX
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (errorMessage.style.display === 'block') {
                errorMessage.style.display = 'none';
            }
            
            // Remove error styling
            this.closest('.form-group').classList.remove('error');
        });

        input.addEventListener('blur', function() {
            // Add validation styling on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.closest('.form-group').classList.add('error');
            } else {
                this.closest('.form-group').classList.add('success');
            }
        });
    });
});