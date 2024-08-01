const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid email or password.');
    }

    req.session.firstName = user.firstName; // Save first name in session
    req.session.lastName = user.lastName; // Save last name in session
    req.session.email = user.email; // Save email in session
    req.session.phone = user.phone; // Save phone in session
    req.session.dob = user.dob; // Save dob in session
    req.session.gender = user.gender; // Save gender in session
    req.session.username = user.username; // Save username in session
    req.session.userId = user._id; // Optionally, save userId in session

    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in. Please try again later.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out. Please try again later.');
    }
    res.redirect('/');
  });
};
