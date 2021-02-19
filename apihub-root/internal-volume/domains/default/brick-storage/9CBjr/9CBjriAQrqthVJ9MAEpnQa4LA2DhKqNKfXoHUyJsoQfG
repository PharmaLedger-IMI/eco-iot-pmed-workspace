import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import { getDossierServiceInstance } from "../service/DossierExplorerService.js"


const rootModel = {
    pageTitle: "Submit Marketplace",

    name: {
        label: "Name",
        name: 'name',
        required: true,
        placeholder: 'Marketplace name ...',
        value: ''
    },
    description: {
        label: "Description",
        name: 'description',
        required: true,
        placeholder: 'Marketplace description ...',
        value: ''
    },
    contentLabels: {
        myWalletLabel: "Submit Marketplace"
    },
    filesArray: []
};

export default class SubmitMarketplaceController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.DossierExplorerService = getDossierServiceInstance();
        this.model = this.setModel(this._getCleanProxyObject(rootModel));

        this._initListeners();
    }

    _initListeners = () => {
        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

       this.on('marketplace-submit', this._handleMarketplaceSubmit);
    };

    __displayErrorIfFieldIsNullOrEmpty(event, fieldName, field) {
        if (field === undefined || field === null || field.length === 0) {
            this._emitFeedback(event, fieldName + " field is required.", "alert-danger")
            return true;
        }
        return false;
    }

    __displayErrorMessages = (event) => {
        return this.__displayErrorIfFieldIsNullOrEmpty(event, 'Name', this.model.name.value) ||
            this.__displayErrorIfFieldIsNullOrEmpty(event, 'Description', this.model.description.value);

    }

    _handleMarketplaceSubmit = (event) => {
        if (this.__displayErrorMessages(event)) {
            return;
        }
        let marketplaceDetails = {
            name: this.model.name.value,
            description: this.model.description.value
        };

        this.DossierExplorerService.addMarketplace(marketplaceDetails, (err, response) => {
            if (err) {
                console.log(err);
                return;
            }
            this.History.navigateToPageByTag('marketplace-manager');
        });
    }

    _emitFeedback(event, message, alertType) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (typeof this.feedbackEmitter === 'function') {
            this.feedbackEmitter(message, "Validation", alertType)
        }
    }

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}