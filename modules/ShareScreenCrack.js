
const Module = require('../Module.js');

// noinspection JSUnusedGlobalSymbols
module.exports = class ShareScreenCrack extends Module {
  get info () {
    return {
      name: 'Share screen crack',
      description: 'Unlocks the ability to demo in any quality with any FPS'
    };
  }

  start () {
    const user = this.getModule([ 'getCurrentUser' ], false);

    this.inject(user, 'getCurrentUser', (args, res) => {
      res.premiumType = 2;
      return res;
    });
  }
};
