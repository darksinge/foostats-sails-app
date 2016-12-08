


module.exports = function(req, res, next) {
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

      if (user.role == 'admin') {
	      return next();
      }

		return res.status(403).json({
			success: false,
			error: 'user not authorized!'
		});

   });
}
