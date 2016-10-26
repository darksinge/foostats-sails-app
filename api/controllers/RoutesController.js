/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

module.exports = {

   index: function(req, res) {
      var token = req.cookies.access_token ? req.cookies.access_token : req.headers.access_token || '';
      if (token) {
         Player.findOne({facebookToken: token}).exec(function(err, player) {
            if (err) return res.serverError(err);

            var data = {};

            if (!player)  {
               data.error = 'user not found.'
            } else {
               data.user = player;
            }

            return res.view('homepage', data);
         });
      } else {
         res.view('homepage')
      }
   },

   docs: function(req, res) {
      var responses = require('../../assets/responses')
      var token = req.cookies.access_token ? req.cookies.access_token : req.headers.access_token || '';
      if (token) {
         // Used to set up navbar for authenticated users.
         Player.findOne({facebookToken: token}).exec(function(err, player) {
            if (err) return res.serverError(err);
            var data = {};
            data.responses = responses;
            if (player) data.player = player
            return res.view('docs', data);
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
