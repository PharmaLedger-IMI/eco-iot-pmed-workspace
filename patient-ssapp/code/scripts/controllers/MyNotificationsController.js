const {WebcController} = WebCardinal.controllers;


const ViewNotificationsModel = {
    contract: "empty",
    title: "empty",
    ssi: "empty"
}


export default class MyNotificationsController extends  WebcController  {
    constructor(...props) {
        super(...props);

        this.model = ViewNotificationsModel;
        this._attachHandlerGoBack()

        if (this.getState()){
            let receivedNotification = this.getState();
            console.log("Received: " + receivedNotification);
            this.model.ssi = receivedNotification.ssi
            this.model.title   = receivedNotification.title
        }

    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('platforms');
        });
    }


}