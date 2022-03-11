const {WebcController} = WebCardinal.controllers;

export default class AlertController extends WebcController  {
    constructor(...props) {
        super(...props);
        console.log('PROPS IN ALERT',props);

        console.log('Modelul primit',this.model);
    }
}