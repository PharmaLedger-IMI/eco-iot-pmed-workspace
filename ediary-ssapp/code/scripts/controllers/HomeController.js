import QuestionnaireService from "../services/QuestionnaireService.js";
import Questionnaire from "../models/Questionnaire.js";
const { WebcController } = WebCardinal.controllers;

export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this._attachHandlerEconsent();
        this._attachHandlerIotQuestionarie();
        this._attachHandlerEDiary();

        this.QuestionnaireService = new QuestionnaireService();
        this.QuestionnaireService.saveQuestionnaire(Questionnaire.example, (err, data) => {
            if (err) {
                return console.log(err);
            }
        })
    }

    _attachHandlerEconsent(){
        this.on('home:econsent', (event) => {
            // this.navigateToPageTag('econsent', {date: 'a'});
        });
    }

    _attachHandlerIotQuestionarie(){
        this.on('home:questionnaire', (event) => {
            this.navigateToPageTag('questionnaire');
        });
    }

    _attachHandlerEDiary(){
        this.on('home:ediary', (event) => {
            this.navigateToPageTag('ediary');
        });
    }
}