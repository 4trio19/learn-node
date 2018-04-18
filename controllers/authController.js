const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login Jabroni!',
  successRedirect: '/',
  successFlash: 'Successful Login Jabroni'
});