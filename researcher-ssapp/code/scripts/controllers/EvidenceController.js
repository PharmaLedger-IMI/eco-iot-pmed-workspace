const { WebcController } = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
// const axios = require('axios');
// import axios from "axios";
// var axios = require("axios").default;
const AddEvidenceViewModel = {
    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Name',
        required: true,
        readOnly: false,
        value: ''
    },
    organization: {
        name: 'organization',
        label: "Organization",
        placeholder: 'Organization',
        required: true,
        readOnly: false,
        value: ''
    },
    email: {
        name: 'email',
        label: "Email",
        placeholder: 'Email',
        required: true,
        readOnly: false,
        value: ''
    },
    title: {
        name: 'title',
        label: "Title",
        placeholder: 'Title',
        required: true,
        readOnly: false,
        value: ''
    },
    subtitle: {
        name: 'subtitile',
        label: "Subtitle",
        placeholder: 'Subtitle',
        required: true,
        readOnly: false,
        value: ''
    },
    version: {
        name: 'version',
        label: "Version",
        placeholder: 'Version',
        required: true,
        readOnly: false,
        value: ''
    },
    description: {
        name: 'description',
        label: "Description",
        placeholder: 'Description of the evidence',
        required: true,
        value: ''
    },
    saveButton: {
        name: 'saveButton',
        label: "Save",
        required: true,
        readOnly: false,
        value: ''
    },
    gobackButton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    },
    status: {
        label: "Status",
        required: true,
        options: [
            {
                label: "Draft",
                value: 'Draft'
            },
            {
                label: "Active",
                value: 'Active'
            },
            {
                label: "Inactive",
                value: 'Inactive'
            }
            
        ],
        value: ''
    },
    topics: {
        label: "Topics",
        required: true,
        options: [
            {
                label: "Topics 1",
                value: 'Topics 1'
            },
            {
                label: "Topics 2",
                value: 'Topics 2'
            },
            {
                label: "Topics 3",
                value: 'Topics 3'
            }
        ],
        value: ''
    },
    exposureBackground: {
        label: "Exposure Background",
        required: true,
        options: [
            {
                label: "Exposure Background 1",
                value: 'Exposure Background 1'
            },
            {
                label: "Exposure Background 2",
                value: 'Exposure Background 2'
            },
            {
                label: "Exposure Background 3",
                value: 'Exposure Background 3'
            },
            
            
        ],
        value: ''
    }
}
let evidenceData={
    name: "",
    contact: [],
    title: "",
    subtitle: "",
    version: "",
    description: "",
    status: "",
    topics: "",
    exposureBackground: ""
};

export default class EvidenceController extends WebcController {
    constructor(element, history) {

        super(element, history);
        this.model = AddEvidenceViewModel;
        this._attachHandlerEvidenceP1()
        this._attachHandlerEvidenceP2()
        this._attachHandlerEvidenceP3()
        this._attachHandlerEvidenceBackMenu()
        this._attachHandlerEvidenceConfirm()
        this._attachHandlerEvidence()
        this._attachHandlerEvidenceList()
        this._attachHandlerHome()
        this._attachHandlerEvidenceEdit()
        this._attachHandlerUpdateEvidence()

        // this.IotAdaptorApi = new IotAdaptorApi();
        // let id = 'cfe2eece-1744-4e5b-8a4d-455b40340861';
        // let keySSI = '27XvCBPKSWpUwscQUxwsVDTxRbaerzjCvpuajSFrnCUrhNuFJc3P3uS1hWAeCvKgPrBQvF6H4AYErQLTxKvqMjFZr7ukHRjmaFfPjuxQdyLC5fFr4qyETTyscVgZjp5q1QCgq8SXuGua9xudXdxQffu';
       
    }
    
