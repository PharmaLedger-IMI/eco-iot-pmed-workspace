const { WebcController } = WebCardinal.controllers;

export default class PlatformsController extends WebcController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();
        this._attachHandlerMyProjects();
        this._attachHandlerNewProject();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerMyProjects(){
        this.on('platforms:myprojects',(event)=>{
            console.log ("MyProjects button pressed");
            this.navigateToPageTag('myprojects');
        });
    }
    _attachHandlerNewProject(){
        this.on('platforms:newproject',(event)=>{
            console.log ("NewProject button pressed");
            this.navigateToPageTag('newproject');
        });
    }





}