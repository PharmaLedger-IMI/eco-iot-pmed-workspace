const { WebcController } = WebCardinal.controllers;


export default class ConfigureAccessController extends WebcController {
    constructor(element, history) {

        super(element, history);


        this._attachHandlerGoBack()
      
    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}