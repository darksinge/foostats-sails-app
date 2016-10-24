// FacebookService.js

var request = require('request'),
    Promise = require('bluebird');


// api/services/FacebookService.js
module.exports = {


    /**
    * @param - options: an object that must contain the uuid of the user being
    *   updated (the updatee), AND the access_token of the user performing the update.
    * @param - done: the callback function. Takes one argument as an error. If error
    *   is null, the user has been authorized.
    */
    resolveUserCRUDAuths: function(options, done) {

        // First check to see if the updatee exists.
        //
        // @param - updatingUser is the uuid of the updatee.
        Player.findOne(options.updateeId).exec(function(err, updatee) {
            if (err) return res.serverError(err);

            if (!updatee) return done(new Error('player \"updatee\" not found.'))

            FacebookService.resolveAccessTokenOwnerAsync(options)
            .then(function(user) {
                // If the email provided by the facebook graph api matches
                // a user's email in the database who is either an admin, or
                // the updatee, invoke the callback without an error.
                if (user.role == 'admin' || user.email == updatee.email) {
                    return done();
                }
                // user did not meet editing permission criteria
                return done(new Error('user not authorized!'));

            }).catch(function(err) {
                return done(err);
            });
        });

    },

    // Checks that an access token matches a user in the database and returns a player object if found.
    resolveAccessTokenOwner: function(options, done) {

        if (!options.access_token) return done(new Error('Access token was not provided!'))

        FacebookService.fetchFacebookUser(options, function(err, facebookUser) {
            if (err) return done(err);

            Player.findOne({email: facebookUser.email}).exec(function (err, player){
                if (err) return done(err);

                if (!player) return done(new Error('player not found.'));

                return done(null, player);
            });
        })
    },

    /**
    * @description - Queries the facebook graph API for a user email and name.
    * @param {options}: object that contains a user access token.
    * @param {done}: The callback. Takes two arguments, an error, and an object
    *     containing a user email and name.
    */
    fetchFacebookUser: function(options, done) {

        request('https://graph.facebook.com/v2.8/me?fields=id%2Cemail%2Cname&access_token=' + options.access_token, function(error, response, body) {
            if (error) return done(error);

            var facebookUser = JSON.parse(body);

            if (facebookUser.error) return done(facebookUser.error);

            if (!facebookUser.email || !facebookUser.name) {
                return done(new Error('graph returned a null value.'))
            }

            return done(null, facebookUser);
        });
    },

    checkLoginState: function() {

    }


};
