import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';

export default class HomeController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this._attachHandlerEditProfile();
        this._attachHandlerMyData();
        this._attachHandlerMyPlatforms();
        this._attachHandlerFeedback();
    }

    _attachHandlerEditProfile(){
        this.on('home:profile', (event) => {
            console.log ("Profile button pressed");
            this.History.navigateToPageByTag('profile');
        });
    }

    _attachHandlerMyData(){
        this.on('home:mydata', (event) => {
            console.log ("My Data button pressed");
            this.History.navigateToPageByTag('mydata');
        });
    }

    _attachHandlerMyPlatforms(){
        this.on('home:platforms', (event) => {
            console.log ("Platforms button pressed");
            this.History.navigateToPageByTag('mydata');
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            console.log ("Feedback button pressed");
            this.History.navigateToPageByTag('index');
        });
    }
}