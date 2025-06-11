// 全局变量存储当前修改的域名和状态
let currentDomain = '';
let currentStatus = '';

// 显示状态修改弹窗
function showStatusChangeModal(button) {
    // 使用dataset获取自定义数据属性
    const domain = button.dataset.domain;
    const status = button.dataset.status;

    if (!domain || !status) {
        console.error('无法获取domain或status参数');
        return;
    }

    currentDomain = domain;
    currentStatus = status;

    document.getElementById('modalDomainName').textContent = domain;
    document.getElementById('modalStatusText').textContent =
        status === 'ENABLE' ? '已启用' : '已禁用';

    document.getElementById('statusModal').style.display = 'block';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
}

// 确认修改状态
function confirmStatusChange() {
    // 从左侧菜单获取云服务商信息
    const activeMenuItem = document.querySelector('.menu li.active');
    if (!activeMenuItem) {
        alert('请先在左侧菜单选择云服务商');
        return;
    }

    const nameElement = activeMenuItem.querySelector('a.user-link');
    const idElement = nameElement.nextElementSibling;
    const keyElement = idElement.nextElementSibling;

    const name = nameElement.textContent.trim();
    const id = idElement.value;
    const key = keyElement.value;
    const type = name === '腾讯云' ? '1' : name === '阿里云' ? '2' : '';

    if (!id || !key) {
        alert('未获取到有效的ID或KEY');
        return;
    }
    const content = document.getElementById('content');

    fetch('/ModifyDomainStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}&domain=${encodeURIComponent(currentDomain)}&status=${encodeURIComponent(currentStatus)}`
    })
    .then(response => {
        if (!response.ok) throw new Error('网络响应失败');
        return response.text();
    })
    .then(html => {
        content.innerHTML = html;
    })
    .catch(error => {
        console.error('修改状态出错:', error);
        alert('修改状态出错: ' + error.message);
    })
    .finally(() => {
        closeModal();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('menu');
    const content = document.getElementById('content');

    menu.addEventListener('click', function (e) {
        e.preventDefault();

        if (e.target.tagName === 'A') {
            const page = e.target.getAttribute('data-page');
            document.querySelectorAll('.menu li').forEach(item => {
                item.classList.remove('active');
            });
            const currentLi = e.target.closest('li');
            if (currentLi) {
                currentLi.classList.add('active');
            }

            // 只有点击 domainList 才需要传参
            if (page === 'domainList') {
                const nameElement = e.target;
                const idElement = nameElement.nextElementSibling;
                const keyElement = idElement.nextElementSibling;

                const name = nameElement.textContent.trim();
                const id = idElement.value;
                const key = keyElement.value;

                let type = '';
                if (name === '腾讯云') {
                    type = '1';
                } else if (name === '阿里云') {
                    type = '2';
                }

                // 发送 POST 请求到 /domainList
                fetch('/domainList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`
                })
                    .then(response => {
                        if (!response.ok) throw new Error('网络响应失败');
                        return response.text();
                    })
                    .then(html => {
                        content.innerHTML = html;
                        const pageDiv = content.querySelector('.page');
                        if (pageDiv) {
                            pageDiv.classList.add('active');
                        }
                    })
                    .catch(error => {
                        console.error('加载页面出错:', error);
                        content.innerHTML = '<p>无法加载页面内容。</p>';
                    });
            } else {
                // 其他页面继续使用 GET 请求
                fetch(`/${page}`)
                    .then(response => {
                        if (!response.ok) throw new Error('网络响应失败');
                        return response.text();
                    })
                    .then(html => {
                        content.innerHTML = html;
                        const pageDiv = content.querySelector('.page');
                        if (pageDiv) {
                            pageDiv.classList.add('active');
                        }
                    })
                    .catch(error => {
                        console.error('加载页面出错:', error);
                        content.innerHTML = '<p>无法加载页面内容。</p>';
                    });
            }
        }
    });
});


fetch('/addDomain')
    .then(response => {
        if (!response.ok) throw new Error('网络响应失败');
        return response.text();
    })
    .then(html => {
        content.innerHTML = html;
        const pageDiv = content.querySelector('.page');
        if (pageDiv) {
            pageDiv.classList.add('active');
        }

        // ✅ 使用 setTimeout 延迟检测，确保 DOM 更新完成
        setTimeout(() => {
            const errorAlert = document.getElementById('errorAlert');
            if (errorAlert) {
                console.log('找到 #errorAlert，准备隐藏'); // 调试用
                errorAlert.style.transition = 'opacity 3s';
                errorAlert.style.opacity = 0;
                setTimeout(() => {
                    errorAlert.style.display = 'none';
                }, 3000);
            } else {
                console.log('#errorAlert 不存在，可能未渲染'); // 调试用
            }
        }, 100); // 延迟 100ms，确保 DOM 完全更新
    })
    .catch(error => {
        console.error('加载默认页面出错:', error);
        content.innerHTML = '<p>无法加载默认内容。</p>';
    });
document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu li');
    const currentPath = window.location.pathname;

    menuItems.forEach(item => {
        const page = item.querySelector('a')?.getAttribute('data-page');
        if (page === 'addDomain') { // 如果是“添加用户”页
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});
document.getElementById('content').addEventListener('change', function (e) {
    if (e.target.id === 'selectAll') {
        const checkboxes = document.querySelectorAll('.domain-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    } else if (e.target.classList.contains('domain-checkbox')) {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.domain-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        if (selectAll) {
            selectAll.checked = allChecked;
        }
    }
});


