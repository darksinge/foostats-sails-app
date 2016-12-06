


module.exports = function(req, res, next) {
   // req.headers.authorization = 'JWT ' + req.cookies.jwtToken;
   //
   // passport.authenticate('jwt', function(err, user, info) {
   //    if (err) {
   //       return res.status(500).json({
   //          error: err,
   //          info: info,
   //          success: false
   //       });
   //    }
   //
   //    if (!user) {
   //       // if (req.wantsJSON) {
   //          return res.json({
   //             success: false,
   //             info: info,
   //             error: 'user not found'
   //          });
   //       // } else {
   //          // return res.redirect('/login');
   //       // }
   //    }
   //
   //    if (user.role != 'admin') {
   //       return res.status(403).json({
   //          success: false,
   //          info: info,
   //          error: 'user not authorized to access this route'
   //       });
   //    }
   //
   //    req.user = user;
   //    return next();
   // })(req, res);
   if (!req.user) {
      return res.status(403).json({
         success: false,
         info: info,
         error: 'user not authorized to access this route'
      });
   }

   Player.findOne({uuid: req.user.uuid}).exec(function(err, user) {
      if (err) {
         return res.json({
            success: false,
            error: err
         });
      }

      if (!user) {
         return res.status(500).json({
            success: false,
            error: 'user not found!'
         });
      }

      if (user.role != 'admin') {
         return res.status(403).json({
            success: false,
            error: 'user not authorized!'
         });
      }

      return next();

   });
}
