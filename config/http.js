/**
* HTTP Server Settings
* (sails.config.http)
*
* Configuration for the underlying HTTP server in Sails.
* Only applies to HTTP requests (not WebSockets)
*
* For more information on configuration, check out:
* http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
*/

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy

    var verifyHandler = function(acessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            var values = profile._json;
            Player.findOne({email: values.email}, function(err, user) {

                if (err) {
                    return done(err);
                } else if (user) {
                    return done(null, user);
                } else {
                    var newUser = {};

                    newUser.facebookId    = values.id;
                    newUser.facebookToken = acessToken;
                    newUser.name          = values.name;
                    newUser.email         = values.email;

                    Player.create(newUser).exec(function(err, user) {
                        if (err) return done(err);
                        sails.log.info('Created new user!');
                        return done(null, user);
                    });
                }
            });
        });
    };

    passport.serializeUser(function(user, done) {
        console.log('SERIALIZE: ', user)
        return done(null, user.uuid);
    });

    passport.deserializeUser(function(uuid, done) {
        console.log('DESERIALIZE: ', user)
        Player.findOne({uuid:uuid}).exec(function(err, player) {
            return done(err, player);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.NODE_ENV === 'production' ? 'https://foostats.herokuapp.com/auth/facebook/callback' : 'http://localhost:1337/auth/facebook/callback',
        profileFields: ['id', 'name', 'email']
    }, verifyHandler));

module.exports.http = {

   /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/

   middleware: {


       passportInit: passport.initialize(),
       passportSession: passport.session(),
      /***************************************************************************
      *                                                                          *
      * The order in which middleware should be run for HTTP request. (the Sails *
      * router is invoked by the "router" middleware below.)                     *
      *                                                                          *
      ***************************************************************************/

      order: [
         'startRequestTimer',
         'cookieParser',
         'session',
         'passportInit',
         'passportSession',
         'myRequestLogger',
         'bodyParser',
         'handleBodyParserError',
         'compress',
         'methodOverride',
         'poweredBy',
         '$custom',
         'router',
         'www',
         'favicon',
         '404',
         '500'
      ],

      /****************************************************************************
      *                                                                           *
      * custom middleware
      *                                                                           *
      ****************************************************************************/

      /***************************************************************************
      *                                                                          *
      * The body parser that will handle incoming multipart HTTP requests. By    *
      * default as of v0.10, Sails uses                                          *
      * [skipper](http://github.com/balderdashy/skipper). See                    *
      * http://www.senchalabs.org/connect/multipart.html for other options.      *
      *                                                                          *
      * Note that Sails uses an internal instance of Skipper by default; to      *
      * override it and specify more options, make sure to "npm install skipper" *
      * in your project first.  You can also specify a different body parser or  *
      * a custom function with req, res and next parameters (just like any other *
      * middleware function).                                                    *
      *                                                                          *
      ***************************************************************************/

      // bodyParser: require('skipper')({strict: true})

   },

   /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

   // cache: 31557600000
};
