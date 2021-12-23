const {shutdownData, getKnex, tables} = require('../src/data');

module.exports = async () =>{
  await getKnex()(tables.painting).delete();
  await getKnex()(tables.order).delete();
  await getKnex()(tables.user).delete();

  await shutdownData();
};