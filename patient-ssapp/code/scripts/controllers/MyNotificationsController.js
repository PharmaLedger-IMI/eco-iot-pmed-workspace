const {WebcController} = WebCardinal.controllers;


const ViewNotificationsModel = {
    contract: "empty",
    title: "empty",
    ssi: "empty",
    message: ""
}


export default class MyNotificationsController extends  WebcController  {
    constructor(...props) {
        super(...props);

        this.model = ViewNotificationsModel;
        this._attachHandlerGoBack()

        if (this.getState()){
            let receivedNotification = this.getState();
            console.log("Received keySSI object: " + receivedNotification.ssi);
            this.model.ssi = receivedNotification.ssi
            this.model.title   = receivedNotification.title

            if (this.model.ssi == null){
                this.model.message = ""
            }
            else{
                this.model.message = "Received an information request with keySSI " + this.model.ssi + "   and title: " + this.model.title
            }
        }

    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('platforms');
        });
    }


}