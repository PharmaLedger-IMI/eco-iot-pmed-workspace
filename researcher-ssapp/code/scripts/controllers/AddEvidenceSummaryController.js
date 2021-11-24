const {WebcController} = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
import EvidenceConfigService from "../services/EvidenceConfigService.js";


export default class AddEvidenceSummaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();

        ////
        this.IotAdaptorApi = new IotAdaptorApi();
        this.EvidenceConfigService = new EvidenceConfigService(this.DSUStorage);
        const me = this;
        me.evidenceConfigDSU = ""
        me.EvidenceConfigService.getEvidenceConfig(function(error, data) {
            if (!data) {
                me.IotAdaptorApi.createEvidenceDsu({}, (err, evidence) => {
                    if (err) {
                        return console.log(err);
                    }
                    me.evidenceConfigDSU = evidence[evidence.length - 1];
                    me.EvidenceConfigService.saveEvidenceConfig(evidence, (err, saveData) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });
            } else {
                me.evidenceConfigDSU = data[data.length - 1];
            }
            console.log(me.evidenceConfigDSU);
        });
        ////

        this.attachHandlerEditButton();
        this.attachHandlerAcceptButton();
    }


    attachHandlerEditButton() {
        this.onTagClick('evidence:edit', () => {
            console.log("Edit button pressed");
            this.navigateToPageTag('add-evidence-p1', this.model.toObject());
        });
    }


    attachHandlerAcceptButton(){
        const me = this;
        this.onTagClick('evidence:accept', () => {
            ////
            let keySSI = me.evidenceConfigDSU.sReadSSI;
            me.IotAdaptorApi.createEvidence(this.prepareEvidenceData(), keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log(evidence);
            });
            ////
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