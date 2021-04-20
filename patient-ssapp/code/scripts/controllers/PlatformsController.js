import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';



export default class PlatformsController extends ContainerController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('home');
        });
    }





}