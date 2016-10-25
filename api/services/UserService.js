

module.exports = {

    fetchPlayer(req, cb) {
        var accessToken = req.headers.access_token || req.cookies.access_token;

        if (!uuid) {
            return cb(new Error('uuid is undefined.'));
        }

        Player.findOne({facebookToken: accessToken}).exec(function(err, player) {
            if (err) return cb(err);
            return cb(null, player);
        });
    }

}
