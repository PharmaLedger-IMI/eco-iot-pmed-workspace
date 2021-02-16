import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import { getWalletTemplateServiceInstance } from "../services/WalletTemplateService.js";

const APPS_FOLDER = "/apps";

export default class WalletSsappLauncher extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.model = this.setModel({
            appName: null,
            keySSI: null,
            params: null
        });
        this.walletTemplateService = getWalletTemplateServiceInstance();

        this.__setAppName();
    }

    __setAppName = () => {
        const appName = this.element.getAttribute("data-app-name");
        if (appName && appName.trim().length) {
            this.__setAppNameAttribute(appName);
            this.__getKeySSIAndParams(appName);
        }
    }

    __setAppNameAttribute = (appName) => {
        const pskSsappElement = this.element.querySelector("psk-ssapp");
        if (pskSsappElement) {
            pskSsappElement.setAttribute("app-name", appName);
        }
    }

    __getKeySSIAndParams = (appName) => {
        this.walletTemplateService.getKeySSI(APPS_FOLDER, appName, (err, keySSI) => {
            if (err) {
                throw Error(`Failed to load SEED from ${APPS_FOLDER/appName}`);
            }
            this.walletTemplateService.getUserDetails((err, userDetails) => {
                if (err) {
                    throw Error(`Failed to get user details`);
                }
                this.model.setChainValue("params", JSON.stringify(userDetails));
            });

            this.model.setChainValue("keySSI", keySSI);
            console.log("[Open SSAPP] " + appName + " with KeySSI: " + keySSI);
        });
    }
}