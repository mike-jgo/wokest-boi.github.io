// src/validate.js
function checkEmail(email) {
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // pattern to validate email
    if (!email.match(pattern)) {
        return "Enter a valid email address";
    } else {
        return "Valid";
    }
}

function checkPass(password) {
    if (password === "") {
        return "Password can't be blank";
    } else {
        return "Valid";
    }
}

module.exports = {
    checkEmail,
    checkPass
};
