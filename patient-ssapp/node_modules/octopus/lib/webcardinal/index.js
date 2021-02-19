const { tag } = require('./config');

module.exports = {
    TAG: tag,
    Runner: require('./bin/WrappedRunner'),
    Installer: require('./bin/Installer'),
    Builder: require('./bin/Builder'),
    ThemeBuilder: require('./bin/ThemeBuilder')
};