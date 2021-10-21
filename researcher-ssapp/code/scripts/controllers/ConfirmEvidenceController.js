const {
    WebcController
} = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
import EvidenceConfigService from "../services/EvidenceConfigService.js";

var singleData;
var evidenceConfigDSU;

export default class ConfirmEvidenceController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {
            ...this.history.win.history.state.state
        };
        singleData = {
            ...this.history.win.history.state.state
        };
        this._attachHandlerGoBack();
        this._attachHandlerEvidenceConfirm();
        this._attachHandlerEvidenceEdit();

        this.IotAdaptorApi = new IotAdaptorApi();
        this.EvidenceConfigService = new EvidenceConfigService(this.DSUStorage);
        const me = this;
        me.EvidenceConfigService.getEvidenceConfig(function(error, data) {

            if (!data) {
                me.IotAdaptorApi.createEvidenceDsu({}, (err, evidence) => {
                    if (err) {
                        return console.log(err);
                    }
                    me.evidenceConfigDSU = evidence[evidence.length - 1];
                    console.log("Evidence DSU Config", me.evidenceConfigDSU);
                    me.EvidenceConfigService.saveEvidenceConfig(evidence, (err, saveData) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });

            } else {
                me.evidenceConfigDSU = data[data.length - 1];
            }
        });
    }

    _attachHandlerGoBack() {
        this.on('go-back', (event) => {
            console.log("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }
    _attachHandlerEvidenceConfirm() {
        const me = this;
        this.on('evidence:confirm', (event) => {
            let keySSI = me.evidenceConfigDSU.sReadSSI;
            me.IotAdaptorApi.createEvidence(singleData.allData, keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log(evidence);
                // callback(undefined, evidence);
            });
            this.navigateToPageTag('confirm-evidence');
        });
    }
    _attachHandlerEvidenceEdit() {
        this.on('evidence:edit', (event) => {
            this.navigateToPageTag('edit-evidence');
        });
    }

}