/**

@description :: UserController.js

*/


module.exports = {

  dashboard: function(req, res) {
      console.log(req.user);
      return res.view('userViews/dashboard', {
          user: req.user
      });
  },

}
