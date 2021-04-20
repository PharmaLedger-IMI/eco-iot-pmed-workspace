import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';

const ViewPersonalHealthDataModel = {

    name: {
        name: 'NAME',
        label: "name",
        value: 'name'
    },
    id: {
        name: 'ID',
        label: "id",
        value: 'id'
    }
}

export default class MyDataMainPageController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this._attachHandlerGoBack();
        this.setModel(ViewPersonalHealthDataModel);

        let receivedModel = this.History.getState();

        console.log("Welcome: " + receivedModel.nameId);
        this.model.name = receivedModel.nameId
        this.model.id   = receivedModel.profileId



    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('home');
        });
    }


}