const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login Jabroni!',
  successRedirect: '/',
  successFlash: 'Successful Login Jabroni'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You logged out Jabroni 🍍');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    next();
    return;
  }
  req.flash('error', 'Log in Jabroni 🍍');
  res.redirect('/login');
};

exports.forgot = async(req, res) => {
  // see if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account jabroni');
    return res.redirect('/login');
  }
  // set reset token and expiry
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  // Send email with token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

  req.flash('success', `You have been emailed a password reset link ${resetURL}`);
  // Redirect to login page

  res.redirect('/login');
};

exports.reset = async(req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Token invalid or expired jabroni');
    return res.redirect('/login');
  }

  res.render('reset', {title: 'Reset Your Password'});

};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['confirm-password']) {
    next();
    return;
  }
  req.flash('error', 'Passwords dont match jabroni');
  res.redirect('back');
};

exports.update = async(req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Token invalid or expired jabroni');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', '💃 You reset your password jabroni');
  res.redirect('/');
};