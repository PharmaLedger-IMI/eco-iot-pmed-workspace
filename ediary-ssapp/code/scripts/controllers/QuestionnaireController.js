import QuestionnaireService from "./services/QuestionnaireService.js";

const {WebcController} = WebCardinal.controllers;

const getInitModel = () => {
    return {
        votingOpen: true,
        questionnairesTabNavigator: {
            selected: 0
        },
        questions: [],
        buttonsState: {
            showLeft: false,
            showRight: true,
            showFeedback: false
        }
    };
}

const TAB_MIN_VALUE = 0;
let TAB_MAX_VALUE = 0;

export default class QuestionnaireController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel(getInitModel());

        this.tabsContainer = this.querySelector('#tabs-container');
        this.QuestionnaireService = new QuestionnaireService(this.DSUStorage);
        this.updateQuestionnaire();

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
            this.model.questions = this.model.questions.map(question => {
                return {
                    ... question,
                    response: this.querySelector(`input[name="${question.name}"]:checked`).value
                }
            })
            this.model.votingOpen = false;
        });

        this.onTagClick('finish-questionnaire', (event) => {
            this.model.questions.forEach(question => console.log(question.id, question.response, question.title))
            this.navigateToPageTag('home');
        });
    }

    updateQuestionnaire() {
        this.QuestionnaireService.getServiceModel((err, data) => {
            if (err) {
                return console.log(err);
            }
            let questionnaire = data.questionnaires[0];
            let items = questionnaire.item.filter(item => item.type === 'choice');
            let questions = [];
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let answers = item.answerOption.map(answer => {
                    return {
                        id: answer.valueCoding.code,
                        label: answer.valueCoding.code,
                        name: item.linkId
                    };
                })
                questions.push({
                    id: i,
                    name: item.linkId,
                    title: item.text,
                    response: -1,
                    answers: answers
                })
            }
            this.model.questions = questions;
            this.querySelector('#tabs-container').innerHTML = `<webc-template template="questionnaire-template" data-view-model="@"></webc-template>`
            TAB_MAX_VALUE = questions.length;
        })
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
