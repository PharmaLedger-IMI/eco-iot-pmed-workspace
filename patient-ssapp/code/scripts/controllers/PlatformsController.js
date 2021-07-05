const { WebcController } = WebCardinal.controllers;

const ViewModel = {
    notification: ""
}


export default class PlatformsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = ViewModel;

        this._attachHandlerGoBack();
        this._attachHandlerGoToMyNotifications();

        if (this.getState()){
            let receivedNotification = this.getState();
            console.log("Received: " + receivedNotification);
            this.model.ssi = receivedNotification.ssi
            this.model.title   = receivedNotification.title
            this.model.notification = "There is a new request, Please review your notifications."
            if (this.model.ssi == null){
                this.model.notification = ""
            }

        }

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
            let information_request_state = {
                ssi: this.model.ssi,
                title: this.model.title
            }
            this.navigateToPageTag('my-notifications', information_request_state);
        });
    }



}