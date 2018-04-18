const passport = require('passport');

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