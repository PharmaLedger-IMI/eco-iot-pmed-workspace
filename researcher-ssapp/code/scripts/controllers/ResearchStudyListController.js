const { WebcController } = WebCardinal.controllers;

export default class ResearchStudyListController extends  WebcController  {
    constructor(...props) {
        super(...props);
        this.model = {};
        let receivedState = this.getState();
        this.model.researchStudy = receivedState;
        console.log (this.model.researchStudy);
        this._attachHandlerHome()
       
    }
    _attachHandlerHome(){
        this.onTagClick('research:back', (event) => {
            this.navigateToPageTag('research-study');
        });
    }
   

   

}