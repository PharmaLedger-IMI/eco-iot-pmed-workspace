const { WebcController } = WebCardinal.controllers;


export default class ConfirmEvidenceController extends  WebcController  {
    constructor(...props) {
        super(...props);
        // let allData = this.getState();
        this.model = {...this.history.win.history.state.state};
        console.log(this.model);
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
           
            this.navigateToPageTag('confirm-evidence');
        });
    }
    _attachHandlerEvidenceEdit(){
        this.on('evidence:edit', (event) => {
            this.navigateToPageTag('edit-evidence');
        });
    }

   

}