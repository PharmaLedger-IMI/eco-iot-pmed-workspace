const {WebcController} = WebCardinal.controllers;

// const ViewPatientList = {
//
//     name: {
//         name: 'NAME',
//         label: "name",
//         value: 'name'
//     },
//     id: {
//         name: 'ID',
//         label: "id",
//         value: 'id'
//     }
// }


export default class ListDevicesController extends WebcController {
    constructor(element, history) {
        super(element, history);

        //this.setModel(ViewPatientList);

        this._attachHandlerGoBack();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }





}