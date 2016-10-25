

module.exports = {

    fetchPlayer(req, cb) {
        var uuid = undefined;
        if (req.session) {
            if (req.session.passport) {
                if (req.session.passport.user) {
                    uuid = req.session.passport.user;
                }
            }
        }

        if (!uuid) {
            return cb(new Error('uuid is undefined.'));
        }

        Player.findOne({uuid: uuid}).exec(function(err, player) {
            if (err) return cb(err);
            return cb(null, player);
        });
    }

}
