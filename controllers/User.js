const User = require('../models/User');
const moment = require('moment');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob, gender, username, password } = req.body;
    
    // Validate and format the DOB
    const formattedDob = moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD');
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      dob: formattedDob,
      gender,
      username,
      password
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up. Please try again later.');
  }
};


exports.getMyAccount = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.redirect('/login');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.render('Oishi Great - MyAccount', {
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('You need an account to view this page');
  }
};

// Fetch user details and render the edit account details page
exports.getEditAccountDetails = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.redirect('/login');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.render('Oishi Great - EditAccountDetails', {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching account details. Please try again later.');
  }
};

// Update user account details
exports.updateAccountDetails = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { firstName, lastName, username, email, currentPassword, newPassword, confirmPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Check if current password is correct
    if (currentPassword) {
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).send('Current password is incorrect.');
      }
    }

    // Check if new password and confirm password match
    if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).send('New passwords do not match.');
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.email = email || user.email;

    // Hash new password if provided
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.redirect('/myaccount');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating account details. Please try again later.');
  }
};
