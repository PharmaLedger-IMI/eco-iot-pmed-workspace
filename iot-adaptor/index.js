//load the bundle
require("./bundles/pskWebServer");

//we need to init callflow in order to have $$.flow
if (typeof $$.flows === "undefined") {
    require('callflow').initialise();
}

const opendsu = require("opendsu");
const scAPI = opendsu.loadApi("sc");
const commonServicesBundle = "./../common-services/build/bundles/commonServices.js"
require(commonServicesBundle);
const commonServices = require("common-services")
const {DidService, MessageHandlerService} = commonServices;
const MessageHandlerStrategy = require("./strategies/MessageHandlerStrategy");
const DOMAIN = "iot";
const didType = "ssi:name";
const publicName = process.env.IOT_ADAPTOR_DID;

const express = require('express');
const server = express();
const port = process.env.IOT_ADAPTOR_PORT;

async function setupIoTAdaptorEnvironment() {

    const dt = opendsu.loadApi("dt");
    await $$.promisify(dt.initialiseBuildWallet)();
    const mainDSU = await $$.promisify(scAPI.getMainDSU)();

    let initialEnv = JSON.parse(await $$.promisify(mainDSU.readFile)("environment.json"));

    console.log("init", initialEnv)
    if (!initialEnv.did) {
        initialEnv.did = `did:${didType}:${DOMAIN}:${publicName}`;
        initialEnv.didDomain = DOMAIN;
        initialEnv.vaultDomain = DOMAIN;
        await $$.promisify(mainDSU.writeFile)("environment.json", JSON.stringify(initialEnv));
        scAPI.refreshSecurityContext();
    }
    MessageHandlerService.init(MessageHandlerStrategy);
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
    const GetEvidenceBySk = require('./api/get_evidence_by_sk.js');

    const CreateDevice = require('./api/create_device.js');
    const SearchDevice = require('./api/search_device.js');
    const UpdateDevice = require('./api/update_device.js');
    const DeleteDevice = require('./api/delete_device.js');
    const GetDeviceById = require('./api/get_device_by_id.js');

    const {
        requestBodyXMLMiddleware,
        responseModifierMiddleware,
        requestBodyJSONMiddleware
    } = require('./utils/middlewares');

    server.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || req.headers.host);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', `Content-Type, Content-Length, X-Content-Length, Access-Control-Allow-Origin`);
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    server.options(`/*`, corsPolicyHandler);
    server.post(`/iotAdapter/platform/dynavision`, requestBodyXMLMiddleware);
    server.post(`/iotAdapter/platform/dynavision`, DynavisionPlatform);

    server.use(`/iotAdapter/*`, responseModifierMiddleware);
    server.use(`/iotAdapter/*`, requestBodyJSONMiddleware);

    // For testing
    server.get(`/iotAdapter/resource/observation/patient/:id`, GetObservationByPatientId);

    // For debugging purpose
    server.get(`/iotAdapter/resource/:resource_type`, SearchResources);
    server.get(`/iotAdapter/resource/:resource_type/:id`, GetResourceById);
    //server.post(`/iotAdapter/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/resource/:resource_type`, CreateResource);
    //server.put(`/iotAdapter/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/resource/:resource_type/:id`, UpdateResource);
    server.delete(`/iotAdapter/resource/:resource_type/:id`, DeleteResource);

    server.post(`/iotAdapter/dsu`, CreateDsu);
    server.get(`/iotAdapter/dsu/resource/:resource_type`, SearchDsuResources);
    //server.post(`/iotAdapter/dsu/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/dsu/resource/:resource_type`, CreateDsuResource);
    //server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, UpdateDsuResource);
    server.delete(`/iotAdapter/dsu/resource/:resource_type/:id`, DeleteDsuResource);
    server.get(`/iotAdapter/dsu/resource/:resource_type/:id`, GetDsuResourceById);
    // End for debugging purpose

    // Actual APIs
    // server.post(`/iotAdapter/platform/dynavision`, requestBodyXMLMiddleware);
    server.post(`/iotAdapter/platform/dynavision`, DynavisionPlatform);
    // server.post(`/iotAdapter/assign-device`, requestBodyJSONMiddleware); 
    server.post(`/iotAdapter/assign-device`, AssignDevice);

    //server.post(`/iotAdapter/create-evidence-dsu`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-evidence-dsu`, CreateEvidenceDsu);

    server.get(`/iotAdapter/search-evidence`, SearchEvidence);
    //server.post(`/iotAdapter/create-evidence`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-evidence`, CreateEvidence);
    //server.put(`/iotAdapter/update-evidence/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/update-evidence/:id`, UpdateEvidence);
    server.delete(`/iotAdapter/delete-evidence/:id`, DeleteEvidence);
    server.get(`/iotAdapter/get-evidence/:id`, GetEvidenceById);
    server.get(`/iotAdapter/get-evidence-sk/:id`, GetEvidenceBySk);

    server.get(`/iotAdapter/search-device`, SearchDevice);
    //server.post(`/iotAdapter/create-device`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/create-device`, CreateDevice);
    //server.put(`/iotAdapter/update-device/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/update-device/:id`, UpdateDevice);
    server.delete(`/iotAdapter/delete-device/:id`, DeleteDevice);
    server.get(`/iotAdapter/get-device/:id`, GetDeviceById);
    server.get(`/iotAdapter/adaptorIdentity`, getAdaptorIdentity);

}

function corsPolicyHandler(request, response) {
    console.log("OPTIONS CALLED");
    const headers = {};
    // IE8 does not allow domains to be specified, just the *
    headers['Access-Control-Allow-Origin'] = request.headers.origin;
    // headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = true;
    headers['Access-Control-Max-Age'] = '3600'; //one hour
    headers['Access-Control-Allow-Headers'] = `Content-Type, Content-Length, X-Content-Length, Access-Control-Allow-Origin, User-Agent, Authorization`;
    response.writeHead(200, headers);
    response.end();
}

function getAdaptorIdentity(request, response, next) {
    response.setHeader('Content-Type', 'application/json');
    const sc = scAPI.getSecurityContext();

    const responseCallback = (err, did) => {

        if (err) {
            response.send(500);
        }
        response.send(200, did);

    }


    const resolveDid = () => {
        DidService.getDidServiceInstance().getEnvironmentData().then(({did}) => {
            responseCallback(undefined, did);
        }).catch(responseCallback);
    }

    if (sc.isInitialised()) {
        resolveDid();

    } else {
        sc.on("initialised", resolveDid);
    }
}


IotAdaptor(server);

server.listen(port, () => {
    console.log(`\n===================================================`);
    console.log(`> IOT Adapter listening at http://localhost:${port}`);
    console.log(`===================================================\n`);
});