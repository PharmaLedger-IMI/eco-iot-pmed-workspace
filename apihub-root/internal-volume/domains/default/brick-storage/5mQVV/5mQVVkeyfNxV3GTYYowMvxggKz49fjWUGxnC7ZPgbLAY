class DossierExplorerService {

    constructor() {
        const HostBootScript = require("boot-host").HostBootScript;
        const HostPC = new HostBootScript("dossier-explorer");
    }

    readDir(path, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {
                withFileTypes: false
            };
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "readDir", path, options)
            .onReturn(callback);
    }

    readDirDetailed(path, callback) {
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "start", path)
            .onReturn(callback);
    }

    hasFile(path, fileName, callback) {
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "hasFile", path, fileName)
            .onReturn(callback);
    }

    createDossier(path, dossierName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "attachDossier", "start", path, dossierName)
            .onReturn(callback);
    }

    getDSUSeedSSI(path, dossierName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "getSSI", "getSeedSSI", path, dossierName)
            .onReturn(callback);
    }

    getDSUSReadSSI(path, dsuName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "getSSI", "getSReadSSI", path, dsuName)
            .onReturn(callback);
    }

    addMarketplace(marketplaceData, callback) {
        $$.interaction.startSwarmAs("test/agent/007", "marketplaceSwarm", "createMarketplace", marketplaceData)
            .onReturn(callback);
    }

    importMarketplace(marketplaceKeySSI, callback) {
        $$.interaction.startSwarmAs("test/agent/007", "marketplaceSwarm", "importMarketplace", marketplaceKeySSI)
            .onReturn(callback);
    }

    listMarketplaces(callback) {
        $$.interaction.startSwarmAs("test/agent/007", "marketplaceSwarm", "listMarketplaces")
            .onReturn(callback);
    }

    removeMarketplace(marketplaceData, callback) {
        $$.interaction.startSwarmAs("test/agent/007", "marketplaceSwarm", "removeMarketplace", marketplaceData)
            .onReturn(callback);
    }
}

let dossierExplorer = new DossierExplorerService();
let getDossierServiceInstance = function() {
    return dossierExplorer;
};

export {
    getDossierServiceInstance
};