    _attachHandlerHome(){
        this.on('evidence:home', (event) => {
            evidenceData = {
                name: "",
                contact: [],
                title: "",
                subtitle: "",
                version: "",
                description: "",
                status: "",
                topics: "",
                exposureBackground: "",
            };
            this.navigateToPageTag('home');
        });
    }
    _attachHandlerEvidence(){
        this.on('evidence:evidence', (event) => {
            this.navigateToPageTag('evidence');
        });
    }
    _attachHandlerEvidenceList(){
        this.on('evidence:list', (event) => {
            let allEvidences ;
            this.IotAdaptorApi = new IotAdaptorApi();
            let keySSI = '27XvCBPKSWpUwscQUxwsVDTxRbaerzjCvpuajSFrnCUrhNuFJc3P3uS1hWAeCvKgPrBQvF6H4AYErQLTxKvqMjFZr7ukHRjmaFfPjuxQdyLC5fFr4qyETTyscVgZjp5q1QCgq8SXuGua9xudXdxQffu';

            this.IotAdaptorApi.searchEvidence(keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log ("*********************************");
                allEvidences = evidence;
                console.log (allEvidences)
                callback(undefined, evidence);
            })
 
            this.navigateToPageTag('evidence-list', allEvidences);
        });
    }
    _attachHandlerEvidenceP1(){
        this.on('evidence:add-evidence-p1', (event) => {            
            this.navigateToPageTag('add-evidence-p1');
        });
    }
    _attachHandlerEvidenceP2(){
        this.on('evidence:add-evidence-p2', (event) => {
            evidenceData.name = this.model.name.value;
            evidenceData.contact = [
                {
                    "name": "Name of the Publisher(Organization/individual)",
                    "telecom": [
                        {
                            "system": "email",
                            "value": this.model.email.value
                        }
                    ]
                }
            ];

            // evidenceData.email = this.model.email.value;
            evidenceData.publisher = this.model.organization.value;
            
            // console.log (evidenceData);
            // console.log (this.model.title);
            this.navigateToPageTag('add-evidence-p2');
        });
    }
    _attachHandlerEvidenceP3(){
        this.on('evidence:add-evidence-p3', (event) => {
           
            evidenceData.title = this.model.title.value;
            evidenceData.subtitle = this.model.subtitle.value;
            evidenceData.version = this.model.version.value;
            evidenceData.description = this.model.description.value;
            evidenceData.topics = this.model.topics.value;
            evidenceData.status = this.model.status.value;
            evidenceData.exposureBackground = this.model.exposureBackground.value;
            // console.log(this.model.description.value);
            this.navigateToPageTag('add-evidence-p3',{allData: evidenceData});
        });
    }
    _attachHandlerUpdateEvidence(){
        this.on('evidence:update-evidence', (event) => {
           
            evidenceData.title = this.model.title.value;
            evidenceData.subtitle = this.model.subtitle.value;
            evidenceData.version = this.model.version.value;
            evidenceData.description = this.model.description.value;
            evidenceData.topics = this.model.topics.value;
            evidenceData.status = this.model.status.value;
            evidenceData.exposureBackground = this.model.exposureBackground.value;
            // console.log(this.model.description.value);
            this.navigateToPageTag('add-evidence-p3',{allData: evidenceData});
        });
    }
    _attachHandlerEvidenceConfirm(){
        this.on('evidence:confirm', (event) => {
            console.log("Evidence Confirmed")
            this.IotAdaptorApi = new IotAdaptorApi();
            let id = 'cfe2eece-1744-4e5b-8a4d-455b40340861';
            let keySSI = '27XvCBPKSWpUwscQUxwsVDTxRbaerzjCvpuajSFrnCUrhNuFJc3P3uS1hWAeCvKgPrBQvF6H4AYErQLTxKvqMjFZr7ukHRjmaFfPjuxQdyLC5fFr4qyETTyscVgZjp5q1QCgq8SXuGua9xudXdxQffu';

            this.IotAdaptorApi.createEvidence(evidenceData, keySSI, (err, evidence) => {
                if (err) {
                    return console.log(err);
                }
                console.log (evidence);
                callback(undefined, evidence);
            })
            this.navigateToPageTag('confirm-evidence');
        });
    }
    _attachHandlerEvidenceEdit(){
        this.on('evidence:edit', (event) => {
            this.navigateToPageTag('edit-evidence');
        });
    }
    _attachHandlerEvidenceBackMenu(){
        this.on('evidence:back-to-menu', (event) => {
            evidenceData = {
                name: "",
                contact: [],
                title: "",
                subtitle: "",
                version: "",
                description: "",
                status: "",
                topics: "",
                exposureBackground: "",
            };
            this.navigateToPageTag('evidence');
        });
    }
}
