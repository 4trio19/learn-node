const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'});
};

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'});
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name jabroni').notEmpty();
  req.checkBody('email', 'That email is not valid jabroni').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'No blank passwords jabroni').notEmpty();
  req.checkBody('password-confirm', 'Please confirm PW jabroni').notEmpty();
  req.checkBody('password-confirm', 'Oops!  Password Mismatch jabroni').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};