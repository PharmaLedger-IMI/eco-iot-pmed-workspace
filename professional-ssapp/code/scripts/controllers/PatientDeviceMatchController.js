const {WebcController} = WebCardinal.controllers;

export default class PatientDeviceMatchController extends WebcController {
    constructor(element, history) {

        super(element, history);

        const prevState = this.getState() || {};
        this.model = this.getFormViewModel(prevState);

        this.attachHandlerGoBackButton();
        this.attachHandlerSaveButton();

    }

    attachHandlerGoBackButton() {
        this.onTagClick('go-back', () => {
            console.log("Go back button pressed");
            this.navigateToPageTag('trial-management');
        });
    }

    attachHandlerSaveButton() {
        this.onTagClick('save', () => {
            const patientDeviceData = this.preparePatientDeviceData();
            this.navigateToPageTag("patient-device-match-summary", patientDeviceData);
        });
    }

    preparePatientDeviceData() {
        return {
            trial: "Trail Demo",
            status: "Active",
            deviceId: this.model.device.value,
            patientId: this.model.patient.value
            
        };
    }

    getFormViewModel(prevState) {
        return {
            
            device: {
                label: "Device ID",
                required: true,
                options: [
                    {
                        label: "QC12345",
                        value: 'QC12345'
                    },
                    {
                        label: "QC12346",
                        value: 'QC12346'
                    },
                    {
                        label: "QC12347",
                        value: 'QC12347'
                    },
                    {
                        label: "QC12348",
                        value: 'QC12348'
                    }
                ],
                value: prevState.deviceId || ""
            },
            patient: {
                label: "Patient ID",
                required: true,
                options: [
                    {
                        label: "6VHBJrEp4s",
                        value: '6VHBJrEp4s'
                    },
                    {
                        label: "6VHBJrEp4t",
                        value: '6VHBJrEp4t'
                    },
                    {
                        label: "6VHBJrEp4u",
                        value: '6VHBJrEp4u'
                    },
                    {
                        label: "6VHBJrEp4v",
                        value: '6VHBJrEp4v'
                    }
                ],
                value: prevState.patientId || ""
            }
        }
    }
}