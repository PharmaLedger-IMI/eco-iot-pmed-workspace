import feedbackViewModel from "../view-models/feedbackViewModel.js";

export default class FeedbackController {

    constructor(model) {
        this.model = model;

        Object.keys(feedbackViewModel).forEach((key) => {
            this.model.setChainValue(key, this._getCleanObject(feedbackViewModel[key]));
        });
    }

    /**
     * This method updates the message for the model.
     * These view-model attributes will be updated and reflected back to UI.
     * @param {type} type - the type of the message. the must must be defined in the model, otherwise nothing is displayed
     * @param {string} message - the error message that will be set inside the error model
     */
    updateDisplayedMessage(type, message) {
        this.model.setChainValue(`${type}.isDisplayed`, message !== null);
        this.model.setChainValue(`${type}.message`, message);
    }

    /**
     * This method is updating the state of the ui-loader, so if the loading state is set to "true", 
     * the loader will be displayed, otherwise, it will not be displayed.
     * The default value is "false"
     * @param {boolean} loadingState
     */
    setLoadingState(loadingState = false) {
        this.model.setChainValue('conditionalExpressions.isLoading', loadingState);
    }

    /** ############## Internal methods #################  **/

    _getCleanObject(obj) {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}