const commonServices = require("common-services");
const {ResultsService, StudiesService} = commonServices;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const CONSTANTS = commonServices.Constants;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class AddResultController extends BreadCrumbManager {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: "New Result",
                tag: "add-result"
            }
        );

        this.model.studyID = prevState.uid;
        this.model = this.getResultDetailsViewModel();
        this.CommunicationService = getCommunicationServiceInstance();
        this.model.participantsDIDs = [];
        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, studyData) => {
            if (err){
                return console.log(err);
            }
            this.model.studytitle = studyData.title;
            if (studyData.participants) studyData.participants.forEach(participant=>{this.model.participantsDIDs.push(participant.participantInfo.patientDID)
            });
        });

        this._attachHandlerGoBack();
        this._attachHandlerAddResultConfirm();
        this._attachHandlerFileOperation();

    }

    sendMessageToTps( subjectsDids, resultSReadSSI) {
        subjectsDids.forEach(did => {
            this.CommunicationService.sendMessage( did, {
                operation: CONSTANTS.MESSAGES.RESEARCHER.NEW_RESULT,
                ssi: resultSReadSSI,
                shortDescription: 'Researcher sent result to patient',
            });
        })
    }

    prepareResultDSUData() {
        let result = {
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            description: this.model.description.value,
            studyID: this.model.studyID,
            studyTitle: this.model.studytitle,
            filename: this.model.filesResult.file.name
        }
        console.log(result);
        return result;
    }

    saveResult() {

        if (this.model.participantsDIDs.length===0) {
            let resultState = {
                uid: this.model.studyID,
                breadcrumb: this.model.toObject('breadcrumb'),
                message: {
                    content: `There are no participants for this study. Please try again later.`,
                    type: 'error'
                }
            }
            this.navigateToPageTag('results-list', resultState);
            return;
        }

        window.WebCardinal.loader.hidden = false;
        this.ResultsService = new ResultsService();
        this.ResultsService.saveResult(this.prepareResultDSUData(), (err, result) => {
            let resultState = {};
            if (this.model.filesResult.file.file) {
                this.ResultsService.addResultFile(this.model.filesResult.file, result.uid);
            }
            if (err) {
                resultState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                }
            } else {
                resultState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `The result has been generated and sent to all participants within the study ${this.model.studytitle}!`,
                        type: 'success'
                    }
                }
            }
            this.sendMessageToTps(this.model.participantsDIDs, result.sReadSSI);
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('results-list', resultState);
        })

    }

    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
            this.navigateToPageTag('results-list', { uid: this.model.studyID, breadcrumb: this.model.toObject('breadcrumb') });
        });
    }

    _attachHandlerFileOperation(){
        this.model.onChange('filesResult', () => {
            let filesArray = this.model.filesResult.files || [];
        });

        this.on('add-result-file', (event) => {
            let filesArray = event.data;
            if (filesArray && filesArray.length > 0) {
                this.model.filesResult.file.file = filesArray[0];
                this.model.filesResult.file.name = filesArray[0].name;
            } else {
                this.model.filesResult.file.file = null;
                this.model.filesResult.file.name = "";
            }
        });
    }

    _attachHandlerAddResultConfirm() {
        this.onTagClick('result-confirm', () => {
            this.saveResult();
            //this.navigateToPageTag('');
        });
    }

    getResultDetailsViewModel() {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Title of the result',
                required: true,
                value: ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle",
                placeholder: 'Subtitle of the result',
                value: ""
            },
            version: {
                name: 'version',
                id: 'Version',
                label: "Version",
                placeholder: 'Version',
                value: ""
            },
            status: {
                label: "Status",
                required: true,
                options: [{
                    label: "Draft",
                    value: 'draft'
                },
                {
                    label: "Active",
                    value: 'active'
                },
                {
                    label: "Retired",
                    value: 'retired'
                },
                {
                    label: "Unknown",
                    value: 'unknown'
                }
                ],
                value: ""
            },
            topics: {
                label: "Topics",
                required: true,
                options: [{
                    label: "Topic 1",
                    value: 'Topic 1'
                },
                {
                    label: "Topic 2",
                    value: 'Topic 2'
                },
                {
                    label: "Topic 3",
                    value: 'Topic 3'
                },
                {
                    label: "Topic 4",
                    value: 'Topic 4'
                }
                ],
                value: ""
            },
            exposureBackground: {
                label: "Exposure Background",
                required: true,
                options: [{
                    label: "EP_1",
                    value: 'EP_1'
                },
                {
                    label: "EP_2",
                    value: 'EP_2'
                },
                {
                    label: "EP_3",
                    value: 'EP_3'
                },
                {
                    label: "EP_4",
                    value: 'EP_4'
                },
                ],
                value: ""
            },
            description: {
                name: 'description',
                label: "Description",
                placeholder: 'Provide description of the result',
                required: true,
                value: ""
            },
            id: {
                name: 'id of the result',
                label: "id",
                placeholder: 'id of the result',
                value: '001'
            },
            filesResult: {
                topLabel: "Select pdf files to upload the results",
                label: "",
                accept: ".pdf",
                listFiles: true,
                filesAppend: false,
                file: {},
                value: ""
            }
        }
    }

}