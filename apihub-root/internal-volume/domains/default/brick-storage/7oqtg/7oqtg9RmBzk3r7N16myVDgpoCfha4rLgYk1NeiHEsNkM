const receiveDossierViewModel = {
    title: "Receive Dossier",
    disclaimer: "In order to receive a dossier, you need to enter the dossier's SEED or to scan the QR Code generated on the device that shares you the dossier.",
    receiveDossierLoadingLabel: "The dossier is being imported...",
    qrCode: {
        title: "Scan QR Code",
        allowFileBrowsing: true
    },
    dossierNameInput: {
        label: "Name the dossier",
        value: "",
    },
    dossierSeedInput: {
        label: "Enter the dossier SEED you want to import",
        value: ""
    },
    buttons: {
        scanQrCodeButton: {
            disabled: true,
            label: "Scan Dossier QR Code",
            eventData: "qr-code",
            eventName: "receive-dossier-name",
            buttonClass: "btn-confirm-secondary",
        },
        enterSeedButton: {
            disabled: true,
            label: "Enter Dossier SEED",
            eventData: 'seed',
            eventName: "receive-dossier-name",
            buttonClass: "btn-confirm-primary",
        },
        finishButton: {
            disabled: true,
            label: "Finish",
            eventName: "receive-dossier-seed",
            buttonClass: "btn-confirm-primary",
        }
    },
    conditionalExpressions: {
        isDossierNameStep: true,
        isLoading: false,
    }
};

export default receiveDossierViewModel;