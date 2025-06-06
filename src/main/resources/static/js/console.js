document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        sidebar.addEventListener('click', function (event) {
            const targetLi = event.target.closest('li');

            if (targetLi && targetLi.getAttribute('data-page')) {
                event.preventDefault(); // ⚠️ 阻止 <a> 的默认跳转

                const pageId = targetLi.getAttribute('data-page');

                // 移除所有 active 类
                document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

                // 添加 active 类
                targetLi.classList.add('active');
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // 查找错误提示框
    const errorAlert = document.getElementById('errorAlert');

    // 如果存在且有内容，则5秒后隐藏
    if (errorAlert) {
        setTimeout(function () {
            errorAlert.style.transition = 'opacity 0.5s';
            errorAlert.style.opacity = 0;

            setTimeout(function () {
                errorAlert.style.display = 'none';
            }, 500); // 动画时间
        }, 5000); // 5秒后执行
    }
});
