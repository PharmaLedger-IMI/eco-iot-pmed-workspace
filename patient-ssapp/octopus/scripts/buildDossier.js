const DEFAULT_PSK_BUNDLES_PATH = "./../privatesky/psknode/bundles";

const DEFAULT_BUILD_CONF_PATH = './bin/build.file';
const DEFAULT_SEED_PATH = './seed';
const DEFAULT_DOMAIN = "default";

const BUNDLES_TAG = "--bundles=";
const SEED_TAG = "--seed=";
const DOMAIN_TAG = "--domain=";

const path = require('path');

const parse_arguments = function(arguments){
    let config, seed, domain, bundles;
    arguments.forEach(a => {
        if (!a)
            return;
        if (a.includes(BUNDLES_TAG))
            bundles = a.replace(BUNDLES_TAG, '');
        else if (a.includes(DOMAIN_TAG))
            domain = a.replace(DOMAIN_TAG, '');
        else if (a.includes(SEED_TAG))
            seed = a.replace(SEED_TAG, '');
        else
        if (config === undefined)
            config = a;
        else
            throw new Error("invalid arguments. Only one path to build file is accepted")
    });

    return {
        "seed": seed || DEFAULT_SEED_PATH,
        "domain": domain || DEFAULT_DOMAIN,
        "bundles": bundles || DEFAULT_PSK_BUNDLES_PATH,
        "config": config || DEFAULT_BUILD_CONF_PATH
    }
};

const buildCallback = function(err, result){
    let projectName = path.basename(process.cwd());

    if (err) {
        console.log(`Build process of <${projectName}> failed.`);
        console.log(err);
        process.exit(1);
    }

    console.log(`Build process of <${projectName}> finished. Dossier's KeySSI:`, result);
}

const getCommands = function(data){
    if (!data)
        return [];
    return data.split(/\r?\n/).filter(cmd => !!cmd.trim());
};

/**
 * Octopus Script to aid in the Dossier Building process via the 'dt' api DossierBuilder
 * Accepted Arguments:
 * * (optional) path to build file (defaults to ./bin/build.file)
 * Flags:
 *  * bundles: sets the bundles path, ex:
 * <pre>
 *     --bundles=./../.../privatesky/bundles
 * </pre>
 * defaults to './../privatesky/bundles'
 * * seed: sets the path for the seed file of the dossier being build, ex:
 * <pre>
 *     --seed=./../seed
 * </pre>
 * defaults to './seed'
 * * domain: sets the desired domain, ex:
 * <pre>
 *     --domain=epi
 * </pre>
 * defaults to 'default'
 */
const buildDossier = function(cfg, commands, callback){
    if (typeof commands === 'function'){
        callback = commands;
        commands = [];
    }

    let openDSU_bundle = path.join(process.cwd(), cfg.bundles, "openDSU.js");
    require(openDSU_bundle);

    let dossier_builder = require('opendsu').loadApi('dt').getDossierBuilder();
    dossier_builder.buildDossier(cfg, commands, callback);
}


let args = process.argv;
args.splice(0,2);

const octopus = require("./index.js");

if (args.length > 4)
    octopus.handleError("Expected to receive 1 optional param <buildFile> path the the build file. defaults to './bin/build.json'");

let config = parse_arguments(args);

const fs = require("fs");

fs.access(config.config, fs.F_OK, err => {
    if (err) {
        console.log(`Configuration file not found at ${config.config} - proceeding with dossier building...`);
        return buildDossier(config, buildCallback);
    }

    fs.readFile(config.config, (err, data) => {
        if (err)
            octopus.handleError("Configuration file exists, but could not be read", err);

        let cmds = getCommands(data.toString());
        buildDossier(config, cmds, buildCallback);
    });
});
