

module.exports = function(req, res, next) {

   // if (process.env.NODE_ENV === 'development') {
   //    console.log('ssl bypass - development mode')
   //    return next();
   // }
   //
   // if (!req.connection.encrypted) {
   //    return res.redirect('https://foostats.herokuapp.com');
   // }

   return next();
}
