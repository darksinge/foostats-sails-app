/**
 * Statistics.js
 *
 * @description :: Statistics model
 * @param {boolean} didWin - denotes whether the associated team in the same row won or lost.
 * @param {model} game - A game
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    game: {
      model: 'game'
    },
    team: {
      model: 'team'
    },
    player: {
      model: 'player'
    },
    didWin: 'boolean',
    playerScore: {
      type: 'integer',
      defaultsTo: 0
    }
  },

};
