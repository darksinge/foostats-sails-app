/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

module.exports = {

   index: function(req, res) {
      var token = req.headers.access_token || req.cookies.access_token;
      if (token) {
         Player.findOne({facebookToken: token}).exec(function(err, player) {
            if (err || !player) return res.serverError(err);
            return res.view('homepage', {
               user: player
            });
         });
      } else {
         res.view('homepage')
      }
   },

   docs: function(req, res) {
      var responses = require('../../assets/responses')
      var token = req.headers.access_token || req.cookies.access_token;
      if (token) {
         Player.findOne({facebookToken: token}).exec(function(err, player) {
            if (err || !player) return res.serverError(err);
            return res.view('docs', {
               responses: responses,
               user: player
            });
         });
      } else {
         res.view('docs', {responses: responses});
      }
   },

   login: function(req, res) {
      var locals = {};
      if (req.param('error')) locals.error = req.param('error');
      if (req.param('message')) locals.message = req.param('message');
      return res.view('login', locals);
   },










}
