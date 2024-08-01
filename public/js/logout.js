document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('#logoutLink');
    logoutLinks.forEach(logoutLink => {
        logoutLink.addEventListener('click', function(event) {
            console.log('Logout link clicked'); // Debugging line
            event.preventDefault(); // Prevent the default link behavior

            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login'; // Redirect to the login on successful logout
                } else {
                    alert('Error logging out. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error logging out. Please try again later.');
            });
        });
    });
});
