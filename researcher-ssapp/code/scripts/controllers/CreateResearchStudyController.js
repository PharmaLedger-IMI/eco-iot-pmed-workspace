const {WebcController} = WebCardinal.controllers;


export default class CreateResearchStudyController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model = this.getResearchViewModel(prevState);
        this._attachHandlerResearcherBackMenu();
        this._attachHandlerResearchStudySummary();
        this.prepareResearcherData();

    }

    _attachHandlerResearchStudySummary() {
        this.onTagClick('research:summary', (event) => {
            const researcherData = this.prepareResearcherData();
            this.navigateToPageTag("research-study-summary", researcherData);
        });
    }

    _attachHandlerResearcherBackMenu() {
        this.onTagClick('research:back-to-menu', (event) => {
            this.navigateToPageTag('home');
        });
    }

    prepareResearcherData() {
        return {
            title: this.model.title.value,
            primaryPurposeType: this.model.primaryPurposeType.value,
            phase: this.model.phase.value,
            status: this.model.status.value,
            note: this.model.note.value
        };
    }

    getResearchViewModel(prevState) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Name for this study',
                required: true,
                value: prevState.title || ""
            },
            note: {
                name: 'note',
                id: 'note',
                label: "Note",
                placeholder: 'Comments made about the study',
                value: prevState.note || ""
            },
            status: {
                label: "Status",
                required: true,
                options: [
                    {
                        label: "Active",
                        value: 'active'
                    },
                    {
                        label: "Administratively completed",
                        value: 'administratively-completed'
                    },
                    {
                        label: "Approved",
                        value: 'approved'
                    },
                    {
                        label: "Closed to accrual",
                        value: 'closed-to-accrual'
                    },
                    {
                        label: "Closed to accrual and intervention",
                        value: 'closed-to-accrual-and-intervention'
                    },
                    {
                        label: "Completed",
                        value: 'completed'
                    },
                    {
                        label: "Disapproved",
                        value: 'disapproved'
                    },
                    {
                        label: "In review",
                        value: 'in-review'
                    },
                    {
                        label: "Temporarily closed to accrual",
                        value: 'temporarily-closed-to-accrual'
                    },
                    {
                        label: "Temporarily closed to accrual and intervention",
                        value: 'temporarily-closed-to-accrual-and-intervention'
                    },
                    {
                        label: "Withdrawn",
                        value: 'withdrawn'
                    }
                ],
                value: prevState.status || ""
            },
            primaryPurposeType: {
                label: "Primary Purpose Type",
                required: true,
                options: [{
                    label: "Treatment",
                    value: 'treatment'
                },
                    {
                        label: "Prevention",
                        value: 'prevention'
                    },
                    {
                        label: "Diagnostic",
                        value: 'diagnostic'
                    },
                    {
                        label: "Supportive care",
                        value: 'supportive-care'
                    },
                    {
                        label: "Screening",
                        value: 'screening'
                    },
                    {
                        label: "Health services research",
                        value: 'health-services-research'
                    },
                    {
                        label: "Basic science",
                        value: 'basic-science'
                    },
                    {
                        label: "Device feasibility",
                        value: 'device-feasibility'
                    }
                ], 
                value: prevState.primaryPurposeType || ""
            },
            phase: {
                label: "Phase",
                required: true,
                options: [{
                    label: "n-a",
                    value: 'n-a'
                },
                    {
                        label: "Early-phase-1",
                        value: 'early-phase-1'
                    },
                    {
                        label: "Phase-1",
                        value: 'phase-1'
                    },
                    {
                        label: "Phase-1-phase-2",
                        value: 'phase-1-phase-2'
                    },
                    {
                        label: "Phase-2",
                        value: 'phase-2'
                    },
                    {
                        label: "Phase-2-phase-3",
                        value: 'phase-2-phase-3'
                    },
                    {
                        label: "Phase-3",
                        value: 'phase-3'
                    },
                    {
                        label: "Phase-4",
                        value: 'phase-4'
                    }
                ],
                value: prevState.phase || ""
            }
        }
    }

}