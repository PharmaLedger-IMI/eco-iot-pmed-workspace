const {WebcController} = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";

export default class ResearchStudySummaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();
        console.log("**********Data is here!**********");
        console.log(this.model);
        this.IotAdaptorApi = new IotAdaptorApi();

        this._attachHandlerEditButton();
        this._attachHandlerAcceptButton();
    }

    _attachHandlerEditButton() {
        this.onTagClick('research:edit', () => {
            this.navigateToPageTag('create-research-study', this.model.toObject());
        });
    }

    _attachHandlerAcceptButton(){
        this.onTagClick('research:accept', () => {
            this.navigateToPageTag('confirmation-page', {
                confirmationMessage: "The research study has been generated!",
                redirectPage: "home"
            });
        });
    }

    prepareEvidenceData() {
        return {
            name: this.model.name,
            contact: [
                {
                    name: "Name of the Publisher(Organization/individual)",
                    telecom: [
                        {
                            system: "email",
                            value: this.model.email
                        }
                    ]
                }
            ],
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            description: this.model.description.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            publisher: this.model.organization
        };
    }
}