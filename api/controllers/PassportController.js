

module.exports = {

   login: function(req, res) {
      res.view('/');
   },

   dashboard: function(req, res) {
      res.view('/dashboard');
   },

   logout: function(req, res) {
      req.session.user = null;
      req.session.flash = 'You logged out.';
      res.redirect('/');
   },

   facebook: function(req, res) {
      PassportService(req, res, function(err, user) {
         console.log('hata!');
         if (err) return res.serverError(err);
         return res.view('dashboard');
      })
   },

   facebookCallback: function(req, res, next) {
      passport.authenticate('facebook', function(req, res) {
         res.redirect('/dashboard');
      })(req, res, next);
   }

}
