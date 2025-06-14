document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    const icon = toggleButton.querySelector('i');

    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');

            // 防止表单提交
            event.preventDefault();
        });
    }

    // 输入验证
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.setAttribute('data-has-value', 'true');
            } else {
                this.removeAttribute('data-has-value');
            }
        });
    }
});