import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";
import FeedbackController from "./FeedbackController.js";

import walletContentViewModel from '../view-models/walletContentViewModel.js';
import viewFileViewModel from "../view-models/modals/file-folder-modals/viewFileViewModel.js";
import Constants from "./Constants.js";

export default class ExplorerNavigationController extends ContainerController {
    constructor(element, history, model) {
        super(element, history);

        this.model = model;
        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();

        this.listDossierContent();
        this._initNavigationLinks();
    }

    listDossierContent = () => {
        this.feedbackController.setLoadingState(true);
        let wDir = this.model.currentPath || '/';
        // Reset the last selected item(if any), as for the moment we support only single selection
        this._resetLastSelected();
        this.dossierService.readDirDetailed(wDir, this._updateDossierContent);
    }

    changeDirectoryHandler = (event) => {
        event.stopImmediatePropagation();

        let path = event.data || '/';
        this.model.setChainValue('currentPath', path);
    };

    getFullPath = () => {
        return this.model.currentPath;
    };

    selectWalletItemHandler = (event) => {
        event.stopImmediatePropagation();

        let selectedItemViewModel = this.model.content.find((el) => el.name === event.data);
        if (!selectedItemViewModel) {
            console.error('The clicked item is not in the view-model!');
            return;
        }

        // Reset the last selected item(if any), as for the moment we support only single selection
        this._resetLastSelected();

        let isSelected = selectedItemViewModel.selected === 'selected';
        if (isSelected) {
            selectedItemViewModel.selected = '';
        } else {
            selectedItemViewModel.selected = 'selected';
        }
    };

    doubleClickHandler = (event) => {
        event.stopImmediatePropagation();

        let clickedItem = event.data;
        if (!clickedItem) {
            console.error(`Clicked item is not valid!`, event);
            return;
        }

        let clickedItemViewModel = this.model.content.find((el) => el.name === clickedItem);
        if (!clickedItemViewModel) {
            console.error(`Clicked item is not present in the model!`);
            return;
        }

        switch (clickedItemViewModel.type) {
            case 'file':
                {
                    clickedItemViewModel.currentPath = this.model.currentPath || '/';
                    this.openViewFileModal(clickedItemViewModel);
                    break;
                }
            case 'application':
            case 'dossier':
            case 'folder':
                let wDir = this.model.currentPath || '/';
                let newWorkingDirectory = wDir === '/' ?
                    `${wDir}${clickedItem}` : `${wDir}/${clickedItem}`;
                this.model.setChainValue('currentPath', newWorkingDirectory);
                break;
            default:
                break;
        }
    };

    sortWorkingDirectoryHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let propertyName = event.data;
        if (!propertyName) {
            console.error(`Sort is not possible. The property name is not ok. Provided: ${propertyName}`);
            return;
        }

        let sortTypeViewModel = this.model.sortedTypes[propertyName];

        if (!sortTypeViewModel) {
            console.error(`Sort is not possible. The property name is not ok. Provided: ${propertyName}`);
            return;
        }

        const reverseSorting = sortTypeViewModel.isSorted && !sortTypeViewModel.descending;
        const content = JSON.parse(JSON.stringify(this.model.content));

        let newContent = [];
        ["application", "dossier", "folder", "file"].forEach((type) => {
            let sortedContent = content.filter(el => el.type === type);
            sortedContent = this._sortByProperty(sortedContent, propertyName, reverseSorting);

            newContent = [...newContent, ...sortedContent];
        });

        /**
         * Reset the view model for sorted types and conditionals and update according to the requested sort option
         */
        let sortedTypesViewModel = JSON.parse(JSON.stringify(walletContentViewModel.defaultSortedViewModel));
        sortedTypesViewModel[propertyName].isSorted = true;
        sortedTypesViewModel[propertyName].descending = reverseSorting;

