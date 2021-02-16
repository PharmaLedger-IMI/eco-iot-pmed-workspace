import ContainerController from '../../cardinal/controllers/base-controllers/ContainerController.js';
import SettingsService from "../services/SettingsService.js";
import interpretGS1scan from "../gs1ScanInterpreter/interpretGS1scan/interpretGS1scan.js";
import utils from "../../utils.js";
import constants from "../../constants.js";

const gtinResolver = require("gtin-resolver");

export default class ScanController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.setModel({data: '', hasCode: false, hasError: false, nativeSupport: false});
        this.settingsService = new SettingsService(this.DSUStorage);
        this.history = history;

        this.model.onChange("data", () => {
            this.process(this.model.data);
        });

        this.getNativeApiHandler((err, handler) => {
            if (handler) {
                this.model.nativeSupport = true;
                const scan = handler.importNativeAPI("dataMatrixScan");
                scan().then((resultArray) => {
                    if (resultArray && resultArray.length > 0) {
                        return this.process(resultArray[0]);
                    }
                    this.redirectToError("2dMatrix code scan process finished. No code scanned or process canceled.");
                }, (error) => {
                    switch (error) {
                        case "ERR_NO_CODE_FOUND":
                            this.redirectToError("No GS1 data matrix found.");
                            break;
                        case "ERR_SCAN_NOT_SUPPORTED":
                            this.redirectToError("The code cannot be scanned.");
                            break;
                        case "ERR_CAM_UNAVAILABLE":
                            this.redirectToError("No camera available for scanning.");
                            break;
                        case "ERR_USER_CANCELLED":
                            this.history.push(`${new URL(this.history.win.basePath).pathname}home`);
                            break;
                        default:
                            this.redirectToError("Failed to scan GS1 data matrix.");
                    }
                }).catch((err) => {
                    this.redirectToError("Code scanning and processing finished with errors.");
                });
            } else if (err) {
                console.log("Not able to activate native API support. Continue using bar code scanner from web.", err);
            }
        });
    }

    process(twoDMatrixCode) {
        this.model.hasCode = true;
        let gs1FormatFields;
        try {
            gs1FormatFields = interpretGS1scan.interpretScan(twoDMatrixCode);
        } catch (e) {
            this.redirectToError("Barcode is not readable, please contact pharmacy / doctor who issued the medicine package.", this.parseGs1Fields(e.dlOrderedAIlist));
            return;
        }

        const gs1Fields = this.parseGs1Fields(gs1FormatFields.ol);
        if (!this.hasMandatoryFields(gs1Fields)) {
            this.redirectToError("Barcode is not readable, please contact pharmacy / doctor who issued the medicine package.", gs1Fields);
        }

        this.buildSSI(gs1Fields, (err, gtinSSI) => {
            this.packageAlreadyScanned(gtinSSI, gs1Fields, (err, status) => {
                if (err) {
                    return this.redirectToError("Product code combination could not be resolved.", gs1Fields);
                }
                if (status === false) {
                    this.batchAnchorExists(gtinSSI, (err, status) => {
                        if (status) {
                            this.addPackageToHistoryAndRedirect(gtinSSI, gs1Fields, (err) => {
                                if (err) {
                                    return console.log("Failed to add package to history", err);
                                }
                            });
                        } else {
                            this.addConstProductDSUToHistory(gs1Fields);
                        }
                    });
                } else {
                    this.redirectToDrugDetails({gtinSSI: gtinSSI.getIdentifier(), gs1Fields});
                }
            });
        });
    }

    buildSSI(gs1Fields, callback) {
        this.settingsService.readSetting("networkname", (err, networkName) => {
            if (err || typeof networkName === "undefined") {
                networkName = constants.DEFAULT_NETWORK_NAME;
            }
            return callback(undefined, gtinResolver.createGTIN_SSI(networkName, gs1Fields.gtin, gs1Fields.batchNumber));
        });
    }

    addConstProductDSUToHistory(gs1Fields) {
        this.createConstProductDSU_SSI(gs1Fields, (err, constProductDSU_SSI) => {
            if (err) {
                //todo: what to do in this case?
            }

            this.constProductDSUExists(constProductDSU_SSI, (err, status) => {
                if (err) {
                    return console.log("Failed to check constProductDSU existence", err);
                }
                if (status) {
                    // gs1Fields.expiry = "MISSING";
                    // gs1Fields.batchNumber = "MISSING";
                    this.addPackageToHistoryAndRedirect(constProductDSU_SSI, gs1Fields, (err) => {
                        if (err) {
                            return console.log("Failed to add package to history", err);
                        }
                    });
                } else {
                    return this.redirectToError("Product code combination could not be resolved.", gs1Fields);
                }
            });
        });
    }

    addPackageToHistoryAndRedirect(gtinSSI, gs1Fields, callback) {
        this.packageAlreadyScanned(gtinSSI, gs1Fields, (err, status) => {
            if (err) {
                return console.log("Failed to verify if package was already scanned", err);
            }

            if (!status) {
                this.addPackageToScannedPackagesList(gtinSSI, gs1Fields, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    this.redirectToDrugDetails({gtinSSI: gtinSSI.getIdentifier(), gs1Fields});
                });
            } else {
                this.redirectToDrugDetails({gtinSSI: gtinSSI.getIdentifier(), gs1Fields});
            }
        });

    }

    createConstProductDSU_SSI(gs1Fields, callback) {
        this.settingsService.readSetting("networkname", (err, networkName) => {
            if (err || typeof networkName === "undefined") {
                networkName = constants.DEFAULT_NETWORK_NAME;
            }
            return callback(undefined, gtinResolver.createGTIN_SSI(networkName, gs1Fields.gtin));
        });
    }

    redirectToDrugDetails(state) {
        this.history.push(`${new URL(this.history.win.basePath).pathname}drug-details`, state);
    }

    packageAlreadyScanned(packageGTIN_SSI, gs1Fields, callback) {
        this.DSUStorage.call("listDSUs", `/packages`, (err, dsuList) => {
            if (err) {
                return callback(err);
            }

            let packageIndex = dsuList.findIndex(dsu => utils.getMountPath(packageGTIN_SSI, gs1Fields).includes(dsu.path));
            if (packageIndex === -1) {
                callback(undefined, false);
            } else {
                callback(undefined, true);
            }
        });
    }

    addPackageToScannedPackagesList(packageGTIN_SSI, gs1Fields, callback) {
        const gtinSSIIdentifier = packageGTIN_SSI.getIdentifier();
        this.DSUStorage.call("mountDSU", utils.getMountPath(packageGTIN_SSI, gs1Fields), gtinSSIIdentifier, (err) => {
            if (err) {
                return callback(err);
            }

            this.DSUStorage.getObject(constants.PACKAGES_STORAGE_PATH, (err, packages) => {
                if (typeof packages === "undefined") {
                    packages = {};
                }
                packages[utils.getMountPath(packageGTIN_SSI, gs1Fields)] = gs1Fields;

                this.DSUStorage.setObject(constants.PACKAGES_STORAGE_PATH, packages, callback);
            });
        });
    }

    constProductDSUExists(constProductDSU_SSI, callback) {
        this.DSUStorage.call("loadDSU", constProductDSU_SSI.getIdentifier(), (err) => {
            if (err) {
                return callback(undefined, false);
            }

            callback(undefined, true);
        });
    }

    batchAnchorExists(packageGTIN_SSI, callback) {
        this.DSUStorage.call("loadDSU",  packageGTIN_SSI.getIdentifier(), (err, dsu) => {
            if (err) {
                return callback(undefined, false);
            }

            callback(undefined, true);
        });
    }

    parseGs1Fields(orderedList) {
        const gs1Fields = {};
        const fieldsConfig = {
            "GTIN": "gtin",
            "BATCH/LOT": "batchNumber",
            "SERIAL": "serialNumber",
            "USE BY OR EXPIRY": "expiry"
        };

        orderedList.map(el => {
            let fieldName = fieldsConfig[el.label];
            gs1Fields[fieldName] = el.value;
        })

        if (gs1Fields.expiry) {
            gs1Fields.expiry = utils.convertFromISOtoYYYY_HM(gs1Fields.expiry);
        }

        return gs1Fields;
    }

    hasMandatoryFields(gs1Fields) {
        if (!gs1Fields.gtin || !gs1Fields.serialNumber || !gs1Fields.serialNumber || !gs1Fields.expiry) {
            return false;
        }

        return true;
    }

    redirectToError(message, fields) {
        this.history.push({
            pathname: `${new URL(this.history.win.basePath).pathname}scan-error`,
            state: {
                message,
                fields
            }
        })
    }

    getNativeApiHandler(callback) {
        try {
            const nativeBridgeSupport = window.opendsu_native_apis;
            if (typeof nativeBridgeSupport === "object") {
                return nativeBridgeSupport.createNativeBridge(callback);
            }

            callback(undefined, undefined);
        } catch (err) {
            console.log("Caught an error during initialization of the native API bridge", err);
        }
    }
}