

module.exports = {

  facebookLogout: function(req, res) {
    req.session.user = null;
    req.session.flash = 'You have logged out';
    return res.redirect('/admin');
  },

  facebook: function(req, res) {
    passport.authenticate('facebook', { scope: ['email', 'name']}, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          req.session.flash = 'There was an error';
          return res.redirect('/admin');
        } else {
          req.session.user = user;
          res.redirect('/admin/dashboard');
        }
      });
    })(req, res, function(err, user) {
      return res.send('heyo!')
    });
  },

  facebookCallback: function (req, res) {
    passport.authenticate('facebook',
    function (req, res) {
      res.redirect('/user/dashboard');
    })(req, res, function(err, user) {
      return res.send('heyo!')
    });
  }

}
