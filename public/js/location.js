const scriptURL = 'https://script.google.com/macros/s/AKfycbxL4ZgKC5zYijdg7JtwFKKX70APJDowMReSatlGQE3eF-ruxJ8Ema62fn2nB09bSsRG2g/exec'

const form = document.forms['inquiry-form']

form.addEventListener('submit', e => {
   e.preventDefault()
   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
   .then(response => alert("Thank you! Your inquiry was submitted successfully." ))
   .then(() => { window.location.reload(); })
   .catch(error => console.error('Error!', error.message))
})

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