/**
 * @author Joe 🎸#7070
 * @source https://github.com/joe27g/EnhancedDiscord/blob/master/plugins/hidden_channels.js
 */

const Module = require('../Module.js');

// noinspection JSUnusedGlobalSymbols
module.exports = class HiddenChannels extends Module {
  get info () {
    return {
      name: 'Hidden Channels',
      description: 'Shows hidden channels and lets you view server permissions.',
      color: 'magenta',
      author: 'Joe 🎸#7070',
      disabled: true
    };
  }

  start () {
    const dispatch = this.getModule([ 'dispatch' ], false);
    const { getChannel } = this.getModule([ 'getChannel' ], false);
    const sw = this.getModule([ 'switchItem' ], false);
    const g = this.getModule((m) => m.group && m.item, false);
    const ai = this.getModule([ 'actionIcon' ], false);

    const { getCurrentUser } = this.getModule([ 'getCurrentUser' ], false);
    const { getMutableGuildChannels } = this.getModule([ 'getMutableGuildChannels' ], false);
    const { can } = this.getModule([ 'computePermissions' ], false);

    const chanM = this.getModule((m) => m.prototype && m.prototype.isManaged, false);

    const g_dc = this.getModule([ 'getDefaultChannel' ], false);
    const g_cat = this.getModule((m) => m.getCategories && !m.EMOJI_NAME_RE, false);
    const ha = this.getModule([ 'hasUnread' ], false).__proto__;
    const fm = this.getModule([ 'fetchMessages' ], false);

    chanM.prototype.isHidden = function () {
      return [ 0, 4, 5 ].includes(this.type) && !can({ data: 1024n }, getCurrentUser(), this);
    };

    this.inject(g_dc, 'getChannels', ([ gId ], res) => {
      const allChans = getMutableGuildChannels();

      if (!gId) {
        return res;
      }
      res.HIDDEN = allChans.filter(((id, i) => {
        if (allChans[i].guild_id === gId) {
          if (allChans[i].type !== 4 && !can({ data: 1024n }, getCurrentUser(), getChannel(allChans[i].id))) {
            return true;
          }
        }
        return false;
      }));

      return res;
    });

    this.inject(g_cat, 'getCategories', ([ ids ], res) => {
      const chs = g_dc.getChannels(ids);

      chs.HIDDEN.forEach((c) => {
        const result = res[c.parent_id || 'null'].filter((item) => item.channel.id === c.id);

        if (result.length) {
          return; // already added
        }
        res[c.parent_id || 'null'].push({
          channel: c,
          index: 0
        });
      });
      return res;
    });

    this.inject(ha, 'hasUnread', ([ id ], res) => {
      if (getChannel(id) && getChannel(id).isHidden()) {
        return false; // don't show hidden channels as unread.
      }
      return res;
    });
    this.inject(ha, 'hasUnreadPins', ([ id ], res) => {
      if (getChannel(id) && getChannel(id).isHidden()) {
        return false; // don't show icon on hidden channel pins.
      }
      return res;
    });
    this.inject(fm, 'fetchMessages', ([ id ], res) => {
      if (getChannel(id) && getChannel(id).isHidden()) {
        return;
      }
      return res;
    });

    // const clk = this.getModuleByDisplayName('Clickable');
    // const Tooltip = this.getModule('TooltipContainer').TooltipContainer;
    // const { Messages } = window.this.getModule('Messages');
    // const getIcon = window.this.getModule((m) => m.id && typeof m.keys === 'function' && m.keys().includes('./Gear'));
    // const Gear = getIcon('./Gear').default;
    //
    // reb = window.this.getModule((m) => m.default && m.default.prototype && m.default.prototype.renderEditButton).default.prototype;
    // window.inject(reb, 'renderEditButton', (b) => window.EDApi.React.createElement(Tooltip, { text: Messages.EDIT_CHANNEL }, window.EDApi.React.createElement(clk, {
    //   className: ai.iconItem,
    //   onClick () {
    //     module.exports._editingGuild = null;
    //     module.exports._editingChannel = b.thisObject.props.channel.id;
    //     return b.thisObject.handleEditClick.apply(b.thisObject, arguments);
    //   },
    //   onMouseEnter: b.thisObject.props.onMouseEnter,
    //   onMouseLeave: b.thisObject.props.onMouseLeave
    // }, window.EDApi.React.createElement(Gear, {
    //   width: 16,
    //   height: 16,
    //   className: ai.actionIcon
    // }))));
    //
    // sv = this.getModuleByDisplayName('SettingsView').prototype;
    // inject(sv, 'getPredicateSections', { before: (b) => {
    //   const permSect = b.thisObject.props.sections.find((item) => item.section === 'PERMISSIONS');
    //   if (permSect) {
    //     permSect.predicate = () => true;
    //   }
    // },
    // silent: true });
    //
    // cs = this.getModuleByDisplayName('FluxContainer(ChannelSettings)').prototype;
    // inject(cs, 'render', (b) => {
    //   const egg = b.callOriginalMethod(b.methodArguments);
    //   egg.props.canManageRoles = true;
    //   return egg;
    // });
    //
    // csp = this.getModuleByDisplayName('FluxContainer(ChannelSettingsPermissions)').prototype;
    // inject(csp, 'render', (b) => {
    //   const egg = b.callOriginalMethod(b.methodArguments);
    //   const chan = getChannel(egg.props.channel.id);
    //   if (!chan || !chan.isHidden()) {
    //     return egg;
    //   }
    //   egg.props.canSyncChannel = false;
    //   egg.props.locked = true;
    //   setTimeout(() => {
    //     document.querySelectorAll(`.${g.group}`).forEach((elem) => elem.style = 'opacity: 0.5; pointer-events: none;');
    //   });
    //   return egg;
    // });
    //
    // const cancan = this.getModuleByProps('can').can;
    // gsr = this.getModuleByDisplayName('FluxContainer(GuildSettingsRoles)').prototype;
    // inject(gsr, 'render', (b) => {
    //   const egg = b.callOriginalMethod(b.methodArguments);
    //   const hasPerm = cancan({ data: 268435456n }, { guildId: egg.props.guild.id });
    //   if (hasPerm) {
    //     return;
    //   }
    //   setTimeout(() => {
    //     document.querySelectorAll(`.${sw.switchItem}`).forEach((elem) => elem.classList.add(sw.disabled));
    //   });
    //   return egg;
    // });
    //
    // const { getGuild } = this.getModule('getGuild');
    // pf = this.getModuleByDisplayName('PermissionsForm').prototype;
    // inject(pf, 'render', (b) => {
    //   const egg = b.callOriginalMethod(b.methodArguments);
    //   const guild = module.exports._editingGuild ? getGuild(module.exports._editingGuild) : null;
    //   const channel = module.exports._editingChannel ? getChannel(module.exports._editingChannel) : null;
    //   if (!guild && !channel) {
    //     return egg;
    //   }
    //   const hasPerm = cancan({ data: 268435456n }, guild ? { guildId: guild.id } : { channelId: channel.id });
    //   if (hasPerm) {
    //     return egg;
    //   }
    //
    //   if (!egg.props.children || !egg.props.children[1]) {
    //     return egg;
    //   }
    //   egg.props.children[1].forEach((item) => {
    //     item.disabled = true; item.props.disabled = true;
    //   });
    //   return egg;
    // });

    // dispatch.subscribe('CHANNEL_SELECT', module.exports.dispatchSubscription);
  }

  unload () {
    // dispatch.unsubscribe('CHANNEL_SELECT', module.exports.dispatchSubscription);
    super.unload();
  }

  dispatchSubscription (data) {
    if (data.type !== 'CHANNEL_SELECT') {
      return;
    }

    if (getChannel(data.channelId) && getChannel(data.channelId).isHidden()) {
      setTimeout(module.exports.attachHiddenChanNotice);
    }
  }

  attachHiddenChanNotice () {
    const messagesWrapper = document.querySelector(`.${this.getModule('messagesWrapper').messagesWrapper}`);
    if (!messagesWrapper) {
      return;
    }

    messagesWrapper.firstChild.style.display = 'none'; // Remove messages shit.
    messagesWrapper.parentElement.children[1].style.display = 'none'; // Remove message box.
    messagesWrapper.parentElement.parentElement.children[1].style.display = 'none'; // Remove user list.

    const toolbar = document.querySelector(`.${this.getModule((m) => {
      if (m instanceof Window) {
        return;
      }
      if (m.toolbar && m.selected) {
        return m;
      }
    }).toolbar}`);

    toolbar.style.display = 'none';

    const hiddenChannelNotif = document.createElement('div');

    // Class name modules
    const txt = this.getModule('h5');
    const flx = this.getModule('flex');

    hiddenChannelNotif.className = flx.flexCenter;
    hiddenChannelNotif.style.width = '100%';

    hiddenChannelNotif.innerHTML = `
        <div class="${flx.flex} ${flx.directionColumn} ${flx.alignCenter}">
        <h2 class="${txt.h2} ${txt.defaultColor}">This is a hidden channel.</h2>
        <h5 class="${txt.h5} ${txt.defaultColor}">You cannot see the contents of this channel. However, you may see its name and topic.</h5>
        </div>`;

    messagesWrapper.appendChild(hiddenChannelNotif);
  }
};
