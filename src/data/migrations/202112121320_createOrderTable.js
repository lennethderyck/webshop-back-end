const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.order, (table) => {
      table.uuid('id')
        .primary();

      table.integer('total')
        .notNullable();

      table.dateTime('date')
        .notNullable();

      table.uuid('user_id')
        .notNullable();

      // Give this foreign key a name for better error handling in service layer
      table.foreign('user_id', 'fk_order_user')
        .references(`${tables.user}.id`)
        .onDelete('CASCADE');

      table.jsonb('paintings')
        .notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.order);
  },
};
