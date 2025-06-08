document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        sidebar.addEventListener('click', function (event) {
            const targetLi = event.target.closest('li');

            if (targetLi && targetLi.getAttribute('data-page')) {
                event.preventDefault();

                // 获取当前点击的页面ID
                const pageId = targetLi.getAttribute('data-page');

                // 更新URL参数（可选）
                const url = new URL(window.location.href);
                url.searchParams.set('tab', pageId);
                window.history.pushState({}, '', url);

                // 更新菜单和页面状态
                updateActiveState(pageId);
            }
        });

        // 初始化时根据URL参数设置活动状态
        const urlParams = new URLSearchParams(window.location.search);
        const activeTab = urlParams.get('tab') || 'add-domain'; // 默认显示添加用户页面
        updateActiveState(activeTab);
    }

    // 更新活动状态的函数
    function updateActiveState(activePageId) {
        // 移除所有active类
        document.querySelectorAll('.menu li').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('data-page') === activePageId) {
                li.classList.add('active');
            }
        });

        // 更新页面显示
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            if (page.id === activePageId) {
                page.classList.add('active');
            }
        });
    }

    // 全选/取消全选功能
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.domain-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
        });
    }

    // 单个复选框点击时检查是否需要取消全选
    const checkboxes = document.querySelectorAll('.domain-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!this.checked && document.getElementById('selectAll').checked) {
                document.getElementById('selectAll').checked = false;
            }

            // 检查是否所有复选框都被选中
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            document.getElementById('selectAll').checked = allChecked;
        });
    });

    // 错误提示框自动隐藏
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        setTimeout(function() {
            errorAlert.style.transition = 'opacity 0.5s';
            errorAlert.style.opacity = 0;
            setTimeout(function() {
                errorAlert.style.display = 'none';
            }, 500);
        }, 5000);
    }



    document.querySelector('.menu').addEventListener('click', (e) => {
        const userLi = e.target.closest('li[data-page="domain-list"]');
        if (!userLi) return;

        // const name = userLi.querySelector('.user-link').textContent;
        const id = userLi.querySelector('.user-id').value;
        const key = userLi.querySelector('.user-key').value;
        console.log(id)
        console.log(key)
        fetch('/api/tencent/DescribeDomainList', {
            method: 'POST',
            headers: { 'Content-Type':'application/x-www-form-urlencoded' },
            body: JSON.stringify({ id, key })
        })
            .then(response => response.formData())
            .then(data => {
                console.log('API返回数据:', data); // 调试用
                if (data.code === 200) {
                    // 安全处理数据，确保domainList是数组
                    const domainList = data.data?.[0]?.domainList || [];
                    renderDomainList(domainList);
                } else {
                    console.error('API返回错误:', data.message);
                    renderDomainList([]); // 显示空状态
                }
            })
            .catch(error => {
                console.error('请求失败', error);
                renderDomainList([]); // 显示空状态
            });
    });


    function renderDomainList(domainList) {
        const tbody = document.querySelector('.domain-table tbody');

        // 确保domainList是数组
        if (!Array.isArray(domainList)) {
            console.error('domainList不是数组:', domainList);
            domainList = [];
        }

        if (domainList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">暂无域名数据</td></tr>';
            document.querySelector('.pagination span:nth-child(2)').textContent = '共0条';
            return;
        }

        let html = '';
        domainList.forEach(domain => {
            // 安全访问属性，防止undefined错误
            const domainName = domain.name || '未知';
            const statusMap = {
                ENABLE: '正常',
                PAUSE: '暂停',
                SPAM: '封禁'
            };
            const status = statusMap[domain.status] || '未知';
            const grade = domain.gradeTitle || '未知';
            const updateTime = domain.updatedOn ?
                new Date(domain.updatedOn).toLocaleString() : '未知';

            html += `
            <tr>
                <td><input type="checkbox" class="domain-checkbox"></td>
                <td>${domainName}</td>
                <td>${status}</td>
                <td>${grade}</td>
                <td>${updateTime}</td>
                <td>
                    <button class="btn-sm">解析</button>
                    <button class="btn-sm btn-danger">删除</button>
                </td>
            </tr>`;
        });

        tbody.innerHTML = html;
        document.querySelector('.pagination span:nth-child(2)').textContent = `共${domainList.length}条`;
    }












});




