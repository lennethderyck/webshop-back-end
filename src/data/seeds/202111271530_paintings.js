const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.painting).delete();

    // then add the fresh users
    await knex(tables.painting).insert([
      {
        id: '1d30cc59-f93b-48bf-bd13-7a664c220538',
        name: 'At The Water',
        type: 'Textile',
        price: '500.00',
        description: 'Dit is een test',
        img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile03.jpg?alt=media&token=1e3f24c3-dff2-4c1c-ab14-e9545fd49d18',
        size: '50W x 80H',
      },
      {
        id: '5c16bec1-37f8-446b-a2e4-cead43354cde',
        name: 'Imagination',
        type: 'Canvas',
        price: '800.00',
        description: 'Dit is een testefefvfv',
        img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile06.JPG?alt=media&token=5d21fa89-0c73-4900-b4f1-ecc1af8a6ee8',
        size: '40W x 70H',
      },
      {
        id: '5c16bec1-37f8-446b-a2e4-cead43354cdf',
        name: 'Flower Girl',
        type: 'Textile',
        price: '900.00',
        description: 'Dit is een testefefvfv Dit is een testefefvfv Dit is een testefefvfv',
        img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile17.PNG?alt=media&token=9ae2964e-839c-4b44-bbb7-5f46ddfc61a5',
        size: '50W x 90H',
      },
      {
        id: '4e188e52-4579-4738-8a7a-1aaca700fef1',
        name: 'Red',
        type: 'Textile',
        price: '1200.99',
        description: 'Dit is een testefefvfv Dit is een testefefvfv Dit is een testefefvfv',
        img: 'https://firebasestorage.googleapis.com/v0/b/webshop-noella.appspot.com/o/files%2FTextile25.jpg?alt=media&token=28ae6327-f80f-440c-981d-3cf3518dbc4c',
        size: '60W x 80H',
      },
    ]);
  },
};