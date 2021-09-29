const { WebcController } = WebCardinal.controllers;
// import IotAdaptorApi from "../services/IotAdaptorApi.js";


export default class EvidenceListController extends  WebcController  {
    constructor(...props) {
        super(...props);
        this.model = {};
        let receivedState = this.getState();
        this.model.allEvidences = receivedState;
        console.log (this.model.allEvidences);
        // receivedState.forEach(data => {
        //     console.log (data.title);
        // });
        // console.log("Received State: " + JSON.stringify(receivedState, null, 4));
        this._attachHandlerToEvidence()
       
    }
    _attachHandlerToEvidence(){
        this.on('evidence:to-evidence', (event) => {
            this.navigateToPageTag('evidence');
        });
    }
   

   

}