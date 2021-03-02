import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';

export default class HomeController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this._attachHandlerEconsent();
        this._attachHandlerIotQuestionarie();
        this._attachHandlerEDiary();
    }

    _attachHandlerEconsent(){
        this.on('home:econsent', (event) => {
            console.log ("Button pressed");
            this.History.navigateToPageByTag('econsent');
        });
    }

    _attachHandlerIotQuestionarie(){
        this.on('home:questionarie', (event) => {
            console.log ("Button 2 pressed");
            this.History.navigateToPageByTag('questionarie');
        });
    }

    _attachHandlerEDiary(){
        this.on('home:ediary', (event) => {
            console.log ("Button 2 pressed");
            this.History.navigateToPageByTag('ediary');
        });
    }
}