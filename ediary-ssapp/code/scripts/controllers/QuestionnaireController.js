const {WebcController} = WebCardinal.controllers;

const initModel = {}

const TAB_MIN_VALUE = 0;
let TAB_MAX_VALUE = 0;

export default class QuestionnaireController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel({
            votingOpen: true,
            questionnairesTabNavigator: {
                selected: 0,
                tabNavigationDisabled: true
            },
            questions: [
                {
                    id: 1,
                    title: "How annoying was it to keep the patch applied to the chest?",
                    subTitle: "(0 No hassle - 10 Maximum annoyance)",
                    response: -1,
                    answers: [
                        {id: 1, label: '1'}, {id: 2, label: '2'},
                        {id: 3, label: '3'}, {id: 4, label: '4'},
                        {id: 5, label: '5'}, {id: 6, label: '6'},
                        {id: 7, label: '7'}, {id: 8, label: '8'},
                        {id: 9, label: '9'}, {id: 10, label: '10'}
                    ]
                },
                {
                    id: 2,
                    title: "How annoying was it to keep the patch applied to the chest?",
                    subTitle: "(0 No hassle - 10 Maximum annoyance)",
                    response: -1,
                    answers: [
                        {id: 11, label: '1'}, {id: 12, label: '2'},
                        {id: 13, label: '3'}, {id: 14, label: '4'},
                        {id: 15, label: '5'}, {id: 16, label: '6'},
                        {id: 17, label: '7'}, {id: 18, label: '8'},
                        {id: 19, label: '9'}, {id: 20, label: '10'}
                    ]
                },
                {
                    id: 3,
                    title: "How annoying was it to keep the patch applied to the chest?",
                    subTitle: "(0 No hassle - 10 Maximum annoyance)",
                    response: -1,
                    answers: [
                        {id: 21, label: '1'}, {id: 22, label: '2'},
                        {id: 23, label: '3'}, {id: 24, label: '4'},
                        {id: 25, label: '5'}, {id: 26, label: '6'},
                        {id: 27, label: '7'}, {id: 28, label: '8'},
                        {id: 29, label: '9'}, {id: 30, label: '10'}
                    ]
                },
                {
                    id: 4,
                    title: "How annoying was it to keep the patch applied to the chest?",
                    subTitle: "(0 No hassle - 10 Maximum annoyance)",
                    response: -1,
                    answers: [
                        {id: 31, label: '1'}, {id: 32, label: '2'},
                        {id: 33, label: '3'}, {id: 34, label: '4'},
                        {id: 35, label: '5'}, {id: 36, label: '6'},
                        {id: 37, label: '7'}, {id: 38, label: '8'},
                        {id: 39, label: '9'}, {id: 40, label: '10'}
                    ]
                },
                {
                    id: 5,
                    title: "How much security did the remote monitoring system give you?",
                    subTitle: "(0 No security - 10 A lot of security)",
                    response: -1,
                    answers: [
                        {id: 41, label: '1'}, {id: 42, label: '2'},
                        {id: 43, label: '3'}, {id: 44, label: '4'},
                        {id: 45, label: '5'}, {id: 46, label: '6'},
                        {id: 47, label: '7'}, {id: 48, label: '8'},
                        {id: 49, label: '9'}, {id: 50, label: '10'}
                    ]
                }
            ],
            buttonsState: {
                showLeft: false,
                showRight: true,
                showFeedback: false
            }
        });

        TAB_MAX_VALUE = this.model.questions.length;

        this.onTagClick('prev', (event) => {
            let currentIndexSelected = this.model.questionnairesTabNavigator.selected;
            if (currentIndexSelected > TAB_MIN_VALUE) {
                this.model.questionnairesTabNavigator.selected = currentIndexSelected - 1;
            }
            this.computeButtonStates();
        });

        this.onTagClick('next', (event) => {
            let currentIndexSelected = this.model.questionnairesTabNavigator.selected;
            if (currentIndexSelected < TAB_MAX_VALUE) {
                this.model.questionnairesTabNavigator.selected = currentIndexSelected + 1;
            }
            this.computeButtonStates();
        });

        this.onTagClick('send-feedback', (event) => {
            this.model.votingOpen = false;
        });

        this.onTagClick('finish-questionnaire', (event) => {
            this.navigateToPageTag('home');
        });
    }

    computeButtonStates() {
        this.model.buttonsState.showLeft = this.model.questionnairesTabNavigator.selected > 0;
        this.model.buttonsState.showRight = this.model.questionnairesTabNavigator.selected < TAB_MAX_VALUE - 1;

        if (this.model.questionnairesTabNavigator.selected === TAB_MAX_VALUE - 1) {
            this.model.buttonsState.showLeft = false;
            this.model.buttonsState.showRight = false;
            this.model.buttonsState.showFeedback = true;
        }
    }

}
