// Register Page JS

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const institution = document.getElementById('institution').value.trim();
    const termsChecked = document.getElementById('terms').checked;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    if (!fullname || !email || !password || !confirmPassword || !institution) {
        errorMessage.textContent = 'Please fill in all required fields.';
        errorMessage.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        errorMessage.style.display = 'block';
        return;
    }
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.style.display = 'block';
        return;
    }
    if (!termsChecked) {
        errorMessage.textContent = 'You must agree to the Terms of Service and Privacy Policy.';
        errorMessage.style.display = 'block';
        return;
    }
    // Simulate registration success
    alert('Registration successful!');
    window.location.href = 'index.html';
});
