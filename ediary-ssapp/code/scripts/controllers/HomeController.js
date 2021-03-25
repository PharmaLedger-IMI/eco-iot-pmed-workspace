const { WebcController } = WebCardinal.controllers;

export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this._attachHandlerEconsent();
        this._attachHandlerIotQuestionarie();
        this._attachHandlerEDiary();
    }

    _attachHandlerEconsent(){
        this.on('home:econsent', (event) => {
            // this.navigateToPageTag('econsent', {date: 'a'});
        });
    }

    _attachHandlerIotQuestionarie(){
        this.on('home:questionnaire', (event) => {
            this.navigateToPageTag('questionnaire');
        });
    }

    _attachHandlerEDiary(){
        this.on('home:ediary', (event) => {
            this.navigateToPageTag('ediary');
        });
    }
}