/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

module.exports = {

   index: function(req, res) {
      var user = req.user;
      if (user) {
         return res.view('homepage', {
            user: user
         });
      } else {
         return res.view('homepage');
      }
   },

   docs: function(req, res) {
      var responses = require('../../assets/responses');
      var user = req.user;
      if (user) {
            return res.view('docs', {
               user: user,
               responses: responses
            });
      } else {
         res.view('docs', {responses: responses});
      }
   },

   login: function(req, res) {
      var data = {};

      if (req.cookies.fooError) data.error = req.cookies.fooError;
      if (req.cookies.fooMessage) data.message = req.cookies.fooMessage;

      res.clearCookie('fooError');
      res.clearCookie('fooMessage');

      return res.view('login', data);
   },


}
