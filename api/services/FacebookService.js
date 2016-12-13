// FacebookService.js

var request = require('request');
var Promise = require('bluebird');

/**
* @description - Queries the facebook graph API for a user email and name.
* @param {options}: object that contains a user access token.
* @param {done}: The callback. Takes two arguments, an error, and an object
*     containing a user email and name.
*/
function fetchFacebookUser(options, done) {
   request('https://graph.facebook.com/v2.8/me?fields=id%2Cemail%2Cname&access_token=' + options.access_token, function(error, response, body) {
      if (error) return done(error);
      var facebookUser = JSON.parse(body);
      if (facebookUser.error) return done(new Error(facebookUser.error));
      if (!facebookUser.email || !facebookUser.name || !facebookUser.id) {
         return done(new Error('Graph response error: id, name, or email is undefined.'));
      }
      return done(null, facebookUser);
   });
};

module.exports = {

   // returns bluebird Promise.
   verifyAccessToken: function(accessToken) {
      return new Promise(function(resolve, reject) {
         if (!accessToken) return reject(new Error('Access token not provided!'));
         fetchFacebookUser({access_token: accessToken}, function(err, facebookUser) {
            if (err) return reject(err);
            Player.findOne({facebookId: facebookUser.id}).exec(function(err, player) {
               if (err) return reject(err);
               if (!player) return reject(new Error('Invalid facebook id, player not found.'));
               return resolve(player);
            });
         });
      });
   },

};
