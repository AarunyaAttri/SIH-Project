// Parent Login Page JS – Graphically Creative, Modular, Well-Commented

// 1. Animate login card on page load (fade-in + slide-up)
document.addEventListener('DOMContentLoaded', function() {
  const card = document.getElementById('parentLoginCard');
  if (card) {
    card.style.opacity = 0;
    card.style.transform = 'translateY(60px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.8s cubic-bezier(.23,1.01,.32,1), transform 0.8s cubic-bezier(.23,1.01,.32,1)';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 100);
  }
});

// 2. Show/hide password toggle with smooth icon change
(function() {
  const toggle = document.getElementById('toggleParentPassword');
  const pwd = document.getElementById('parentPassword');
  if (toggle && pwd) {
    toggle.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        pwd.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  }
})();

// 3. Micro-interactions: input focus/hover effects
(function() {
  const inputs = document.querySelectorAll('.login-input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.classList.add('input-focused');
    });
    input.addEventListener('blur', function() {
      this.classList.remove('input-focused');
    });
    input.addEventListener('mouseenter', function() {
      this.classList.add('input-hovered');
    });
    input.addEventListener('mouseleave', function() {
      this.classList.remove('input-hovered');
    });
  });
})();

// 4. Login form validation and button animation
(function() {
  const form = document.getElementById('parentLoginForm');
  const username = document.getElementById('parentUsername');
  const password = document.getElementById('parentPassword');
  const loginBtn = document.getElementById('parentLoginBtn');
  const rememberMe = document.getElementById('rememberMe');

  // Restore Remember Me preference
  if (localStorage.getItem('parentRememberMe') === 'true') {
    rememberMe.checked = true;
    if (localStorage.getItem('parentUsername')) {
      username.value = localStorage.getItem('parentUsername');
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    // Remove previous error highlights
    username.classList.remove('input-error');
    password.classList.remove('input-error');

    // Validation: not empty
    if (!username.value.trim()) {
      valid = false;
      animateError(username);
    }
    if (!password.value.trim()) {
      valid = false;
      animateError(password);
    }
    if (!valid) return;

    // Button click animation
    loginBtn.classList.add('btn-animate');
    setTimeout(() => loginBtn.classList.remove('btn-animate'), 350);

    // Save Remember Me preference
    if (rememberMe.checked) {
      localStorage.setItem('parentRememberMe', 'true');
      localStorage.setItem('parentUsername', username.value);
    } else {
      localStorage.setItem('parentRememberMe', 'false');
      localStorage.removeItem('parentUsername');
    }

    // TODO: Add real authentication logic here
    // For demo, just show success
    setTimeout(() => {
      window.location.href = 'parent-dashboard.html';
    }, 400);
  });

  // Animate error highlight
  function animateError(input) {
    input.classList.add('input-error');
    input.style.boxShadow = '0 0 0 3px #ef4444, 0 2px 8px #ef444488';
    setTimeout(() => {
      input.style.boxShadow = '';
      input.classList.remove('input-error');
    }, 900);
  }

  // Button micro-interaction
  loginBtn.addEventListener('mousedown', function() {
    this.classList.add('btn-pressed');
  });
  loginBtn.addEventListener('mouseup', function() {
    this.classList.remove('btn-pressed');
  });
  loginBtn.addEventListener('mouseleave', function() {
    this.classList.remove('btn-pressed');
  });
})();

// 5. Optional: Add CSS for .input-focused, .input-hovered, .input-error, .btn-animate, .btn-pressed in your stylesheet for best effect.
