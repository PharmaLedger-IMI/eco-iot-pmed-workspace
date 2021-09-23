const { WebcController } = WebCardinal.controllers;
import CommunicationService from "../services/CommunicationService.js";
import newEvidenceService from "../services/newEvidenceService.js";


const DisplayEvidenceModel ={

    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Enter your full name',
        required: true,
        readOnly: true,
        value: ''
    },


    organization: {
        name: 'organization',
        label: "Organization",
        placeholder: 'Enter your organization',
        required: true,
        readOnly: true,
        value: ''
    },

    email: {
        name: 'email',
        label: "Email",
        placeholder: 'Enter your email',
        required: true,
        readOnly: true,
        value: ''
    },

    title: {
        name: 'title',
        label: "Title",
        placeholder: 'Enter your title',
        required: true,
        readOnly: true,
        value: ''
    },

    subtitle: {
        name: 'subtitle',
        label: "Subtitle",
        placeholder: 'Enter your subtitle',
        required: true,
        readOnly: true,
        value: ''
    },

    version: {
        name: 'version',
        label: "Version",
        placeholder: 'Enter your version',
        required: true,
        readOnly: true,
        value: ''
    },

    status: {
        name: 'status',
        label: "Status",
        placeholder: 'Enter your status',
        required: true,
        readOnly: true,
        value: ''
    },

    topics: {
        name: 'topics',
        label: "Topics",
        placeholder: 'Enter your topics',
        required: true,
        readOnly: true,
        value: ''
    },

    exposurebackground: {
        name: 'exposure brackground',
        label: "Exposure Background",
        placeholder: 'Enter your exposure background',
        required: true,
        readOnly: true,
        value: ''
    },

    description: {
        name: 'description',
        label: "Description",
        placeholder: 'Enter your description',
        required: true,
        readOnly: true,
        value: ''
    },

}


export default class FeedbackController extends WebcController {
    constructor(element, history) {
        super(element, history);

       
        this._attachHandlerGoBack();
        this._attachHandlerGoSampleFeedBack();

        this.model = DisplayEvidenceModel;

        this.newEvidenceService = new newEvidenceService(this.DSUStorage);

        if (this.getState()){
            let receivedState = this.getState();
            console.log("Received State: " + JSON.stringify(receivedState, null, 4));

            this.model.information_evidence_state_ssi = receivedState.information_evidence_ssi;
            console.log(this.model.information_evidence_state_ssi);
            this.newEvidenceService.mount(this.model.information_evidence_state_ssi,(err,data) => {
                if (err) {
                    return console.log(err);
                }
                //console.log("done");
                console.log(JSON.stringify(data,null,4));
                //const name = JSON.stringify(data.EvidenceName,null,4);

                this.model.evidence = data;

                this.model.name.value = data.EvidenceName.value
                this.model.organization.value = data.EvidenceOrganization.value
                this.model.email.value = data.EvidenceEmail.value 
    
                this.model.title.value = data.EvidenceTitle.value 
                this.model.subtitle.value = data.EvidenceSubtitle.value 
                this.model.version.value = data.EvidenceVersion.value
                this.model.status.value = data.EvidenceStatus.value
                this.model.topics.value = data.EvidenceTopics.value 
                this.model.exposurebackground.value = data.EvidenceExposureBackground.value 
                this.model.description.value = data.EvidenceDescription.value

                console.log(data.EvidenceName.value)
                //this.model.evidence.email.value = data.EvidenceEmail.value
                //this.model.evidence.title = data.EvidenceTitle.value




            });

           
        }


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerGoSampleFeedBack(){
        this.on('see-the-evidence', (event) => {
            console.log ("see the evidence");
            this.navigateToPageTag('personalized-feedback2');
        });
    }

}