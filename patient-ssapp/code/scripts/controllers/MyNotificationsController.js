import InformationRequestService from "../services/InformationRequestService.js";
import CommunicationService from "../services/CommunicationService.js";
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



        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.PATIENT_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            console.log('Received message', data.message)

            switch (data.message.operation) {
                case 'information-request-response': {
                    this.InformationRequestService.mount(data.message.ssi, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        this.InformationRequestService.getInformationRequests((err, data) => {
                            if (err) {
                                return console.log(err);
                            }
                            let last_request = (data[data.length-1]);
                            this.model.contract = last_request;
                            this.model.ssi = last_request.KeySSI;
                            console.log(last_request);
                            this.model.title = last_request.ContractTitle;

                        });
                    });
                    console.log("CASE RECEIVED INFORMATION REQUEST");
                    break;
                }
            }

        });


    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('platforms');
        });
    }



}