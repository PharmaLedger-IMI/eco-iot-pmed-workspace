//Load openDSU SDK
const opendsu = require("opendsu");
//Load resolver library
const resolver = opendsu.loadApi("resolver");
//Load keyssi library
const keyssispace = opendsu.loadApi("keyssi");

const db = opendsu.loadApi("db");

const createSeedSSI = () => {
  return keyssispace.createSeedSSI('default');
}

const createSharedDB = (keySSI, dbName) => {
  const sReadSSI = keyssispace.parse(keySSI);
  const dbObject = db.getSharedDB(sReadSSI, dbName);
  return dbObject;
}

const createWalletDB = (dbName) => {
  // const seedSSI = createSeedSSI();
  const seedSSI = keyssispace.parse('BBudGH6ySHG6GUHN8ogNrTWbZEWkEbNKVx3B4SemQtqsuo5uH8MXwouNfNRMtUjjksECEL4ZMHAui9kHiaM426GJ3');
  const sReadSSI = seedSSI.derive();
  const dbObject = db.getWalletDB(seedSSI, dbName);
  console.log('seedSSI: ', seedSSI.getIdentifier());
  console.log('sReadSSI: ', sReadSSI.getIdentifier());
  // dbObject.insertRecord("test", "123456", "{}", function (err, res) {
  //   console.log('ola: ', err);
  //   console.log('lla: ', res);
  // });
  // callback(undefined, dbObject);
  return dbObject;
};

const getSharedDB = (callback) => {
  const db = createSharedDB('27XvCBPKSWpUwscQUxwsVDTxRcX1tD7FdVriPyPpAMo2Dh65efWLEEBSiDVSSt6TmNdiH2G5nvBkXm4gsJcZC2snhsbNsq4M2gPptVPsr91HQmwnw5X56WNRExbxbMQqzj17JoYGfVSbQaDkWXu6wEX', 'testDb');
  db.insertRecord("test", "key1", {value:"v0"}, function(err,res){
    console.log(err);
    console.log(res);
  });
  callback(undefined, {});
}

//Resource

const searchResource = (type, params, callback) => {
};

const createResource = (type, jsonData, callback) => {
};

const updateResource = (type, id, jsonData, callback) => {
};

const getResourceById = (type, id, callback) => {
};

const deleteResource = (type, id, callback) => {
};

const findOrCreateResource = (type, jsonData, params, callback) => {
};



module.exports = {
    resource: {
      search: searchResource,
      getById: getResourceById,
      create: createResource,
      update: updateResource,
      findOrCreate: findOrCreateResource,
      delete: deleteResource
    },
    getSharedDB: getSharedDB
}
