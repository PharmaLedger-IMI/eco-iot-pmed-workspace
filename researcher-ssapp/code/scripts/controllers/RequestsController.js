const {WebcController} = WebCardinal.controllers;


export default class RequestsController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model = this.getRequestViewModel(prevState);

        this._attachHandlerIssueNewRequest()
        this._attachHandlerGoBack()


    }

    _attachHandlerIssueNewRequest(){
        this.onTagClick('new:request', (event) => {
            console.log ("New information request button pressed");
            const requestData = this.prepareRequestData();
            this.navigateToPageTag("add-request-summary", requestData);
        });
    }

    _attachHandlerGoBack(){
        this.onTagClick('request:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('requests-main');
        });
    }

    prepareRequestData() {
        return {
            title: this.model.title.value,
            status: this.model.status.value,
            terms: this.model.terms.value,
            startdate: this.model.startdate.value,
            enddate: this.model.enddate.value
        };
    }

    getRequestViewModel(prevState) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title of the request",
                placeholder: 'Request for oxygen data between June-August 2021',
                required: true,
                value: prevState.title || ""
            },
            startdate: {
                name: 'Start Date',
                id: 'Start Date',
                label: "Starting date",
                placeholder: 'Starting date',
                value: prevState.startdate || ""
            },
            enddate: {
                name: 'End Date',
                id: 'End Date',
                label: "Ending date",
                placeholder: 'Ending date',
                value: prevState.enddate || ""
            },
            // https://www.hl7.org/fhir/valueset-contract-status.html Revise it!
            status: {
                label: "Request Status",
                required: true,
                options: [
                    {
                        label: "Cancelled",
                        value: 'Cancelled'
                    },
                    {
                        label: "Executable",
                        value: 'Executable'
                    },
                    {
                        label: "Executed",
                        value: 'Executed'
                    },
                    {
                        label: "Offered",
                        value: 'Offered'
                    }
                ],
                value: prevState.status || ""
            },
            terms: {
                label: "Terms",
                required: true,
                options: [
                    {
                        label: "ECG",
                        value: "ECG"
                    },
                    {
                        label: "Respiration",
                        value: "Respiration"
                    },
                    {
                        label: "SpO2",
                        value: "SpO2"
                    },
                    {
                        label: "Temperature",
                        value: "Temperature"
                    },
                ],
                value: prevState.terms || ""
            }
        }
    }

}


