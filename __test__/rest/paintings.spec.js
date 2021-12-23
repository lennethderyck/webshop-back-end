const {
  tables,
} = require('../../src/data');
const {
  withServer,
  loginAdmin,
} = require('../supertest.setup');
const Role = require('../../src/core/roles');

const data = {
  paintings: [{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      name: 'Thinking',
      type: 'Canvas',
      price: 999.00,
      description: 'Test om een schilderij toe te voegen.',
      img: 'img/Fabric14.jpg',
      size: '80x80',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff91',
      name: 'Fragile',
      type: 'Textile',
      price: 999.99,
      description: 'Dit is een prachtig werk van Noëlla Nechelput.',
      img: 'img/Fabric34.jpg',
      size: '80x100',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff92',
      name: 'Test',
      type: 'Testt',
      price: 800.99,
      description: 'Dit is een test.',
      img: 'img/Fabric35.jpg',
      size: '80x200',
    },
  ],

  users: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff70',
    name: 'Lenneth De Ryck',
    password_hash: '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
    roles: JSON.stringify([Role.USER]),
  }],
};

const dataToDelete = {
  paintings: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff91',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff92',
  ],
  users: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff70',
  ],
};

describe('Paintings', () => {

  let request;
  let knex;
  let loginHeader;

  withServer(({
    request: r,
    knex: k,
  }) => {
    request = r;
    knex = k;
  });

  beforeAll(async () => {
    loginHeader = await loginAdmin(request);
  });

  const url = '/api/paintings';

  describe('GET api/paintings', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);
    });

    afterAll(async () => {
      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    it('should 200 and return all paintings', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
    });

    it('should 200 and paginate the list of paintings', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff91',
        name: 'Fragile',
        type: 'Textile',
        price: '999.99',
        description: 'Dit is een prachtig werk van Noëlla Nechelput.',
        img: 'img/Fabric34.jpg',
        size: '80x100',
      });
    });
  });

  describe('GET api/paintings/:id', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings[0]);
    });

    afterAll(async () => {
      await knex(tables.painting)
        .where('id', dataToDelete.paintings[0])
        .delete();
    });

    it('should 200 and return requested painting', async () => {
      const paintingId = data.paintings[0].id;
      const response = await request.get(`${url}/${paintingId}`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        name: 'Thinking',
        type: 'Canvas',
        price: '999.00',
        description: 'Test om een schilderij toe te voegen.',
        img: 'img/Fabric14.jpg',
        size: '80x80',
      });
    });
  });

  describe('POST api/paintings', () => {
    const paintingToDelete = [];

    afterAll(async () => {
      await knex(tables.painting)
        .where('id', paintingToDelete)
        .delete();
    });

    it('should 201 and return the create painting', async () => {
      const response = await request.post(url).set('Authorization', loginHeader).send({
        name: 'Test2',
        type: 'Textile',
        price: 1500.00,
        description: 'Dit is een werk van Noëlla Nechelput.',
        img: 'img/Fabric39.jpg',
        size: '80x300',
      });
      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Test2');
      expect(response.body.type).toBe('Textile');
      expect(response.body.price).toBe('1500.00');
      expect(response.body.description).toBe('Dit is een werk van Noëlla Nechelput.');
      expect(response.body.img).toBe('img/Fabric39.jpg');
      expect(response.body.size).toBe('80x300');

      paintingToDelete.push(response.body.id);
    });
  });

  describe('PUT api/paintings/:id', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);
    });

    afterAll(async () => {
      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    it('should 200 and return the create painting', async () => {
      const paintingId = data.paintings[0].id;
      const response = await request.put(`${url}/${paintingId}`).set('Authorization', loginHeader).send({
        name: 'Test5',
        type: 'Textile',
        price: 1600.00,
        description: 'Dit is een werk van Noëlla Nechelput.',
        img: 'img/Fabric39.jpg',
        size: '90x300',
      });
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Test5');
      expect(response.body.type).toBe('Textile');
      expect(response.body.price).toBe('1600.00');
      expect(response.body.description).toBe('Dit is een werk van Noëlla Nechelput.');
      expect(response.body.img).toBe('img/Fabric39.jpg');
      expect(response.body.size).toBe('90x300');
    });
  });
  describe('DELETE /api/paintings/:id', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);
    });

    afterAll(async () => {
      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    it('it should 204 and return nothing', async () => {
      const paintingId = data.paintings[0].id;
      const response = await request.delete(`${url}/${paintingId}`).set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});