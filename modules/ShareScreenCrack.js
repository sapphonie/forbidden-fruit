const Module = require('../Module.js');

/* eslint-disable object-property-newline */
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

    this.inject(user, 'getCurrentUser', (_, res) => {
      const newRes = Object.create(res);
      newRes.premiumType = 2;

      return newRes;
    });
  }
};
