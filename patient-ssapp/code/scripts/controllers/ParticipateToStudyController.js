const {WebcController} = WebCardinal.controllers;


export default class ParticipateToStudyController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerGoBack();

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('platforms');
        });
    }


}