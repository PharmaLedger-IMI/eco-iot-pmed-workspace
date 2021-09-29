const { WebcController } = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
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
            let id = 'cfe2eece-1744-4e5b-8a4d-455b40340861';
            let keySSI = '27XvCBPKSWpUwscQUxwsVDTxRbaerzjCvpuajSFrnCUrhNuFJc3P3uS1hWAeCvKgPrBQvF6H4AYErQLTxKvqMjFZr7ukHRjmaFfPjuxQdyLC5fFr4qyETTyscVgZjp5q1QCgq8SXuGua9xudXdxQffu';

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