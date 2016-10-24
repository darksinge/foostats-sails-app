/**
 * Achievement.js
 *
 * @description :: Achievement Model
 * @param {string} id - achievement ID
 * @param {string} title - public facing title of achievement
 * @param {string} preEarnedDescription - the description of the achievement the player will see before earning the achievement
 * @param {string} earnedDescription - the description of the achievement the player will see after earning the achievement
 * @param {integer} pointValue - the value of the achievment when unlocked
 * @param {boolean} hasQualifers - boolean value indicating if certain criteria must be met before achievment can be earned
 * @param {datetime} eligibilityDate - the inital eligibility date of achievement if a time requirement must be fulfilled before achievement is awarded
 * @param {datetime} earnedDate - the date the achievement was officially awarded
 * @param {collection} players - the players who have earned the achievment
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true,
      unique: true
    },
    title: 'string',
    preEarnedDescription: 'string',
    earnedDescription: 'string',
    pointValue: 'integer',
    hasQualifiers: 'boolean',
    players: {
      collection: 'player',
      via: 'players',
      through: 'playerachievement'
    }
  }
};
