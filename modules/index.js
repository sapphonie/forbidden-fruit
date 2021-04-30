/* eslint-disable object-property-newline */
const { readdirSync } = require('fs');
const { resolve } = require('path');

// noinspection JSUnusedGlobalSymbols
module.exports = class ModuleManager {
  constructor (settings) {
    this.settings = settings;
    this.Modules = [];
    this.init();
  }

  init () {
    readdirSync(__dirname)
      .filter((f) => f !== 'index.js')
      .forEach((e) => {
        const Module = require(resolve(__dirname, e));
        const key = e.replace(/.js$/, '');

        this.Modules[key] = new Module();
      });
  }

  start () {
    const activeModules = this.settings.get('activeModules', []);

    Object.keys(this.Modules)
      .filter((id) => activeModules.includes(id))
      .forEach((id) => this.startModule(id));
  }

  stop () {
    Object.keys(this.Modules).forEach((id) => this.stopModule(id));
  }

  startModule (id) {
    this.Modules[id].load();
  }

  stopModule (id) {
    this.Modules[id].unload();
  }
};
