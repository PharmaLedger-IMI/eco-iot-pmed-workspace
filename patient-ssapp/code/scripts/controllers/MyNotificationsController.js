const {WebcController} = WebCardinal.controllers;


const ViewNotificationsModel = {
}


export default class MyNotificationsController extends  WebcController  {
    constructor(...props) {
        super(...props);

        this.model = ViewNotificationsModel;
        this._attachHandlerGoBack()

        if (this.getState()){
            let receivedNotification = this.getState();
            console.log("Received State: " + JSON.stringify(receivedNotification, null, 4));
        }

    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('platforms');
        });
    }


}