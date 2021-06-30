const { WebcController } = WebCardinal.controllers;

export default class PlatformsController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this._attachHandlerGoBack();
        this._attachHandlerGoToMyNotifications();

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerGoToMyNotifications(){
        this.on('my-notifications', (event) => {
            console.log ("My notifications button pressed");
            this.navigateToPageTag('my-notifications');
        });
    }



}