const ACTIONS = {
    EDIT:"edit",
    VIEW:"view",
    FEEDBACK:"feedback",
    RESULT:"result",
    DATA:"data"
}

const statusStateMachine = {
    approved: {
        label: "Approved",
        actions: [ACTIONS.EDIT],
        getNexSteps: () => {
            return [
                {status: 'active', action: "Run"},
                {status: 'withdrawn', action: "Withdraw"}]
        }
    },
    active: {
        label: "Active",
        actions: [ACTIONS.VIEW, ACTIONS.FEEDBACK],
        getNexSteps: () => {
            return [{status: 'onHold', action: "Hold"}, {status: 'closed', action: "Close"}]
        }
    },
    onHold: {
        label: "On Hold",
        actions: [ACTIONS.VIEW],
        getNexSteps: () => {
            return [
                {status: 'active', action: "Resume"},
                {status: 'withdrawn', action: "Withdraw"},
                {status: 'closed', action: "Close"}]
        }
    },
    closed: {
        label: "Closed",
        actions: [ACTIONS.VIEW, ACTIONS.FEEDBACK],
        getNexSteps: () => {
            return [{status: 'completed', action: "Finalise"}]
        }
    },
    completed: {
        label: "Completed",
        actions: [ACTIONS.VIEW, ACTIONS.FEEDBACK, ACTIONS.RESULT, ACTIONS.DATA],
        getNexSteps: () => {
            return []
        }
    },
    withdrawn: {
        label: "Withdrawn",
        actions: [ACTIONS.VIEW],
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
        return "approved";
    }
    static getActions(){
        return ACTIONS;
    }

}

export default StudyStatusesService;



