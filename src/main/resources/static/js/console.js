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

    function refreshDomainList(id,key) {
        // console.log(id)
        // console.log(key)
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
                // console.log('API返回数据:', data); // 调试用
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
    }

   // 控制台数据列表请求
   document.querySelector('.menu').addEventListener('click', (e) => {
       const userLi = e.target.closest('li[data-page="domain-list"]');
       if (!userLi) return;

       // const name = userLi.querySelector('.user-link').textContent;
       const id = userLi.querySelector('.user-id').value;
       const key = userLi.querySelector('.user-key').value;
       // console.log(id)
       // console.log(key)
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
               // console.log('API返回数据:', data); // 调试用
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


// 控制台数据列表渲染
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
            const status = domain.status || '未知';
            const grade = domain.gradeTitle || '未知';
            const updateTime = domain.updatedOn ?
                new Date(domain.updatedOn).toLocaleString() : '未知';

            html += `
            <tr>
                <td><input type="checkbox" class="domain-checkbox"></td>
                <td>${domainName}</td>
                <td class="status-cell">${status}</td>
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








//
// 动态模拟框
//     const modifyDomainBtn = document.querySelector('#modify_domain');
//     const modal = document.getElementById('modifyDomainModal');
//     const closeBtn = document.getElementById('closeModal');
//
//
//
// // 点击关闭按钮隐藏模态框
//     closeBtn.addEventListener('click', () => {
//         modal.style.display = 'none';
//     });
//
// // 点击模态框外部也关闭模态框
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) {
//             modal.style.display = 'none';
//         }
//     });







    // 状态单元格点击事件（使用事件委托）
    document.addEventListener('click', function(e) {
        const statusCell = e.target.closest('.status-cell');
        if (statusCell) {
            e.preventDefault();
            handleStatusClick(statusCell,e);
        }
    });

// 状态点击处理函数
    function handleStatusClick(cell,e) {
        // 显示加载状态
        const originalStatus = cell.textContent.trim();
        cell.textContent = '加载中...';
        cell.style.color = 'gray';

        updateStatusOnServer(cell, originalStatus,e);
    }

// 更新服务器状态的函数
    function updateStatusOnServer(cell, originalStatus,e) {
        const row = cell.closest('tr');
        const li = document.querySelector('li[data-page="domain-list"].active');
        if (!li) {
            console.error('未找到激活的用户列表项');
            resetCellState(cell, originalStatus);
            return;
        }
        // 获取当前<li>下的隐藏input值
        const id = li.querySelector('.user-id').value;
        const key = li.querySelector('.user-key').value;
        const domain = row.querySelector('td:nth-child(2)').textContent;
        const requestedStatus = originalStatus
        // console.log('id:',id)
        // console.log('key:',key)
        // console.log('domain:',domain)
        // console.log('status:',requestedStatus)
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        formData.append('domain', domain);
        formData.append('status', requestedStatus);

        // 修改域名状态请求
        fetch('/api/tencent/ModifyDomainStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 修正为正确的Content-Type
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if ( data.code ===200 ) {
                    const confirmed = confirm('状态更新成功，是否切换状态？');
                    if (confirmed) {
                        // 切换状态
                        const newStatus = originalStatus === 'ENABLE' ? 'PAUSE' : 'ENABLE';
                        cell.textContent = newStatus;
                        cell.style.color = newStatus === 'ENABLE' ? 'green' : 'red';
                    } else {
                        // 保持原状态
                        resetCellState(cell, originalStatus);
                    }
                }
            })
            .catch(error => {
                console.error('更新状态出错:', error);
                // 恢复原始状态
                resetCellState(cell, originalStatus);
                alert('请求失败: ' + error.message);
            });
        function resetCellState(cell, status) {
            cell.textContent = status;
            cell.style.color = status === 'ENABLE' ? 'green' : 'red';
        }
    }





// 添加域名模态框功能
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
        // 获取当前<li>下的隐藏input值
        const id = li.querySelector('.user-id').value;
        const key = li.querySelector('.user-key').value;
        const domain = domainInput.value;
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        formData.append('domain', domain);

        // 添加域名请求
        fetch('/api/tencent/CreateDomain', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.code === 200) {
                    // 关闭模态框
                    closeAddDomainModal();
                    alert('域名添加成功！');
                    refreshDomainList(id,key) // 替换 teim(this)
                    // 创建新的域名对象
                    // const newDomain = {
                    //     name: data.data[0].domainInfo.domain,
                    //     status: data.status,
                    //     gradeTitle: data.gradeTitle, // 默认套餐
                    //     updatedOn: new Date().toISOString() // 当前时间
                    // };

                    // 获取当前域名列表
                    // const tbody = document.querySelector('.domain-table tbody');
                    // let domainList = [];

                    // 如果当前没有"暂无域名数据"的提示行
                    // if (!tbody.querySelector('td[colspan="6"]')) {
                    //     // 收集现有域名数据
                    //     const rows = tbody.querySelectorAll('tr');
                    //     rows.forEach(row => {
                    //         domainList.push({
                    //             name: row.querySelector('td:nth-child(2)').textContent,
                    //             status: row.querySelector('.status-cell').textContent,
                    //             gradeTitle: row.querySelector('td:nth-child(4)').textContent,
                    //             updatedOn: row.querySelector('td:nth-child(5)').textContent
                    //         });
                    //     });
                    // }

                    // 将新域名添加到列表顶部
                    // domainList.unshift(newDomain);

                    // 重新渲染列表
                    // renderDomainList(domainList);

                    // 显示成功提示

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





// 删除模块
    document.addEventListener('click', function(e) {
        // 检查点击的是否是删除按钮
        const deleteBtn = e.target.closest('.btn-danger');
        if (!deleteBtn) return;
        e.preventDefault();

        const row = deleteBtn.closest('tr');
        const domainName = row.querySelector('td:nth-child(2)').textContent;

        if(confirm(`你确定要删除${domainName}吗`)) {
            // 获取当前激活的用户凭证
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
                    console.log('删除响应:', data);
                    if (data.code === 200) {
                        alert('域名删除成功！');
                        // 重新获取并渲染域名列表
                        refreshDomainList(id,key)
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






    // 解析按钮点击事件（使用事件委托）
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
        console.log(id)
        console.log(key)
        console.log(domainName)
        // 获取解析记录
        fetchDNSRecords(id, key, domainName);
    });

// 获取DNS记录的函数
    function fetchDNSRecords(id, key, domain) {
        const tbody = document.getElementById('recordTableBody');
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">加载中...</td></tr>';

        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('key', key);
        formData.append('domain', domain);

        fetch('/api/tencent/DescribeRecordList', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    renderDNSRecords(data.data || []);
                } else {
                    throw new Error(data.message || '获取记录失败');
                }
            })
            .catch(error => {
                console.error('获取DNS记录出错:', error);
                tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: red;">${error.message}</td></tr>`;
            });
    }

