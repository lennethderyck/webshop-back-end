const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.order).delete();

    // then add the fresh users
    await knex(tables.order).insert([
      { // User Lenneth
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        paintings: JSON.stringify([{
          id: '1d30cc59-f93b-48bf-bd13-7a664c220538',
          name: 'At The Water',
          type: 'Textile',
          price: '500.00',
          description: 'Dit is een test',
          img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile03.jpg?alt=media&token=1e3f24c3-dff2-4c1c-ab14-e9545fd49d18',
          size: '100x50',
        }, {
          id: '5c16bec1-37f8-446b-a2e4-cead43354cde',
          name: 'Imagination',
          type: 'Canvas',
          price: '800.00',
          description: 'Dit is een testefefvfv',
          img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile06.JPG?alt=media&token=5d21fa89-0c73-4900-b4f1-ecc1af8a6ee8',
          size: '70x40',
        }]),
        total: 1300,
        date: new Date(2021, 4, 25, 19, 40),
      },
      { // User Robbert
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        paintings: JSON.stringify([{
          id: '5c16bec1-37f8-446b-a2e4-cead43354cdf',
          name: 'Flower Girl',
          type: 'Textile',
          price: '900.00',
          description: 'Dit is een testefefvfv Dit is een testefefvfv Dit is een testefefvfv',
          img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile17.PNG?alt=media&token=9ae2964e-839c-4b44-bbb7-5f46ddfc61a5',
          size: '90x50',
        }]),
        total: 900,
        date: new Date(2021, 4, 25, 19, 40),
      },
    ]);
  },
};
