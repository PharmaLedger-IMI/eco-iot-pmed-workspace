import AvailableStudiesToParticipateService from "../services/AvailableStudiesToParticipateService.js";

const {WebcController} = WebCardinal.controllers;

const ViewParticipateToStudiesModel = {

    participate_to_studies: {
        label: "Choose one option to participate in a study:",
        required: true,
        options: [
            {
                label: "Vit D study",
                value: "Vit D study",
                checked: true
            },
            {
                label: "Alzheimer Thau Study",
                value: "Vital signals at La Paz Hospital"
            },
            {
                label: "Analysis of COPD",
                value: "Analysis of COPD"
            }
        ],
        value: ''
    }
}


export default class ParticipateToStudyController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = ViewParticipateToStudiesModel;

        this._attachHandlerGoBack();

        //List all available studies able to participate
        this.AvailableStudiesToParticipateService = new AvailableStudiesToParticipateService(this.DSUStorage);

        let all_available_studies;
        this.AvailableStudiesToParticipateService.getStudies((err, data) => {
            if (err) {
                return console.log(err);
            }
            all_available_studies = data;
            console.log("All available Studies able to participate are: " + all_available_studies.length);
            // for (let i = 0; i < all_available_studies.length; i+=1) {
            //    console.log(all_available_studies[i]['study']);
            //     // Push studies from dsu objects
            //     this.model.participate_to_studies.options.push({
            //         label: all_available_studies[i]['study'],
            //         value: all_available_studies[i]['study']
            //     });
            // }
            this.model.participate_to_studies.options.push({
                label: all_available_studies[all_available_studies.length-1]['study'],
                value: all_available_studies[all_available_studies.length-1]['study']
            });
        });





        let radioSubmitData = () => {
            let choice = this.model.participate_to_studies.value;
            if (choice === "Vit D study"){
                console.log('Vit D study!')
                this.navigateToPageTag('home');
            }
        }
        this.on("Participate to Study",radioSubmitData, true);



    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('platforms');
        });
    }


}