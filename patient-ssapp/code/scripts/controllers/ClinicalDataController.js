const { WebcController } = WebCardinal.controllers;


export default class ClinicalDataController extends  WebcController  {
    constructor(...props) {
        super(...props);
        // let allData = this.getState();
        this.model = {...this.history.win.history.state.state};
      
        console.log("********** This Mod **************");
        console.log(this.model);
        this._attachHandlerGoBack();

    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

   

}