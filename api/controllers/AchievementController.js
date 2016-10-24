/**
* AchievementController
*
* @description :: Server-side logic for managing Achievements
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*
* To override a RESTful blueprint route for a single controller, simply create
* an action in that controller with the appropriate name: find, findOne, create,
* update, destroy, populate, add or remove.
* See https://github.com/balderdashy/sails/tree/master/lib/hooks/blueprints/actions.
*
* To override the default action that all controllers use, create an
* api/blueprints folder and  add files to it with names matching the actions to
* override (e.g. find.js, findone.js, create.js, etc.). You can take a look at
* the code for the default actions in the Sails blueprints hook for a head
* start.

*/

module.exports = {

   /**
   * `AchievementController.create()`
   */
   create: function (req, res) {

      var achievements = require('../models/Achievements/achievementDefs').definitions();
      var didCreateAchievement = false
      var keys = []

      for (var key in achievements) {
         keys.push(key)
      }

      var loop = function(count) {
         if (count > keys.length - 1) {
            return res.json({
               success: true,
               AchievementCount: count,
               didCreateAchievement: didCreateAchievement,
               message: 'Please contact an Administrator to add achievements to the database.'
            })
         }

         var key = keys[count++]



         Achievement.findOne({
            id:key
         }).exec(function (err, achiev){
            if (err) { return res.serverError(err) }
            if (!achiev) {
               didCreateAchievement = true
               console.log('Creating new achievement: ' + key)
               var values = {
                  id: key,
                  title: achievements[key]['title'],
                  preEarnedDescription: achievements[key]['preEarnedDescription'],
                  earnedDescription: achievements[key]['earnedDescription'],
                  pointValue: achievements[key]['pointValue'],
                  hasQualifiers: achievements[key]['qualifiers'] != null
               }

               Achievement.create(values).exec(function (err, achiev) {
                  if (err) { return res.serverError(err); }
                  sails.log('Created new achievement');
                  return loop(count);
               })
            } else {
               console.log('Achievement verified: ' + key)
               return loop(count)
            }
         })
      }

      var count = 0
      return loop(count)

   },


   /**
   * `AchievementController.update()`
   */
   update: function (req, res) {
      return res.json({
         todo: 'update() is not implemented yet!'
      });
   },

   destroy: function(req, res) {
      // return res.forbidden('You are not permitted to perform this action.');
      Achievement.destroy().exec(function (error){
         if (error) res.negotiate(error);
         sails.log('Deleted all achievements');
         return res.json({
            success: 'true',
         });
      });
   }




};