// 渲染DNS记录的函数
    function renderDNSRecords(records) {
        const tbody = document.getElementById('recordTableBody');

        if (!records || records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">暂无解析记录</td></tr>';
            return;
        }

        let html = '';
        records.forEach(record => {
            html += `
        <tr>
            <td><input type="checkbox" class="record-checkbox"></td>
            <td>${record.name || '@'}</td>
            <td>${record.type || 'A'}</td>
            <td>${record.line || '默认'}</td>
            <td>${record.value || ''}</td>
            <td>${record.mx || '0'}</td>
            <td>${record.ttl || '600'}</td>
            <td>${record.updatedOn ? new Date(record.updatedOn).toLocaleString() : '未知'}</td>
            <td class="${record.status === 'ENABLE' ? 'status-active' : 'status-paused'}">
                ${record.status === 'ENABLE' ? '已启用' : '已暂停'}
            </td>
            <td>
                <button class="btn-sm edit-record" data-id="${record.id}">修改</button>
                <button class="btn-sm btn-danger delete-record" data-id="${record.id}">删除</button>
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
            pagination.querySelector('span:nth-child(1)').textContent = '1/1';
            pagination.querySelector('span:nth-child(2)').textContent = `从1-${Math.min(total, 8)}条`;
            pagination.querySelector('span:nth-child(3)').textContent = `共${total}条`;
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
        // 这里可以打开另一个弹框用于添加记录
    });

// 批量添加按钮点击事件
    document.getElementById('batchAddRecordBtn').addEventListener('click', function() {
        alert('批量添加功能待实现');
    });





});




