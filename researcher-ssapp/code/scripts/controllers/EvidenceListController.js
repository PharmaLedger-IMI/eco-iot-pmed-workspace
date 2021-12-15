const { WebcController } = WebCardinal.controllers;

export default class EvidenceListController extends  WebcController  {
    constructor(...props) {
        super(...props);

        this.model = {
            allEvidences: this.getState()
        };

        this.attachHandlerToEvidence()
       
    }
    attachHandlerToEvidence(){
        this.onTagClick('evidence:to-evidence', () => {
            this.navigateToPageTag('evidence');
        });
    }
   

   

}