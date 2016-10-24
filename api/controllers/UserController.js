/**

@description :: UserController.js

*/


module.exports = {

  dashboard: function(req, res) {
    return res.view('user_views/dashboard');
  },

}
