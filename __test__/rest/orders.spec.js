const {
  tables,
} = require('../../src/data');
const {
  withServer,
  loginAdmin,
} = require('../supertest.setup');
const Role = require('../../src/core/roles');

const data = {
  orders: [{ // User Lenneth
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
      paintings: JSON.stringify(['7f28c5f9-d711-4cd6-ac15-d13d71abff95']),
      total: 1300,
      date: new Date(2021, 4, 25, 19, 40),
    },
    { // User Robbert
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff72',
      paintings: JSON.stringify(['7f28c5f9-d711-4cd6-ac15-d13d71abff96']),
      total: 900,
      date: new Date(2021, 4, 25, 19, 40),
    },
  ],
  paintings: [{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff95',
      name: 'Thinking',
      type: 'Canvas',
      price: 999.00,
      description: 'Test om een schilderij toe te voegen.',
      img: 'img/Fabric14.jpg',
      size: '80x80',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff96',
      name: 'Fragile',
      type: 'Textile',
      price: 999.99,
      description: 'Dit is een prachtig werk van Noëlla Nechelput.',
      img: 'img/Fabric34.jpg',
      size: '80x100',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff97',
      name: 'Test',
      type: 'Testt',
      price: 800.99,
      description: 'Dit is een test.',
      img: 'img/Fabric35.jpg',
      size: '80x200',
    },
  ],
  users: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
    name: 'Lenneth De Ryck',
    email: 'lenneth.deryck@student.hogent.be',
    password_hash: '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
    roles: JSON.stringify([Role.USER]),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff72',
    name: 'Robbert Naessens',
    email: 'robbert.naessens@student.hogent.be',
    password_hash: '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
    roles: JSON.stringify([Role.USER]),
  },
],
};

const dataToDelete = {
  orders: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
  ],
  paintings: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff95',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff96',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff97',
  ],
  users: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff72',
  ],
};

describe('Orders', () => {
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
    await knex(tables.order)
      .delete();
  });

  const url = '/api/orders';

  describe('GET /api/orders', () => {
    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);
      await knex(tables.user).insert(data.users);
      await knex(tables.order).insert(data.orders);
    });

    afterAll(async () => {
      await knex(tables.order)
        .whereIn('id', dataToDelete.orders)
        .delete();

      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();

        await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return all orders', async () => {
      const response = await request.get(url)
        .set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(2);
    });


    test('it should 200 and paginate the list of orders', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`)
        .set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff72',
          name: 'Robbert Naessens',
        },
        paintings: ['7f28c5f9-d711-4cd6-ac15-d13d71abff96'],
        total: 900,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('GET /api/orders/:id', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);
      await knex(tables.user).insert(data.users);
      await knex(tables.order).insert(data.orders[0]);
    });

    afterAll(async () => {
      await knex(tables.order)
        .delete();

      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    test('it should 200 and return the requested order', async () => {
      const orderId = data.orders[0].id;
      const response = await request.get(`${url}/${orderId}`)
        .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff71',
          name: 'Lenneth De Ryck',
        },
        paintings: ['7f28c5f9-d711-4cd6-ac15-d13d71abff95'],
        total: 1300,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  /*describe('POST /api/orders', () => {

    const ordersToDelete = [];
    const usersToDelete = [];

    beforeAll(async () => {
        await knex(tables.painting)
        .delete();
      await knex(tables.painting).insert(data.paintings);
    });

    afterAll(async () => {
      await knex(tables.order)
        .whereIn('id', ordersToDelete)
        .delete();

      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    test('it should 201 and return the created order', async () => {
      const response = await request.post(url)
        .set('Authorization', loginHeader)
        .send({paintings: JSON.stringify(['7f28c5f9-d711-4cd6-ac15-d13d71abff95']),
        total: 1300,
        date: new Date(2021, 4, 25, 19, 40),});

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.total).toBe(1500);
      expect(response.body.paintings).toEqual([{
        user:{
            id:'7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
            name:"Admin User"
        },
        paintings: ['7f28c5f9-d711-4cd6-ac15-d13d71abff95'],
        total: 1300,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      }]);
      expect(response.body.user_id).toBeTruthy();

      ordersToDelete.push(response.body.id);
      usersToDelete.push(response.body.user_id);
    });
  });*/

  /*describe('PUT /api/transactions/:id', () => {
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
      await knex(tables.transaction).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        amount: 102,
        date: new Date(2021, 4, 25, 19, 40),
        place_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      }]);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .where('id', '7f28c5f9-d711-4cd6-ac15-d13d71abff81')
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
    });

    test('it should 200 and return the updated transaction', async () => {
      const response = await request.put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff81`)
        .set('Authorization', loginHeader)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        name: 'Test place',
      });
      expect(response.body.user.name).toEqual('Test User');

      usersToDelete.push(response.body.user.id);
    });
  });*/


  describe('DELETE /api/orders/:id', () => {

    beforeAll(async () => {
      await knex(tables.painting).insert(data.paintings);

      await knex(tables.order).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
        paintings: JSON.stringify(['7f28c5f9-d711-4cd6-ac15-d13d71abff95']),
        total: 1300,
        date: new Date(2021, 4, 25, 19, 40),
      }]);
    });

    afterAll(async () => {
      await knex(tables.painting)
        .whereIn('id', dataToDelete.paintings)
        .delete();
    });

    test('it should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff81`)
        .set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});