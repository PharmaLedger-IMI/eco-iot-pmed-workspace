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
        this.model.participants_withPermission = [];
        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, studyData) => {
            if (err){
                return console.log(err);
            }
            this.model.studytitle = studyData.title;
            if (studyData.participants) {
                this.model.participants_withPermission = studyData.participants.filter(p => p.dpermission === true);
                this.model.participants_withPermission.forEach(participant => {this.model.participantsDIDs.push(participant.participantInfo.patientDID)})
            }
        });

        this._attachHandlers();

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

    _attachHandlers() {

        this.model.addExpression("isResultFilled", () => {
                if (this.model.title.value.trim() === "" || this.model.subtitle.value.trim() === ""
                    || this.model.version.value.trim() === "" || this.model.status.value.trim() === ""
                    || this.model.topics.value.trim() === "" || this.model.exposureBackground.value.trim() === ""
                    || this.model.description.value.trim() === "") {
                    return true;
                }
                return false;
            }, ["title", "subtitle", "version", "status", "topics", "exposureBackground", "description"]
        )

        this.onTagClick('go:back', () => {
            this.navigateToPageTag('results-list', { uid: this.model.studyID, breadcrumb: this.model.toObject('breadcrumb') });
        });

        this.model.onChange('filesResult', () => {
            let filesArray = this.model.filesResult.files || [];
        });

        this.on('add-result-file', (event) => {
            let filesArray = event.data;
            if (filesArray && filesArray.length > 0) {
                this.model.filesResult.file.file = filesArray[0];
                this.model.filesResult.file.name = filesArray[0].name;
                this.model.filesResult.chosen = filesArray[0].name;
            } else {
                this.model.filesResult.file.file = null;
                this.model.filesResult.file.name = "";
                this.model.filesResult.chosen = "";
            }
        });

        this.onTagClick('result-confirm', () => {
            this.saveResult();
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
                    label: "Treatment",
                    value: 'Treatment'
                },
                {
                    label: "Education",
                    value: 'Education'
                },
                {
                    label: "Assessment",
                    value: 'Assessment'
                }
                ],
                value: ""
            },
            exposureBackground: {
                name: 'exposure background',
                id: 'exposure background',
                label: "Exposure Background",
                placeholder: 'PICO Model description',
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
                topLabel: "Select result file (*.pdf)",
                label: "Select file",
                accept: ".pdf",
                required: true,
                listFiles: true,
                filesAppend: false,
                file: {},
                value: "Select file",
                chosen: ""
            }
        }
    }

}