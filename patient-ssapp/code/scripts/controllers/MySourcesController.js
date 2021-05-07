import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";


const healthsourcesmodel = {

    myhealthsources: {
        label: "My sources:",
        required: true,
        options: [{
            label: "All sources",
            value: 'All sources'
        },
            {
                label: "St. Maarten Medical Center",
                value: "St. Maarten Medical Center"
            },
             {
                label: "Hospital Universitario Infanta Leonor",
                value: "Hospital Universitario Infanta Leonor"
            }
        ],
        value: ''
    }
}


export default class MySourcesController extends ContainerController {
    constructor(element) {
        super(element);

        this.model = this.setModel(JSON.parse(JSON.stringify(healthsourcesmodel)));

        this.feedbackEmitter = null;

        this.on('openFeedback', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.feedbackEmitter = e.detail;
        });

        let radioSubmit = () => {
            let choice = this.model.myhealthsources.value;
            if (choice === "All sources"){
                console.log("All sources click!")
            } else {
                console.log("something else clicked!")
            }
        }
        this.on("Select",radioSubmit,true);
    }
}