/**
 * Achievement.js
 *
 * @description :: achievement definitions
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  definitions: function(){

    var achievements = {};
    
    achievements['topDefender'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 25,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['top3Defender'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 15,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['topWinRatio'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 25,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['top3WinRatio'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 15,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['topAverageScore'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 30,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['top3AverageScore'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 15,
      requirements: {
        timeRequirement: 60*60*24*7,
      }
    }

    achievements['winGame'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['win5Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['win10Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['win25Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['win50Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 10,
    }

    achievements['win100Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 20,
    }

    achievements['win250Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 50,
    }

    achievements['win500Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 100,
    }

    achievements['win4PlayerGame10-0'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 20,
      requirements: {
        is2Player: false,
        is4Player: true
      }
    }

    achievements['win2PlayerGame10-0'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 20,
      requirements: {
        is2Player: true,
        is4Player: false
      }
    }

    achievements['skunkOpponenet'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 15,
    }

    achievements['makeComback'] = {
      title: 'Die Another Day',
      preEarnedDescription: 'Be losing a game by 6 or more points, then come back and win.',
      earnedDescription: 'Won a game after coming back from losing by 6 or more points.',
      pointValue: 10,
    }

    achievements['winGameIn5Minutes'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 15,
    }

    achievements['winGameIn10Minutes'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 10,
    }

    achievements['winGameIn15Minutes'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play1Game'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play5Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play10Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play25Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play50Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['play100Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 10,
    }

    achievements['play250Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 10,
    }

    achievements['play500Games'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 20,
    }

    achievements['play1000Games'] = {
      title: 'Completely... obsessed...',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 50,
    }

    achievements['win3GameStreak'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
    }

    achievements['win5GameStreak'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 10,
    }

    achievements['win10GameStreak'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 20,
    }

    achievements['winBeforeOpponentSwitch'] = {
      title: 'string',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
      requirements: {
        minPlayers: 4
      }
    }

    achievements['dontLetOpponentScore'] = {
      title: 'Ardent Defender',
      preEarnedDescription: 'string',
      earnedDescription: 'string',
      pointValue: 5,
      requirements: {
        minPlayers: 4
      }
    }

    return achievements;
  }
}

return module.exports
