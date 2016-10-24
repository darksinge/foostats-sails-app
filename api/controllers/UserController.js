/**

@description :: UserController.js

*/


module.exports = {

  dashboard: function(req, res) {
      console.log('got to dashboard!');
    return res.view('user_views/dashboard');
  },

}
