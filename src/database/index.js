const { MongoClient } = require("mongodb");
const debug = require("debug")("app:module-databases");
const { Config } = require("../config/index.js");

var connection = null;
module.exports.Database = (collection) =>
  new Promise(async (resolve, reject) => {
    debug("Entro aca");
    try {
      if (!connection) {
        const client = new MongoClient(Config.mongoUri);
        connection = await client.connect();
        debug("Nueva conexion realizada con MongoDB Atlas");
      }
      debug("Reutilizando conexion");
      const db = connection.db(Config.mongoDbName);
      resolve(db.collection(collection));
    } catch (error) {
      reject(error);
    }
  });
