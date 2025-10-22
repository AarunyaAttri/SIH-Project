// Parent's Login Page JS

document.getElementById('get-otp').addEventListener('click', function() {
    const phone = document.getElementById('phone').value;
    if (/^\d{10}$/.test(phone)) {
        // Simulate sending OTP (replace with actual API call)
        alert('OTP sent to ' + phone);
        document.getElementById('otp-section').style.display = 'block';
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('get-otp').disabled = true;
        document.getElementById('phone').disabled = true;
    } else {
        alert('Please enter a valid 10-digit phone number.');
    }
});

document.getElementById('parent-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const otp = document.getElementById('otp').value;
    const privacyChecked = document.getElementById('privacy').checked;
    if (!privacyChecked) {
        alert('You must agree to the Privacy Policy and Terms & Conditions.');
        return;
    }
    if (otp.length === 6) {
        // Simulate OTP verification (replace with actual API call)
        alert('Login successful!');
        window.location.href = 'parent-dashboard.html'; // Redirect to parent dashboard
    } else {
        alert('Please enter a valid 6-digit OTP.');
    }
});
