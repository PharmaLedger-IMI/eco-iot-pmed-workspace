const {WebcController} = WebCardinal.controllers;


const NewRequestViewModel = {
    title: "A",
    startDate: "B",
    endDate: "C",
    status: "D",
    terms: "E",

    formatedDateStart: {
        label: "Start Date is:",
        name: "date-to-format",
        required: false,
        value: '2322352464212',
        dataFormat:"DD MM YYYY"
    },

    formatedDateEnd: {
        label: "End Date is:",
        name: "date-to-format",
        required: false,
        value: '2322352464212',
        dataFormat:"DD MM YYYY"
    }
}


export default class IssueNewRequestController extends WebcController {
    constructor(...props) {

        super(...props);

        this.model = NewRequestViewModel;

        let requestState = this.getState();

        this.model.title = requestState.title
        this.model.startDate = requestState.startDate
        this.model.endDate = requestState.endDate
        this.model.status = requestState.status
        this.model.terms = requestState.terms

        this.model.formatedDateStart.value = this.model.startDate;
        this.model.formatedDateEnd.value = this.model.endDate;


    }

}


