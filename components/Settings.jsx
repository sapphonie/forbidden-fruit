const { SwitchItem } = require('powercord/components/settings');
const { React } = require('powercord/webpack');

// noinspection JSCheckFunctionSignatures
class Settings extends React.PureComponent {
  render () {
    const { getSetting, updateSetting, Manager } = this.props;
    const activeModules = getSetting('activeModules', []);

    return (
      <>
        {
          Object.entries(Manager.Modules)
            .map(([ id, { info: { name, description, disabled } } ]) => (
              <SwitchItem
                value={ activeModules.includes(id) }
                onChange={(v) => {
                  if (v) {
                    activeModules.push(id);
                    Manager.startModule(id);
                  } else {
                    activeModules.splice(activeModules.indexOf(id), 1);
                    Manager.stopModule(id);
                  }
                  updateSetting('activeModules', activeModules);
                }}
                disabled={disabled}
                note={description}
              >{name}</SwitchItem>
            ))
        }
      </>
    );
  }
}

function registerSettings (id, entityID, props) {
  powercord.api.settings.registerSettings(id, {
    label: 'Forbidden Fruit',
    category: entityID,
    render: (props2) => React.createElement(Settings, {
      ...props,
      ...props2
    })
  });
}

module.exports = {
  Settings,
  registerSettings
};
