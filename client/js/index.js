document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected tab content
            const tabId = button.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Form submission handling
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Here you would typically send this data to your server
            console.log('Login attempt:', { email, password });
            
            // For demo purposes, redirect to home page
            // In a real app, you would check credentials first
            // window.location.href = '/home';
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would typically send this data to your server
            console.log('Signup attempt:', { name, email, password });
            
            // For demo purposes, redirect to home page
            // In a real app, you would create the account first
            // window.location.href = '/home';
        });
    }
}); 