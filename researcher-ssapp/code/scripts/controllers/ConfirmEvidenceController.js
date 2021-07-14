const { WebcController } = WebCardinal.controllers;


export default class ConfirmEvidenceController extends  WebcController  {
    constructor(...props) {
        super(...props);
        // let allData = this.getState();
        this.model = {...this.history.win.history.state.state};

    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

   

}