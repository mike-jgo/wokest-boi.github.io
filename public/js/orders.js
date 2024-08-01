document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');

    userIcon.addEventListener('mouseover', () => {
        dropdownContent.style.display = 'block';
    });

    userIcon.addEventListener('mouseout', () => {
        dropdownContent.style.display = 'none';
    });

    const rowsPerPage = 4;
    let currentPage = 1;

    const tableBody = document.querySelector('#billingTable tbody');
    const pageInfo = document.getElementById('pageInfo');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');


    function renderTable(page) {
        pageInfo.textContent = `Page ${page}`;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            window.location.href = `/orders?page=${currentPage}`;
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * rowsPerPage < tableBody.children.length) {
            currentPage++;
            window.location.href = `/orders?page=${currentPage}`;
        }
    });

    renderTable(currentPage);
});
