const { WebcController } = WebCardinal.controllers;


export default class FeedbackController extends WebcController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();
        this._attachHandlerGoSampleFeedBack();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerGoSampleFeedBack(){
        this.on('see-the-evidence', (event) => {
            console.log ("see the evidence");
            this.navigateToPageTag('personalized-feedback2');
        });
    }

}