const {WebcController} = WebCardinal.controllers;

import IotAdaptorApi from "../services/IotAdaptorApi.js";

export default class AddEvidenceSummaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();

        this.IotAdaptorApi = new IotAdaptorApi();

        this._attachHandlerEditButton();
        this._attachHandlerAcceptButton();
    }

    _attachHandlerEditButton() {
        this.onTagClick('evidence:edit', () => {
            console.log("Edit button pressed");
            this.navigateToPageTag('add-evidence-p1', this.model.toObject());
        });
    }

    _attachHandlerAcceptButton() {
        this.onTagClick('evidence:accept', () => {

            let keySSI = "27XvCBPKSWpUwscQUxwsVDTxRcnKSPEFTyaG1PPvpnC76o4pD76pUsStY1bzektb9nVGZNH6N6eWHqvDvPABsPhAuyd7tdYW6nySVQtxMvWbNipbWVhz8xVikf2auFpsq9ULP2du51taiV552RjQS1u";
            this.IotAdaptorApi.createEvidence(this.prepareEvidenceData(), keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log(evidence);
            });

            this.navigateToPageTag('confirmation-page', {
                confirmationMessage: "The evidence has been generated!",
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