const opendsu = require("opendsu");
const w3cDID = opendsu.loadAPI('w3cdid');
const scAPI = opendsu.loadApi("sc");
const commonServicesBundle = "./../common-services/build/bundles/commonServices.js"
require(commonServicesBundle);
const DidService = require("common-services").DidService
const DOMAIN = "iot";

async function setupIoTAdaptorEnvironment() {
    const mainDSU = await $$.promisify(scAPI.getMainDSU)();
    const envConfig = {
        system: "any",
        browser: "any",
        vault: "server",
        didDomain: DOMAIN,
        vaultDomain: DOMAIN,
        enclaveType: "WalletDBEnclave"
    };
    await $$.promisify(mainDSU.writeFile)("environment.json", JSON.stringify(envConfig));
    scAPI.refreshSecurityContext();
}

async function IotAdaptor(server) {
    console.log("IotAdapter called");

    await setupIoTAdaptorEnvironment();

    require('./strategies/IotAdapter');

    const DynavisionPlatform = require('./platform/dynavision');

    const CreateDsu = require('./dsu/create');
    const CreateDsuResource = require('./dsu/resource/create');
    const SearchDsuResources = require('./dsu/resource/search');
    const UpdateDsuResource = require('./dsu/resource/update');
    const DeleteDsuResource = require('./dsu/resource/delete');
    const GetDsuResourceById = require('./dsu/resource/getById');

    const CreateResource = require('./resource/create');
    const SearchResources = require('./resource/search');
    const UpdateResource = require('./resource/update');
    const DeleteResource = require('./resource/delete');
    const GetResourceById = require('./resource/getById');
    const GetObservationByPatientId = require('./api/get_observation_by_patient_id.js');

    // const DeleteObservationById = require('./observation/deleteById');

    const AssignDevice = require('./api/assign_device');

    const CreateEvidenceDsu = require('./api/create_evidence_dsu.js');
    const CreateEvidence = require('./api/create_evidence.js');
    const SearchEvidence = require('./api/search_evidence.js');
    const UpdateEvidence = require('./api/update_evidence.js');
    const DeleteEvidence = require('./api/delete_evidence.js');
    const GetEvidenceById = require('./api/get_evidence_by_id.js');

    const CreateDevice = require('./api/create_device.js');
    const SearchDevice = require('./api/search_device.js');
    const UpdateDevice = require('./api/update_device.js');
    const DeleteDevice = require('./api/delete_device.js');
    const GetDeviceById = require('./api/get_device_by_id.js');

    const {requestBodyXMLMiddleware, responseModifierMiddleware, requestBodyJSONMiddleware} = require('./utils/middlewares');

    server.use(`/iotAdapter/*`, responseModifierMiddleware);
    server.use(`/iotAdapter/*`, requestBodyJSONMiddleware);

    // For testing
    server.get(`/iotAdapter/resource/observation/patient/:id`, GetObservationByPatientId);

    // For debugging purpose
    server.get(`/iotAdapter/resource/:resource_type`, SearchResources);
    server.get(`/iotAdapter/resource/:resource_type/:id`, GetResourceById);
    server.post(`/iotAdapter/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/resource/:resource_type`, CreateResource);
    server.put(`/iotAdapter/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/resource/:resource_type/:id`, UpdateResource);
    server.delete(`/iotAdapter/resource/:resource_type/:id`, DeleteResource);

    server.post(`/iotAdapter/dsu`, CreateDsu);
    server.get(`/iotAdapter/dsu/resource/:resource_type`, SearchDsuResources);
    server.post(`/iotAdapter/dsu/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/dsu/resource/:resource_type`, CreateDsuResource);
    server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, UpdateDsuResource);
    server.delete(`/iotAdapter/dsu/resource/:resource_type/:id`, DeleteDsuResource);
    server.get(`/iotAdapter/dsu/resource/:resource_type/:id`, GetDsuResourceById);
    // End for debugging purpose

    // Actual APIs
    server.post(`/iotAdapter/platform/dynavision`, requestBodyXMLMiddleware);
    server.post(`/iotAdapter/platform/dynavision`, DynavisionPlatform);
    server.post(`/iotAdapter/assign-device`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/assign-device`, AssignDevice);

    server.post(`/iotAdapter/create-evidence-dsu`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-evidence-dsu`, CreateEvidenceDsu);

    server.get(`/iotAdapter/search-evidence`, SearchEvidence);
    server.post(`/iotAdapter/create-evidence`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-evidence`, CreateEvidence);
    server.put(`/iotAdapter/update-evidence/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/update-evidence/:id`, UpdateEvidence);
    server.delete(`/iotAdapter/delete-evidence/:id`, DeleteEvidence);
    server.get(`/iotAdapter/get-evidence/:id`, GetEvidenceById);

    server.get(`/iotAdapter/search-device`, SearchDevice);
    server.post(`/iotAdapter/create-device`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-device`, CreateDevice);
    server.put(`/iotAdapter/update-device/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/update-device/:id`, UpdateDevice);
    server.delete(`/iotAdapter/delete-device/:id`, DeleteDevice);
    server.get(`/iotAdapter/get-device/:id`, GetDeviceById);

    await handleIotAdaptorMessages();
}

