

module.exports = {

    fetchPlayer(req, done) {
        var accessToken = req.headers.access_token || req.cookies.access_token;

        if (!accessToken) {
            return done(new Error('uuid is undefined.'));
        }

        Player.findOne({facebookToken: accessToken}).exec(function(err, player) {
            if (err) return done(err);
            return done(null, player);
        });
    }

}
