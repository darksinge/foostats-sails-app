/**

@description :: InterfaceController.js - handles all non API related routes (e.g., '/')

*/

module.exports = {

   index: function(req, res) {
      res.view('homepage')
   },

   docs: function(req, res) {
      res.view('docs', {responses: require('../../assets/responses')});
   },
}
