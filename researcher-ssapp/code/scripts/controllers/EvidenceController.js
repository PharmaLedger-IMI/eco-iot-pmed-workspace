const { WebcController } = WebCardinal.controllers;
import IotAdaptorApi from "../services/IotAdaptorApi.js";
import CommunicationService from "../services/CommunicationService.js";

import NewEvidenceService from "../services/newEvidenceService.js";
import {evidenceModelHL7} from "../models/HL7/EvidenceModel.js";



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
            },
            
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
let evidenceData = {
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
      

        this.IotAdaptorApi = new IotAdaptorApi();
        let id = '17110073-c4a5-465f-93da-d84009359133';
        let keySSI = '27XvCBPKSWpUwscQUxwsVDTxRbtRUj2BgpWpCpmb1K68vgLwMCAcwnDZytNtFmJ5cKvSjfLmBBZas8oGJpHFudxF1gF7thkV7uWv4AywGuZKqUvunP2erz5EkJn9M4qPAkxxinSJDSLfawZuVba7NTR';

        this.IotAdaptorApi.getEvidence(id, keySSI, (err, evidence) => {
            if (err) {
                return console.log(err);
            }
            callback(undefined, evidence);
        })
        
        // // debugger
        // this.IotAdapterApi = new IotAdapterApi()
        // // debugger
        // this.IotAdapterApi.getEvidence("17110073-c4a5-465f-93da-d84009359133",(err, evidence) => {
        //     // debugger
        //     if (err) {
        //         return console.log(err);
        //     }
        //     callback(undefined, evidence);
        // })
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("X-KeySSI", "27XvCBPKSWpUwscQUxwsVDTxRbtRUj2BgpWpCpmb1K68vgLwMCAcwnDZytNtFmJ5cKvSjfLmBBZas8oGJpHFudxF1gF7thkV7uWv4AywGuZKqUvunP2erz5EkJn9M4qPAkxxinSJDSLfawZuVba7NTR");
        
        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };
        
        // fetch("http://localhost:8080/iotAdapter/get-evidence/17110073-c4a5-465f-93da-d84009359133", requestOptions)
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => {
        //     debugger 
        //     console.log('error', error)
        //   });
    

        // const url = 'http://localhost:8080/iotAdapter/get-evidence/17110073-c4a5-465f-93da-d84009359133';
        // const response =  fetch(url, {
        //     method: 'GET',
        // //   body: JSON.stringify(myBody), // string or object
        //     headers: {
        //     'Content-Type': 'application/json',
        //     'X-KeySSI': "27XvCBPKSWpUwscQUxwsVDTxRbtRUj2BgpWpCpmb1K68vgLwMCAcwnDZytNtFmJ5cKvSjfLmBBZas8oGJpHFudxF1gF7thkV7uWv4AywGuZKqUvunP2erz5EkJn9M4qPAkxxinSJDSLfawZuVba7NTR",
        //     // "Access-Control-Allow-Origin" : "*", 
        //     "Access-Control-Allow-Credentials" : true ,
        //     "withCredentials": true
            
        //     }
        // //   credentials: true
        // });
        // console.log (response);
            //prepare contract based on input
            
        }

        
       
    
    
    _attachHandlerHome(){
        this.on('evidence:home', (event) => {
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
            this.navigateToPageTag('evidence-list');
        });
    }
    _attachHandlerEvidenceP1(){
        this.on('evidence:add-evidence-p1', (event) => {
            // console.log (evidenceData);
            let myBody ={};
            // let myJson;
            // const url = 'http://localhost:8080/iotAdapter/create-evidence-dsu';
            //     const response =  fetch(url, {
            //       method: 'POST',
            //       body: myBody, // string or object
            //       headers: {
            //         'Content-Type': 'application/json'
                    
            //       },
            //       credentials: true
            //     });
            //     console.log (response);
            
            // axios.post('http://localhost:8080/iotAdapter/create-evidence-dsu', {
            //     data: myBody,
            //     credentials: true
            //   })
            //   .then(function (response) {
            //     console.log(response);
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
            //   fetch('http://localhost:8080/iotAdapter/create-evidence-dsu', {
            //     method: "POST",
            //     body: JSON.stringify(_data),
            //     headers: {"Content-type": "application/json; charset=UTF-8"}
            //     })
            //     .then(response => response.json()) 
            //     .then(json => console.log(json))
            //     .catch(err => console.log(err));
            
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
            
            console.log (evidenceData);
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
            // console.log (evidenceData);
            let initEvidence = JSON.parse(JSON.stringify(evidenceModelHL7));

            initEvidence.EvidenceName.value = this.model.name.value;
            initEvidence.EvidenceOrganization.value = this.model.organization.value;
            initEvidence.EvidenceEmail.value = this.model.email.value;

            initEvidence.EvidenceTitle.value = this.model.title.value;
            initEvidence.EvidenceSubtitle.value = this.model.subtitle.value;
            initEvidence.EvidenceVersion.value = this.model.version.value;
            initEvidence.EvidenceStatus.value = this.model.status.value;
            initEvidence.EvidenceTopics.value = this.model.topics.value;
            initEvidence.EvidenceExposureBackground.value = this.model.exposureBackground.value;
            initEvidence.EvidenceDescription.value = this.model.description.value;
           
            
         
    
            //console.log(initEvidence);
    
    
            this.newEvidenceService = new NewEvidenceService(this.DSUStorage);
            this.newEvidenceService.saveNewEvidence(initEvidence, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this.model.dsuStatus = "DSU contract saved and sent to patient with keySSI: ".concat('', data.KeySSI.substr(data.KeySSI.length - 10));
    
                this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.RESEARCHER_IDENTITY);
                this.sendMessageToPatient('evidence-response', data.uid);
            });
            this.navigateToPageTag('add-evidence-p3',{allData: evidenceData});
        });
    }
    _attachHandlerEvidenceConfirm(){
        this.on('evidence:confirm', (event) => {
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
            this.navigateToPageTag('evidence');
        });
    }

    sendMessageToPatient(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.IOT.PATIENT_IDENTITY, {
            operation: operation,
            ssi: ssi
        });
    }

    
        

}
