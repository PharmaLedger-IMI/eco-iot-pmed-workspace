const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const DidService =commonServices.DidService;
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const MessageHandlerService = commonServices.MessageHandlerService;
import StudiesService from "../services/StudiesService.js";
import DPermissionService from "../services/DPermissionService.js";
const { DataSource } = WebCardinal.dataSources;

class StudiesDataSource extends DataSource {
    constructor(...props) {
        super(...props);
        this.model.studies = props[0];
        this.model.elements = 10;
        this.setPageSize(this.model.elements);
        this.model.noOfColumns = 4;
    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        console.log({startOffset, dataLengthForCurrentPage});
        if (this.model.studies.length <= dataLengthForCurrentPage ){
            this.setPageSize(this.model.studies.length);
        }
        else{
            this.setPageSize(this.model.elements);
        }
        let slicedData = [];
        this.setRecordsNumber(this.model.studies.length);
        if (dataLengthForCurrentPage > 0) {
            slicedData = Object.entries(this.model.studies).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        } else {
            slicedData = Object.entries(this.model.studies).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        }
        return slicedData;
    }
}


export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getInitialModel();

        this.initHandlers();
        this.initServices();
    }

    initHandlers() {
        this.attachHandlerNewStudy();
    }

    attachHandlerNewStudy() {
        this.onTagClick('new:study', () => {
            this.navigateToPageTag('create-research-study');
        });
    }

    // TODO: Remove this when tests are completed.
    sendEchoMessageToIotAdaptor() {
        this.CommunicationService = getCommunicationServiceInstance();
        this.CommunicationService.sendMessage("did:ssi:name:iot:iotAdaptor", {
            message: "Echo message"
        });
    }

    async initServices() {
        this.DPermissionService = new DPermissionService();
        this.StudiesService = new StudiesService();

        const getStudies = () => {
            return new Promise ((resolve, reject) => {
                this.StudiesService.getStudies((err, received_studies ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_studies)
                })
            })
        }

        getStudies().then(data => {
            this.model.hasStudies = data.length !== 0;
            this.model.studiesDataSource = new StudiesDataSource(data);
            const { studiesDataSource } = this.model;
            this.onTagClick("view", (model) => {
                const {title} = model;
                let chosenStudy;
                data.forEach(element => {if(element.title === title) chosenStudy = element});
                let viewData = {
                    title: chosenStudy.title,
                    startdate: chosenStudy.startdate,
                    enddate: chosenStudy.enddate,
                    description: chosenStudy.description,
                    age: chosenStudy.age,
                    sex: chosenStudy.sex,
                    pathologies: chosenStudy.pathologies,
                    others: chosenStudy.others,
                    data: chosenStudy.data,
                    uid: chosenStudy.uid,
                    status: chosenStudy.status,
                    breadcrumb:this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('view-research-study', viewData);
            });
            this.onTagClick("edit", (model) => {
                const {title} = model;
                let chosenStudy;
                data.forEach(element => {if(element.title === title) chosenStudy = element});
                let viewData = {
                    title: chosenStudy.title,
                    startdate: chosenStudy.startdate,
                    enddate: chosenStudy.enddate,
                    description: chosenStudy.description,
                    age: chosenStudy.age,
                    sex: chosenStudy.sex,
                    pathologies: chosenStudy.pathologies,
                    others: chosenStudy.others,
                    data: chosenStudy.data,
                    uid: chosenStudy.uid
                }
                const editStudy = {...viewData, ...{header1: "Edit Study"}}
                this.navigateToPageTag('create-research-study', editStudy);
            });
            this.onTagClick("feedback-list", (model) => {
                console.log('this is feedback Page!');
                this.navigateToPageTag('feedback-list', model);
            });
            this.onTagClick("evidence", (model) => {
                const {title} = model;
                let chosenStudy;
                data.forEach(element => {if(element.title === title) chosenStudy = element});
                this.navigateToPageTag('evidence-list', chosenStudy.uid);
            });
            this.onTagClick("data", (model) => {
                //const { participants } = model;
                console.log('this is data Page!');
            });
            this.onTagClick("prev-page", () => studiesDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => studiesDataSource.goToNextPage());
            this.sendEchoMessageToIotAdaptor();
        })

        this.model.did = await DidService.getDidServiceInstance().getDID();
        MessageHandlerService.init(async (err, data) =>{
            if (err) {
                return console.error(err);
            }

            data = JSON.parse(data);
            console.log('Received Message', data);

            // TODO: Review this behaviour
            switch (data.operation) {
                case 'd-permission-list': {
                    this.DPermissionService.mount(data.d_permission_keyssi_list[data.d_permission_keyssi_list.length - 1], (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    console.log("Received D Permission List");
                    break;
                }
            }
        });

    }

    getInitialModel() {
        return {
            did: "",
            breadcrumb : [{
                label:"Dashboard",
                tag:"home",
                state:{}
            }]
        };
    }
}