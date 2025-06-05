document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu li')

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有 active 类
            menuItems.forEach(li => li.classList.remove('active'))
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active')
            })

            // 当前选中项
            this.classList.add('active')
            const pageId = this.getAttribute('data-page')
            document.getElementById(pageId).classList.add('active')
        })
    })
})