document.addEventListener('DOMContentLoaded', (event) => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var currentUrl = window.location.href;
    var links = document.querySelectorAll('.sidebar ul li a');
    
    links.forEach(function(link) {
        if (link.href === currentUrl) {
            link.classList.add('active');
        }
    });
});