

module.exports = {

    fetchPlayer(options, done) {

        Player.findOne({facebookToken: options.accessToken}).exec(function(err, player) {
            if (err) return done(err);
            if (!player) {
               Player.findOne({facebookId: options.id}).exec(function(err, player) {
                  if (err) return done(err);
                  return done(null, player);
               });
            } else {
               return done(null, player);
            }
        });
    }

}
