<script>
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            document.querySelectorAll('.error').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.form-group').forEach(el => {
                el.classList.remove('invalid');
            });
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            let isValid = true;
            
            if (!fullName) {
                document.getElementById('nameError').style.display = 'block';
                document.getElementById('fullName').parentElement.classList.add('invalid');
                isValid = false;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                document.getElementById('email').parentElement.classList.add('invalid');
                isValid = false;
            }
            
            if (password.length < 8) {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('password').parentElement.classList.add('invalid');
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').style.display = 'block';
                document.getElementById('confirmPassword').parentElement.classList.add('invalid');
                isValid = false;
            }
            
            if (isValid) {
                alert('Thank you for signing up to Golden Acres Farm! We\'ll be in touch soon.');
                this.reset();
            }
        });
        
        function checkScreenSize() {
            if (window.innerWidth >= 768) {
                document.querySelector('.hero-section').style.display = 'flex';
            } else {
                document.querySelector('.hero-section').style.display = 'none';
            }
        }
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
</script>