const { inject, uninject } = require('powercord/injector');
const { getModule, getModuleByDisplayName } = require('powercord/webpack');

// noinspection JSUnusedGlobalSymbols
module.exports = class Module {
  constructor () {
    this.uninjectIDs = [];
    this.logHead = [ `%c[ForbiddenFruit:${this.constructor.name}]`, 'color: #FF4141;' ];
  }

  unload () {
    if (this.uninjectIDs.length) {
      this.uninjectIDs.forEach(uninject);
      this.log('Module unloaded');
    }
  }

  load () {
    try {
      this.start();
    } catch (err) {
      this.error(err);
      return;
    }

    this.log('Module loaded');
  }

  /**
   * Auto Generation ID and caching for uninject
   * @param args
   */
  inject (...args) {
    const injectId = `forbidden-fruit${this.constructor.name.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`)}-${this.uninjectIDs.length}`;
    inject(injectId, ...args);
    this.uninjectIDs.push(injectId);
  }

  /**
   * wrap for getModule
   */
  getModule (...args) {
    return getModule(...args);
  }

  /**
   * wrap for getModuleByDisplayName
   */
  getModuleByDisplayName (...args) {
    return getModuleByDisplayName(...args);
  }


  log (...msg) {
    console.log(...this.logHead, ...msg);
  }

  warn (...msg) {
    console.warn(...this.logHead, ...msg);
  }

  error (...msg) {
    console.error(...this.logHead, ...msg);
  }
};
