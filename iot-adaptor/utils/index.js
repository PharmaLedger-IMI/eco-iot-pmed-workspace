const getClusterDomainConfig = (domain) => {
    const config = require("../../privatesky/modules/apihub/config");
    return config.getConfig('componentsConfig', 'iot-adaptor', 'domainStrategies', domain);
};

module.exports = {getClusterDomainConfig: getClusterDomainConfig}
