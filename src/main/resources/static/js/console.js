document.addEventListener('DOMContentLoaded', function () {
    // ==================== 页面列表切换 ====================
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

    // ==================== 域名列表功能 ====================
    function refreshDomainList(id, key) {
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        fetch('/api/tencent/DescribeDomainList', {
            method: 'POST',
            headers: { 'Content-Type':'application/x-www-form-urlencoded' },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const domainList = data.data?.[0]?.domainList || [];
                    renderDomainList(domainList);
                } else {
                    console.error('API返回错误:', data.message);
                    renderDomainList([]);
                }
            })
            .catch(error => {
                console.error('请求失败', error);
                renderDomainList([]);
            });
    }

    // 控制台数据列表请求
    document.querySelector('.menu').addEventListener('click', (e) => {
        const userLi = e.target.closest('li[data-page="domain-list"]');
        if (!userLi) return;

        const id = userLi.querySelector('.user-id').value;
        const key = userLi.querySelector('.user-key').value;

        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        fetch('/api/tencent/DescribeDomainList', {
            method: 'POST',
            headers: { 'Content-Type':'application/x-www-form-urlencoded' },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const domainList = data.data?.[0]?.domainList || [];
                    renderDomainList(domainList);
                } else {
                    console.error('API返回错误:', data.message);
                    renderDomainList([]);
                }
            })
            .catch(error => {
                console.error('请求失败', error);
                renderDomainList([]);
            });
    });

    // 控制台数据列表渲染
    function renderDomainList(domainList) {
        const tbody = document.querySelector('.domain-table tbody');

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
            const domainName = domain.name || '未知';
            const status = domain.status || '未知';
            const grade = domain.gradeTitle || '未知';
            const updateTime = domain.updatedOn ?
                new Date(domain.updatedOn).toLocaleString() : '未知';

            html += `
            <tr>
                <td><input type="checkbox" class="domain-checkbox"></td>
                <td>${domainName}</td>
                <td class="status-cell" style="color: ${status === 'ENABLE' ? 'green' : 'red'}">${status}</td>
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

    // ==================== 域名状态切换功能 ====================
// 状态单元格点击事件
    document.addEventListener('click', function(e) {

        const statusCell = e.target.closest('.status-cell');
        if (statusCell) {
            e.preventDefault();
            // 获取当前状态文本
            const originalStatus = statusCell.textContent.trim();
            const statusText = originalStatus === 'ENABLE' ? '停用' : '启用';

            // 使用confirm弹窗获取用户确认
            const isConfirmed = confirm(`确定要${statusText}该域名吗？`);

            if (isConfirmed) {
                handleStatusClick(statusCell);
            }
        }
    });

// 状态点击处理函数
    function handleStatusClick(cell) {
        // 显示加载状态
        const originalStatus = cell.textContent.trim();
        cell.textContent = '加载中...';
        cell.style.color = 'gray';
        cell.style.pointerEvents = 'none'; // 禁用点击，防止重复提交

        updateStatusOnServer(cell, originalStatus);
    }

// 更新服务器状态的函数
    function updateStatusOnServer(cell, originalStatus) {
        const row = cell.closest('tr');
        const li = document.querySelector('li[data-page="domain-list"].active');

        if (!li) {
            console.error('未找到激活的用户列表项');
            resetCellState(cell, originalStatus);
            return;
        }

        // 获取必要数据
        const id = li.querySelector('.user-id').value;
        const key = li.querySelector('.user-key').value;
        const domain = row.querySelector('td:nth-child(2)').textContent;

        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        formData.append('domain', domain);
        formData.append('status', originalStatus);

        // 修改域名状态请求
        fetch('/api/tencent/ModifyDomainStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    // 请求成功后刷新页面
                    refreshDomainList(id, key);
                } else {
                    throw new Error(data.message || '状态更新失败');
                }
            })
            .catch(error => {
                console.error('更新状态出错:', error);
                resetCellState(cell, originalStatus);
                alert('请求失败: ' + error.message);
            });
    }

// 重置单元格状态
    function resetCellState(cell, status) {
        cell.textContent = status;
        cell.style.color = status === 'ENABLE' ? 'green' : 'red';
        cell.style.pointerEvents = 'auto'; // 恢复点击
    }

    // ==================== 添加域名功能 ====================
    const addDomainBtn = document.querySelector('.left-buttons .btn:first-child');
    const addDomainModal = document.getElementById('addDomainModal');
    const domainInput = document.getElementById('domainInput');
    const submitDomainBtn = document.getElementById('submit_Domain');

    // 点击添加域名按钮显示模态框
    addDomainBtn.addEventListener('click', () => {
        addDomainModal.style.display = 'flex';
        domainInput.focus();
    });

    // 关闭模态框的函数
    function closeAddDomainModal() {
        addDomainModal.style.display = 'none';
        domainInput.value = '';
    }

    // 点击关闭按钮
    addDomainModal.querySelector('.close-btn').addEventListener('click', closeAddDomainModal);

    // 点击模态框外部关闭
    addDomainModal.addEventListener('click', (e) => {
        if (e.target === addDomainModal) {
            closeAddDomainModal();
        }
    });

    // 提交域名
    submitDomainBtn.addEventListener('click', (e) => {
        const domains = domainInput.value.trim();
        if (!domains) {
            alert('请输入至少一个域名');
            return;
        }

        const li = document.querySelector('li[data-page="domain-list"].active');
        if (!li) {
            console.error('未找到激活的用户列表项');
            return;
        }

        const id = li.querySelector('.user-id').value;
        const key = li.querySelector('.user-key').value;
        const domain = domainInput.value;

        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        formData.append('domain', domain);

        fetch('/api/tencent/CreateDomain', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    closeAddDomainModal();
                    alert('域名添加成功！');
                    refreshDomainList(id, key);
                } else {
                    alert('添加失败: ' + (data.message || '未知错误'));
                }
            })
            .catch(error => {
                console.error('添加域名出错:', error);
                alert('请求失败: ' + error.message);
            });
    });

    // 按ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && addDomainModal.style.display === 'flex') {
            closeAddDomainModal();
        }
    });

    // ==================== 删除域名功能 ====================
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.btn-danger');
        if (!deleteBtn) return;
        e.preventDefault();

        const row = deleteBtn.closest('tr');
        const domainName = row.querySelector('td:nth-child(2)').textContent;

        if(confirm(`你确定要删除${domainName}吗`)) {
            const activeUser = document.querySelector('li[data-page="domain-list"].active');
            if (!activeUser) {
                alert('错误：未找到用户凭证');
                return;
            }

            const id = activeUser.querySelector('.user-id').value;
            const key = activeUser.querySelector('.user-key').value;
            const domain = domainName;

            const formData = new URLSearchParams();
            formData.append('id', id);
            formData.append('key', key);
            formData.append('domain', domain);

            fetch('/api/tencent/DeleteDomain', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        alert('域名删除成功！');
                        refreshDomainList(id, key);
                    } else {
                        throw new Error(data.message || '删除失败');
                    }
                })
                .catch(error => {
                    console.error('操作失败:', error);
                    alert('操作失败: ' + error.message);
                });
        }
    });

    // ==================== 解析记录功能 ====================
    // 解析按钮点击事件
    document.addEventListener('click', function(e) {
        const resolveBtn = e.target.closest('.btn-sm:not(.btn-danger)');
        if (!resolveBtn || !resolveBtn.textContent.includes('解析')) return;

        const row = resolveBtn.closest('tr');
        const domainName = row.querySelector('td:nth-child(2)').textContent;

        // 显示弹框
        const modal = document.getElementById('dnsRecordModal');
        document.getElementById('modalDomainName').textContent = domainName;
        modal.style.display = 'flex';

        // 获取当前激活的用户凭证
        const activeUser = document.querySelector('li[data-page="domain-list"].active');
        if (!activeUser) {
            alert('错误：未找到用户凭证');
            return;
        }

        const id = activeUser.querySelector('.user-id').value;
        const key = activeUser.querySelector('.user-key').value;

        // 获取解析记录
        fetchDNSRecords(id, key, domainName);
    });

    // 获取DNS记录的函数
    function fetchDNSRecords(id, key, domain) {
        const tbody = document.getElementById('recordTableBody');
        tbody.innerHTML = '<tr><td colspan="10" class="loading">加载中...</td></tr>';

        fetch('/api/tencent/DescribeRecordList', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({ id, key, domain })
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200 && data.data && data.data[0]?.recordList) {
                    renderDNSRecords(data.data[0].recordList);
                } else {
                    throw new Error(data.message || '无效的数据结构');
                }
            })
            .catch(error => {
                console.error('获取记录失败:', error);
                tbody.innerHTML = `<tr><td colspan="10" class="error">${error.message}</td></tr>`;
            });
    }

    // 渲染DNS记录的函数
    function renderDNSRecords(records) {
        const tbody = document.getElementById('recordTableBody');

        if (!records || records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="empty">暂无解析记录</td></tr>';
            return;
        }

        let html = '';
        records.forEach(record => {
            const displayValue = record.type === 'TXT'
                ? record.value.substring(0, 30) + (record.value.length > 30 ? '...' : '')
                : record.value;

            const displayDate = record.updatedOn || '未知';

            html += `
            <tr>
                <td><input type="checkbox" class="record-checkbox"></td>
                <td>${record.name || '@'}</td>
                <td>${record.type || 'A'}</td>
                <td>${record.line || '默认'}</td>
                <td class="record-value" title="${record.value}">${displayValue}</td>
                <td>${record.mx || '0'}</td>
                <td>${record.ttl || '600'}</td>
                <td>${displayDate}</td>
                <td class="${record.status === 'ENABLE' ? 'status-enabled' : 'status-disabled'}">
                    ${record.status === 'ENABLE' ? '已启用' : '已暂停'}
                </td>
                <td>
                    <button class="btn-sm edit-record" data-id="${record.recordId}">修改</button>
                    <button class="btn-sm delete-record" style="background:linear-gradient(135deg, #ff4d4f, #ff7875);
                                                                color: white;
                                                                border: 1px solid rgba(255, 77, 79, 0.3);
                                                               " data-id="${record.recordId}">删除</button>
                </td>
            </tr>`;
        });

        tbody.innerHTML = html;
        updatePagination(records.length);
    }

    // 更新分页信息
    function updatePagination(total) {
        const pagination = document.querySelector('#dnsRecordModal .pagination');
        if (pagination) {
            pagination.innerHTML = `
                <span>1/1</span>
                <span>从1-${Math.min(total, 8)}条</span>
                <span>共${total}条</span>
            `;
        }
    }

    // 关闭解析记录弹框
    document.querySelector('#dnsRecordModal .close-btn').addEventListener('click', function() {
        document.getElementById('dnsRecordModal').style.display = 'none';
    });

    // 点击弹框外部关闭
    document.getElementById('dnsRecordModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    // 添加记录按钮点击事件
    document.getElementById('addRecordBtn').addEventListener('click', function() {
        alert('添加记录功能待实现');
    });

    // 批量添加按钮点击事件
    document.getElementById('batchAddBtn').addEventListener('click', function() {
        alert('批量添加功能待实现');
    });

    // ==================== 模态框拖动功能 ====================
    // 为所有模态框添加拖动功能
    document.querySelectorAll('.modal').forEach(modal => {
        setupDragForModal(modal);
    });

    // 拖动功能实现
    function setupDragForModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        const header = modal.querySelector('.draggable-handle');

        if (!header) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        // 鼠标按下事件
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;

            isDragging = true;
            modalContent.classList.add('dragging');

            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(modalContent.style.left, 10) || 0;
            startTop = parseInt(modalContent.style.top, 10) || 0;

            e.preventDefault();
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const maxLeft = window.innerWidth - modalContent.offsetWidth;
            const maxTop = window.innerHeight - modalContent.offsetHeight;

            modalContent.style.left = `${Math.max(0, Math.min(startLeft + dx, maxLeft))}px`;
            modalContent.style.top = `${Math.max(0, Math.min(startTop + dy, maxTop))}px`;
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modalContent.classList.remove('dragging');
            }
        });

        // 触摸屏支持
        header.addEventListener('touchstart', (e) => {
            if (e.target.closest('button')) return;

            isDragging = true;
            modalContent.classList.add('dragging');

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = parseInt(modalContent.style.left, 10) || 0;
            startTop = parseInt(modalContent.style.top, 10) || 0;

            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            const maxLeft = window.innerWidth - modalContent.offsetWidth;
            const maxTop = window.innerHeight - modalContent.offsetHeight;

            modalContent.style.left = `${Math.max(0, Math.min(startLeft + dx, maxLeft))}px`;
            modalContent.style.top = `${Math.max(0, Math.min(startTop + dy, maxTop))}px`;

            e.preventDefault();
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                modalContent.classList.remove('dragging');
            }
        });

        // 确保模态框初始位置居中
        function centerModal() {
            const rect = modalContent.getBoundingClientRect();
            modalContent.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            modalContent.style.top = `${(window.innerHeight - rect.height) / 2}px`;
        }

        // 窗口大小变化时重新居中
        window.addEventListener('resize', centerModal);

        // 初始化位置
        centerModal();
    }
});