/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

var responses = require('../../assets/responses');

module.exports = {

   index: function(req, res) {
      res.view('homepage')
   },

   docs: function(req, res) {
      res.view('docs', {responses: responses});
   },
}
