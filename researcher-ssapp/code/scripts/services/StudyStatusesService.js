const commonServices = require("common-services");
const {STUDY_STATUSES, STUDY_ACTIONS} = commonServices.Constants;


const statusStateMachine = {
    approved: {
        label: STUDY_STATUSES.LABEL_APPROVED,
        actions: [STUDY_ACTIONS.EDIT],
        getNexSteps: () => {
            return [
                {status: STUDY_STATUSES.STATUS_ACTIVE, action: STUDY_STATUSES.ACTION_RUN},
                {status: STUDY_STATUSES.STATUS_WITHDRAWN, action: STUDY_STATUSES.ACTION_WITHDRAW}]
        }
    },
    active: {
        label: STUDY_STATUSES.LABEL_ACTIVE,
        actions: [STUDY_ACTIONS.VIEW, STUDY_ACTIONS.FEEDBACK],
        getNexSteps: () => {
            return [{status: STUDY_STATUSES.STATUS_ON_HOLD, action: STUDY_STATUSES.ACTION_HOLD}, {status: STUDY_STATUSES.STATUS_CLOSED, action: STUDY_STATUSES.ACTION_CLOSE}]
        }
    },
    onHold: {
        label: STUDY_STATUSES.LABEL_ON_HOLD,
        actions: [STUDY_ACTIONS.VIEW],
        getNexSteps: () => {
            return [
                {status: STUDY_STATUSES.STATUS_ACTIVE, action: STUDY_STATUSES.ACTION_RESUME},
                {status: STUDY_STATUSES.STATUS_WITHDRAWN, action: STUDY_STATUSES.ACTION_WITHDRAW},
                {status: STUDY_STATUSES.STATUS_CLOSED, action: STUDY_STATUSES.ACTION_CLOSE}]
        }
    },
    closed: {
        label: STUDY_STATUSES.LABEL_CLOSED,
        actions: [STUDY_ACTIONS.VIEW, STUDY_ACTIONS.FEEDBACK],
        getNexSteps: () => {
            return [{status: STUDY_STATUSES.STATUS_COMPLETED, action: STUDY_STATUSES.ACTION_FINALISE}]
        }
    },
    completed: {
        label: STUDY_STATUSES.LABEL_COMPLETED,
        actions: [STUDY_ACTIONS.VIEW, STUDY_ACTIONS.FEEDBACK, STUDY_ACTIONS.RESULT, STUDY_ACTIONS.DATA],
        getNexSteps: () => {
            return []
        }
    },
    withdrawn: {
        label: STUDY_STATUSES.LABEL_WITHDRAWN,
        actions: [STUDY_ACTIONS.VIEW],
        getNexSteps: () => {
            return []
        }
    }
}


class StudyStatusesService {

    constructor(currentStatus) {
        if (!statusStateMachine[currentStatus]) {
            throw new Error(`Status ${currentStatus} is unknown!`)
        }
        this.currentStatus = statusStateMachine[currentStatus];
    }

    getNextPossibleSteps() {
        const nextSteps = this.currentStatus.getNexSteps();
        return nextSteps.map((step) => {
            return {
                step: step.status,
                label: statusStateMachine[step.status].label,
                action: step.action
            };
        })
    }

    getCurrentStatus() {
        return this.currentStatus;
    }

    static getInitialStatus() {
        return STUDY_STATUSES.STATUS_APPROVED;
    }
    static getActions(){
        return STUDY_ACTIONS;
    }

}

export default StudyStatusesService;



