/**
 * FoosballGameController
 *
 * @description :: Server-side logic for managing Foosballgames
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		return res.view('user/game', {
			layout: 'gameLayout'
		})
	}
};
