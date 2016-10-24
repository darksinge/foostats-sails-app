// facebook app settings - fb.js

module.exports = {
    'appID': process.env.FACEBOOK_APP_ID,
    'appSecret': process.env.FACEBOOK_APP_SECRET,
    'callbackUrl': 'https://foostats.herokuapp.com/login/facebook/callback',
}
