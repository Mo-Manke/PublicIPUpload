document.querySelector('#login').addEventListener('submit', () => {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({password})
    })

})