async function handleIotAdaptorMessages() {
    const didType = "ssi:name";
    const publicName = "iotAdaptor";

    const sc = scAPI.getSecurityContext();
    sc.on("initialised", async () => {
        try {
            const didDocument = await createOrResolveDidDocument(didType, publicName);
            listenForMessages(didDocument, async (err, decryptedMessage) => {
                const message = JSON.parse(decryptedMessage);
                const researcherDid = DidService.getDidData(message.senderIdentity);
                console.log("*******************************");
                console.log(`Received message from ${message.senderIdentity}`);
                console.log("*******************************");
                await sendMessage(didDocument, decryptedMessage, researcherDid);
            });

        } catch (e) {
            console.log("[ERROR - handleIotAdaptorMessages]", e);
        }
    });
}

async function createOrResolveDidDocument(didType, publicName) {
    let didDocument;
    try {
        didDocument = await resolveDidDocument(didType, DOMAIN, publicName);
        return didDocument;
    } catch (e) {
        try {
            didDocument = await $$.promisify(w3cDID.createIdentity)(didType, DOMAIN, publicName);
            console.log(`[DID][CREATE] Identity ${didDocument.getIdentifier()} created successfully.`);
            return didDocument;
        } catch (e2) {
            console.log("[ERROR - CREATE]", e);
            throw e2;
        }
    }
}

async function resolveDidDocument(didType, domain, publicName) {
    try {
        const identifier = `did:${didType}:${domain}:${publicName}`;
        const didDocument = await $$.promisify(w3cDID.resolveDID)(identifier);
        console.log(`[DID][RESOLVE] Identity ${didDocument.getIdentifier()} loaded successfully.`);
        return didDocument;
    } catch (e) {
        console.log("[ERROR - RESOLVE]", e);
        throw e;
    }
}


async function sendMessage(didDocument, data, receiver) {
    const {didType, domain, publicName} = receiver;
    try {
        const receiverDidDocument = await resolveDidDocument(didType, domain, publicName);
        didDocument.sendMessage(data, receiverDidDocument, (err) => {
            if (err) {
                throw err;
            }
        });
    } catch (e) {
        console.log("[ERROR - sendMessage]", e);
    }
}

function listenForMessages(didDocument, callback) {
    didDocument.readMessage((err, decryptedMessage) => {
        if (err) {
            console.error(err)
        }

        console.log("[Received Message]", decryptedMessage);
        callback(undefined, decryptedMessage);
        listenForMessages(didDocument, callback);
    });
}


module.exports = IotAdaptor;
