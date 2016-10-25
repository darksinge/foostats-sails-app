/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

module.exports = {

    index: function(req, res) {
        var uuid = undefined;
        if (req.session) {
            if (req.session.passport) {
                if (req.session.passport.user) {
                    uuid = req.session.passport.user;
                }
            }
        }
        if (uuid) {
            Player.findOne({uuid: uuid}).exec(function(err, player) {
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
        var uuid = undefined;
        if (req.session) {
            if (req.session.passport) {
                if (req.session.passport.user) {
                    uuid = req.session.passport.user;
                }
            }
        }

        if (uuid) {
            Player.findOne({uuid: uuid}).exec(function(err, player) {
                if (err || !player) return res.serverError(err);
                return res.view('docs', {
                    responses: require('../../assets/responses'),
                    user: player
                });
            });
        } else {
            res.view('docs', {responses: require('../../assets/responses')});
        }
    },
}
