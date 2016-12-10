/**
* Route Mappings
* (sails.config.routes)
*
* Your routes map URLs to views and controllers.
*
* If Sails receives a URL that doesn't match any of the routes below,
* it will check for matching files (images, scripts, stylesheets, etc.)
* in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
* might match an image file: `/assets/images/foo.jpg`
*
* Finally, if those don't match either, the default 404 handler is triggered.
* See `api/responses/notFound.js` to adjust your app's 404 logic.
*
* Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
* flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
* CoffeeScript for the front-end.
*
* For more information on configuring custom routes, check out:
* http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
*/

var responses = require('../assets/responses');

module.exports.routes = {

   /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

   // Certbot - let's encrypt!
   'GET /.well-known/acme-challenge/:id': 'CertbotController.encrypt',

   '/': {
      controller: 'PublicController',
      action: 'index'
   },

   'GET /login': 'PublicController.login',
   'GET /docs': 'PublicController.docs',

   //Login and auth routes
   '/verify': 'AuthController.verifyUserAuth',
   '/auth/facebook': 'AuthController.facebook',
   '/auth/facebook/callback': 'AuthController.facebookCallback',
   '/logout': 'AuthController.facebookLogout',

   // Admin routes
   'GET /admin': 'AdminController.adminDashboard',
   'POST /admin/update/player': 'AdminController.adminUpdate',
   'POST /admin/update': 'AdminController.adminUpdateView',
   'POST /admin/create/player': 'AdminController.adminCreate',
   'GET /admin/create/player': 'AdminController.adminCreateView',
   'POST /admin/delete/player': 'AdminController.adminDelete',
	'GET /admin/createdummies': 'AdminController.createDummies',

   // User routes
   'GET /dashboard': 'UserController.dashboard',
   'POST /dashboard/addconnection': 'UserController.addConnection',
   'POST /dashboard/addteam': 'UserController.addTeam',

   // REST API Routes
   'PUT /players': 'PlayerController.update',
   'GET /player/:id': 'PlayerController.findOne',

   // Dev routes
   '/dev/test': 'DevController.test',

};
