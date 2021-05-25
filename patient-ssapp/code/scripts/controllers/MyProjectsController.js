const { WebcController } = WebCardinal.controllers;


export default class MyProjectsController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this._attachHandlerGoBack();
        this._attachHandlerHome();

    }
    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('platforms');
        });
    }

    _attachHandlerHome(){
        this.on('home',(event)=>{
            console.log ("home button pressed");
            this.navigateToPageTag('home');
        });
    }






}