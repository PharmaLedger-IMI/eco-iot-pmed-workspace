import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {getDossierServiceInstance} from "../service/DossierExplorerService.js"
import {getImportMarketplaceViewModel} from "../view-models/importMarketplace.js";

const rootModel = {
    pageLoader: {
        walletContent: `/pages/marketplace-manager-content.html`
    },
    content: [],
    marketplaces: [],
    pageTitle: 'Marketplace Manager',
    conditionalExpressions: {
        isLoading: false,
        isGridLayout: false,
        isAdmin: true
    },
    isAdmin: true,
    hoverLabels: {
        switchGridHover: "Click to switch to list",
        switchListHover: "Click to switch to grid",
    },

    searchBox: {
        name: 'searchBar',
        required: false,
        placeholder: 'Search for a marketplace',
        value: ''
    },
    contentLabels: {
        noItemsLabel: "There are no marketplaces.",
        myWalletLabel: "Marketplace"
    }
};

export default class MarketplaceManagerController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.DossierExplorerService = getDossierServiceInstance();
        this.model = this.setModel(this._getCleanProxyObject(rootModel));
        this._populateMarketplaceList();
        this._initListeners();
    }

    _populateMarketplaceList = () => {
        this.DossierExplorerService.listMarketplaces((err, marketplaces) => {
            if (err) {
                console.log(err);
                return;
            }
            this.setModelKey('content', marketplaces)
            this.setModelKey('marketplaces', marketplaces)
        });
    }

    _initListeners = () => {
        this.on("switch-layout", this._handleSwitchLayout);

        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

        this.on('submit-marketplace', (event) => {
            this.History.navigateToPageByTag('submit-marketplace');
        });

        this.on('import-marketplace', (event) => {
            this._marketplaceImportHandler(event);
        });

        this.on('marketplace-application-delete-on-click', (event) => {
            this._marketplaceDeleteHandler(event);
        });

        this.on('marketplace-application-open-on-click', (event) => {
            this._marketplaceOpenHandler(event);
        });

        this.model.onChange('searchBox', () => {
            this._handleSearchChange();
        });
    };

    _handleSearchChange = () => {
        let searchTerm = this.model.searchBox.value.toLowerCase();
        let matchedMarketplace = this.model.marketplaces.filter(app => this.__lowTextContainsLowTerm(app.name, searchTerm) || this.__lowTextContainsLowTerm(app.description, searchTerm))
        this.model.setChainValue('content', matchedMarketplace);
    };

    __lowTextContainsLowTerm(lowText, lowTerm) {
        return lowText.toLowerCase().includes(lowTerm.toLowerCase());
    }

    _handleSwitchLayout = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.model.isGridLayout = !this.model.isGridLayout;
    };

    _marketplaceImportHandler(event) {
        this._importQRCodeModalHandler(event, (err, data) => {
            if (err) {
                this._emitFeedback(event, 'Importing failed!', 'alert-danger');
                return;
            }

            this.DossierExplorerService.importMarketplace(data.marketplaceSSI, (err, _) => {
                if (err) {
                    return this._emitFeedback(event, 'Importing failed!', 'alert-danger');
                }

                this._emitFeedback(event, 'Importing successfully!', 'alert-success');
                this._populateMarketplaceList();
            });
        });
    }

    _importQRCodeModalHandler(event, callback) {
        event.preventDefault();
        event.stopImmediatePropagation();
        let qrCodeModalModel = getImportMarketplaceViewModel();
        this.showModal('importQRCodeModal', qrCodeModalModel, callback);
    }

    _marketplaceOpenHandler(event) {
        let marketplace = event.data;
        this.History.navigateToPageByTag('access-marketplace', {
            name: marketplace.name,
            keySSI: marketplace.keySSI
        });
    }

    _marketplaceDeleteHandler(event) {
        let actionModalModel = {
            title: "Are you sure?",
            description: "Deleting a marketplace will delete all the submitted marketplaces from it and it's a non-reversible process.",
            acceptButtonText: 'Yes, delete it!',
            denyButtonText: 'No, go back.',
        }
        this.showModal('confirmActionModal', actionModalModel, (err, response) => {
            if (err || response.value === false) {
                return;
            }
            this.DossierExplorerService.removeMarketplace(event.data, (err, data) => {
                if (err) {
                    this._emitFeedback(event, 'Delete failed!', 'alert-danger')
                }
                this._emitFeedback(event, "Marketplace " + event.data.name + " deleted successfully.", "alert-success")
                this._populateMarketplaceList();
            });

        });
    }

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }

    _emitFeedback(event, message, alertType) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (typeof this.feedbackEmitter === 'function') {
            this.feedbackEmitter(message, "Validation", alertType)
        }
    }

    setModelKey(key, value) {
        this.model.setChainValue(key, JSON.parse(JSON.stringify(value)));
    }
}