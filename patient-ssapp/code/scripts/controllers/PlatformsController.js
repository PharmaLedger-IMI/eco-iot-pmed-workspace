import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';



export default class PlatformsController extends ContainerController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();
        this._attachHandlerMyProjects();
        this._attachHandlerNewProject();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('home');
        });
    }

    _attachHandlerMyProjects(){
        this.on('platforms:myprojects',(event)=>{
            console.log ("MyProjects button pressed");
            this.History.navigateToPageByTag('myprojects');
        });
    }
    _attachHandlerNewProject(){
        this.on('platforms:newproject',(event)=>{
            console.log ("NewProject button pressed");
            this.History.navigateToPageByTag('newproject');
        });
    }





}