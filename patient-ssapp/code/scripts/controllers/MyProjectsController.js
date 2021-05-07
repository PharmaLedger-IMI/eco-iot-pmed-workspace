import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';



export default class MyProjectsController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this._attachHandlerGoBack();
        this._attachHandlerHome();
    
       
        

    }
    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('platforms');
        });
    }

    _attachHandlerHome(){
        this.on('home',(event)=>{
            console.log ("home button pressed");
            this.History.navigateToPageByTag('home');
        });
    }






}