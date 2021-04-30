const { Plugin } = require('powercord/entities');

const { registerSettings } = require('./components/Settings');
const Manager = require('./modules');

// noinspection JSUnusedGlobalSymbols
module.exports = class ForbiddenFruit extends Plugin {
  constructor () {
    super();
    this.Manager = new Manager(this.settings);
  }

  async startPlugin () {
    this.Manager.start();
    registerSettings('forbidden-fruit-settings', this.entityID, { Manager: this.Manager });
  }

  pluginWillUnload () {
    this.Manager.stop();
    powercord.api.settings.unregisterSettings('forbidden-fruit-settings');
  }
};
