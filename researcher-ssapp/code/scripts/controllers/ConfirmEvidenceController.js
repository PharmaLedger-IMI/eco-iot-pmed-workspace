const { WebcController } = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
import EvidenceConfigService from "../services/EvidenceConfigService.js";

var singleData;

export default class ConfirmEvidenceController extends  WebcController  {
    constructor(...props) {
        super(...props);
        // let allData = this.getState();
        this.model = {...this.history.win.history.state.state};
        singleData = {...this.history.win.history.state.state};
        // console.log(this.model);
        console.log(singleData.allData);
        this._attachHandlerGoBack();
        this._attachHandlerEvidenceConfirm();
        this._attachHandlerEvidenceEdit();


        this.EvidenceConfigService = new EvidenceConfigService(this.DSUStorage);
        this.IotAdaptorApi = new IotAdaptorApi();
        const me = this;
        me.EvidenceConfigService.getEvidenceConfig(function(error, data){
            if(data.length === 0) {
                me.IotAdaptorApi.createEvidenceDsu({}, (err, evidence) => {
                    if (err) {
                        return console.log(err);
                    }                    
                    me.EvidenceConfigService.saveEvidenceConfig(evidence, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        me.evidenceConfigDSU = data[0];
                    });
                });
            } else {
                me.evidenceConfigDSU = data[0];
            }

            console.log("Evidence DSU Config", me.evidenceConfigDSU);
        });
    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }
    _attachHandlerEvidenceConfirm(){
        this.on('evidence:confirm', (event) => {
            console.log("Evidence Confirmed")
            this.IotAdaptorApi = new IotAdaptorApi();
            let keySSI = this.evidenceConfigDSU.sReadSSI;

            this.IotAdaptorApi.createEvidence(singleData.allData, keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log (evidence);
                // callback(undefined, evidence);
            })
            this.navigateToPageTag('confirm-evidence');
        });
    }
    _attachHandlerEvidenceEdit(){
        this.on('evidence:edit', (event) => {
            this.navigateToPageTag('edit-evidence');
        });
    }

   

}