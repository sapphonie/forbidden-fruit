/** Spotify Crack
 * @author Juby210#0577
 * @source https://github.com/Juby210/EnhancedDiscord-plugins/blob/master/spotify_crack.js
 */

const Module = require('../Module.js');

/* eslint-disable object-property-newline */
// noinspection JSUnusedGlobalSymbols
module.exports = class SpotifyCrack extends Module {
  get info () {
    return {
      name: 'Spotify Crack',
      author: 'Juby210#0577',
      description: 'Spotify listen along without premium!',
      color: '#0000ff'
    };
  }

  start () {
    const { ActionTypes: { SPOTIFY_PROFILE_UPDATE: type } } = this.getModule([ 'ActionTypes' ], false);
    const { dispatch } = this.getModule([ 'dispatch' ], false);
    const profile = this.getModule([ 'getProfile' ], false);
    const isSpotifyPremium =  this.getModule([ 'isSpotifyPremium' ], false);
    const isPremium = true;

    this.inject(profile, 'getProfile', ([ accountId ], res) => {
      try {
        dispatch({ type, accountId, isPremium });
      } catch {}

      return res;
    });
    this.inject(isSpotifyPremium, 'isSpotifyPremium', () => true);
  }
};