        this.model.setChainValue('content', newContent);
        this.model.setChainValue('sortedTypes', sortedTypesViewModel);
    }

    openViewFileModal = (viewModel) => {
        let path = viewModel.currentPath || '/';
        if (path === '/') {
            path = '';
        }

        viewModel.title = `${path}/${viewModel.name}`;
        viewModel.path = path;

        viewModel = {
            ...viewFileViewModel,
            ...viewModel
        };
        this.showModal('viewFileModal', viewModel, (err, response) => {
            console.log(err, response);
        });
    }

    /* ############################## INTERNAL METHODS ############################## */

    _initListeners = () => {
        this.on('select-wallet-item', this.selectWalletItemHandler);
        this.on('double-click-item', this.doubleClickHandler);
        this.on('breadcrumb-click', this.changeDirectoryHandler);
        this.on('sort-working-directory', this.sortWorkingDirectoryHandler);

        /**
         * Model chain change watchers
         */
        this.model.onChange('currentPath', () => {
            this.listDossierContent();
            this._initNavigationLinks();
        });

        this.breadcrumbElement = this.element.querySelector("psk-breadcrumb-navigator");
        this.model.onChange("navigationLinks", () => {
            if (this.breadcrumbElement) {
                this.breadcrumbElement.segments = this.model.toObject("navigationLinks");
            }
        });
    };

    _updateNavigationLinks = (links) => {
        this.model.navigationLinks = links;
    }

    _initNavigationLinks = () => {
        let wDir = this.model.currentPath || '/';
        let links = [{
            label: this.model.contentLabels.myWalletLabel,
            path: '/'
        }];

        // If the current path is root
        if (wDir === '/') {
            this._updateNavigationLinks(links);
            return;
        }

        // If anything, but root
        let paths = wDir.split('/');
        // pop out first element as it is the root and create below the My Wallet(Home / Root) Link
        paths.shift();

        paths.forEach((pathSegment) => {
            let path = links[links.length - 1].path;
            if (path === '/') {
                path = `/${pathSegment}`;
            } else {
                path = `${path}/${pathSegment}`;
            }

            links.push({
                label: pathSegment,
                path: path
            });
        });

        // Set the navigation links to view-model
        this._updateNavigationLinks(links);
    }

    _resetLastSelected = () => {
        let previouslySelected = this.model.content.find((item) => {
            return item.selected === 'selected';
        });

        if (previouslySelected) {
            previouslySelected.selected = '';
        }
    }

    _updateDossierContent = (err, dirContent) => {
        let newContent = [];

        if (err) {
            this.feedbackController.setLoadingState(false);
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            this.model.setChainValue('content', newContent);
            return;
        }

        this.model.contentTypesToDisplay.map((type) => {
            if (dirContent[type] && dirContent[type].length) {
                const updatedContent = this._updateContentForType(
                    dirContent[type],
                    walletContentViewModel[type]
                );

                newContent = [...newContent, ...updatedContent];
            }
        });

        this.model.setChainValue('content', newContent);
        this.feedbackController.setLoadingState(false);
    }

    /**
     * TODO:
     * To be removed after edfs provides the last modified attribute
     */
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _updateContentForType = (content, defaultViewModel) => {
        let mappedContent = content.filter(el => !!el)
            .map(el => {
                name = el.trim();
                if (name.length && name.charAt(0) === '/') {
                    name = name.replace('/', '');
                }

                let viewModelObject = {
                    ...defaultViewModel,
                    contentLabels: JSON.parse(JSON.stringify(this.model.contentLabels)),
                    name: name
                };

                // Temporary solution until the values are provided from edfs
                viewModelObject.lastModified = this.getRandomInt(1594500000000, new Date().getTime());
                viewModelObject.hoverFormat = this.model.dateFormatOptions.fullTime;
                viewModelObject.format = this._isDateInLastDay(viewModelObject.lastModified) ?
                    this.model.dateFormatOptions.time : this.model.dateFormatOptions.date;

                return viewModelObject;
            });

        mappedContent = this._sortByProperty(mappedContent, 'name');
        let sortedTypesViewModel = JSON.parse(JSON.stringify(walletContentViewModel.defaultSortedViewModel));
        sortedTypesViewModel.name.isSorted = true;
        this.model.setChainValue('sortedTypes', sortedTypesViewModel);

        return mappedContent;
    }

    _isDateInLastDay = (dateValue) => {
        const dateValueTimestamp = new Date(dateValue).getTime();
        const timeStamp = new Date().getTime();
        const timeStampYesterday = timeStamp - (24 * 3600 * 1000);

        return dateValueTimestamp >= timeStampYesterday;
    }

    _sortByProperty = (arr, pName, reverse) => {
        switch (pName) {
            case 'name':
                {
                    arr = arr.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                }
            case 'lastModified':
                {
                    arr = arr.sort((a, b) => a.lastModified - b.lastModified);
                    break;
                }
            case 'type':
                {
                    // TODO: To check if we will implement this type of sorting
                    // Add this type into walletContentViewModel.js
                    break;
                }
            default:
                {
                    break;
                }
        }

        if (reverse) {
            arr = arr.reverse();
        }

        return arr;
    }

}