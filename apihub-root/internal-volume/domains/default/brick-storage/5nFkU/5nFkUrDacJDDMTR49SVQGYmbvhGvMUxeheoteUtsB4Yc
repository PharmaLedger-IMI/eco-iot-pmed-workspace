import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Constants from "./Constants.js";

import {getDossierServiceInstance} from "../service/DossierExplorerService.js"
import {getAccountServiceInstance} from "../service/AccountService.js";

import signOutViewModel from "../view-models/modals/signOutViewModel.js";

export default class WalletController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.DossierExplorerService = getDossierServiceInstance();

        element.addEventListener("sign-out", this._signOutFromWalletHandler);
        element.addEventListener("getSSApps", this._getSSAppsHandler);

        this._registerDefaultMarketplace();
    }

    _getSSAppsHandler = (event) => {
        if (typeof event.getEventType === "function" &&
            event.getEventType() === "PSK_SUB_MENU_EVT") {

            let callback = event.data.callback;
            let pathPrefix = event.data.pathPrefix;
            if (typeof callback !== "function") {
                throw new Error("Callback should be a function");
            }

            this.DossierExplorerService.readDirDetailed(Constants.APPS_FOLDER, (err, {applications}) => {
                if (err) {
                    return callback(err);
                }

                let mountedApplications = [];
                let chain = (appNamesList) => {
                    if (!appNamesList.length) {
                        return callback(err, mountedApplications);
                    }

                    let appName = appNamesList.pop();
                    this.DossierExplorerService.getDSUSeedSSI(Constants.APPS_FOLDER, appName, (err, appSSI) => {
                        if (err) {
                            console.error(err);
                            return chain(appNamesList);
                        }

                        let app = this._getApplicationTemplate();
                        app.name = appName;
                        app.path = pathPrefix + "/" + appSSI;
                        app.componentProps.appName = appName;
                        app.componentProps.keySSI = appSSI;
                        mountedApplications.push(app);
                        chain(appNamesList);
                    });
                };

                chain(applications);
            });
        }
    };

    _getApplicationTemplate() {
        return {
            exact: false,
            component: "psk-ssapp",
            componentProps: {}
        };
    }

    _getMaketplaceAppTemplate(appName) {
        let appDetails = {};
        if (this.defaultMarketplaceData && this.defaultMarketplaceData[appName]) {
            appDetails = this.defaultMarketplaceData[appName];
        }

        return {
            keySSI: "",
            visible: true,
            installed: true,
            ...appDetails
        }
    }

    _signOutFromWalletHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.showModal("signOutModal", signOutViewModel, (err, preferences) => {
            if (!err) {
                getAccountServiceInstance().signOut(preferences);
            }
        });
    };

    _getMaketplaceDefaultData(callback) {
        this.DossierExplorerService.hasFile("/code", "defaultMarketplaceData", (err, hasFile) => {
            if (err) {
                return callback(err);
            }

            if (!hasFile) {
                return callback(undefined, {});
            }

            this.DSUStorage.getObject("/code/defaultMarketplaceData", (err, marketplaceData) => {
                callback(err, marketplaceData);
            });
        });
    }

    _registerDefaultMarketplace() {
        this._getMaketplaceDefaultData((err, marketplaceData) => {
            if (err) {
                return console.error(err);
            }

            if (Object.keys(marketplaceData).length === 0) {
                console.log("[REGISTERING DEFAULT MARKETPLACE] defaultMarketplaceData is emnpty!");
                return;
            }

            this.defaultMarketplaceData = JSON.parse(JSON.stringify(marketplaceData));
        });

        const defaultMarketplacePath = `${Constants.APPS_FOLDER}/${Constants.MARKETPLACE_SSAPP}${Constants.AVAILABLE_APPLICATIONS_MARKETPLACE}`;
        this.DossierExplorerService.readDir(defaultMarketplacePath, (err, defaultMarketplaceContent) => {
            if (err) {
                return console.error(err);
            }

            if (!defaultMarketplaceContent.length) {
                const defaultMarketplaceData = {
                    name: Constants.DEFAULT_MARKETPLACE,
                    description: Constants.DEFAULT_MARKETPLACE
                };

                this._setDefaultMarketplace(defaultMarketplaceData);
            }
        });
    }

    _setDefaultMarketplace(marketplaceData) {
        this.DossierExplorerService.getDSUSeedSSI(Constants.APPS_FOLDER, Constants.MARKETPLACE_SSAPP, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }

            this.DossierExplorerService.importMarketplace(keySSI, (err, marketplaceInformation) => {
                if (err) {
                    return console.error(err);
                }

                marketplaceData.keySSI = keySSI;
                const dataPath = `${Constants.APPS_FOLDER}/${Constants.MARKETPLACE_SSAPP}/data`;
                this.DSUStorage.setObject(dataPath, marketplaceData, (err) => {
                    if (err) {
                        return console.error(err);
                    }

                    this._addDefaultApplications(marketplaceInformation.path);
                });
            });
        });
    }

    _addDefaultApplications(marketplacePath) {
        this.DossierExplorerService.readDirDetailed(Constants.APPS_FOLDER, (err, {applications}) => {
            if (err) {
                return console.error(err);
            }

            let chain = (appNamesList) => {
                if (!appNamesList.length) {
                    return;
                }

                let appName = appNamesList.pop();
                if (Constants.EXCLUDED_APPS_FOR_REGISTER.indexOf(appName) !== -1) {
                    return chain(appNamesList);
                }

                this.DossierExplorerService.getDSUSReadSSI(Constants.APPS_FOLDER, appName, (err, sReadSSI) => {
                    if (err) {
                        console.error(err);
                        return chain(appNamesList);
                    }

                    this._registerApp(marketplacePath, appName, sReadSSI, (err) => {
                        if (err) {
                            console.error(err, appName);
                        }

                        chain(appNamesList);
                    });
                });
            };

            chain(applications);
        });
    }

    _registerApp(marketplacePath, appName, sReadSSI, callback) {
        const appTemplate = this._getMaketplaceAppTemplate(appName);
        appTemplate.keySSI = sReadSSI;

        const availableAppsPath = marketplacePath + Constants.AVAILABLE_APPLICATIONS_MARKETPLACE;
        this.DossierExplorerService.createDossier(availableAppsPath, appName, (err) => {
            if (err) {
                return callback(err);
            }

            const dataPath = `${availableAppsPath}/${appName}/data`;
            this.DSUStorage.setObject(dataPath, appTemplate, (err) => {
                if (err) {
                    return callback(err);
                }

                const appDataPath = `${Constants.APPS_FOLDER}/${appName}/appData`;
                appTemplate.ssappData = {
                    name: appName,
                    keySSI: sReadSSI
                };
                this.DSUStorage.setObject(appDataPath, appTemplate, (err) => {
                    return callback(err)
                });
            });
        });
    }
}