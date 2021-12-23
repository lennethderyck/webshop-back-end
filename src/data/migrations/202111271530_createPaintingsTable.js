const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.painting, (table) => {
      table.uuid('id')
        .primary();

      table.string('name', 255)
        .notNullable();
      table.string('type', 255)
        .notNullable();
      table.decimal('price', 6, 2)
        .notNullable();
      table.string('description', 800)
        .notNullable();
      table.string('img', 500)
        .notNullable();
      table.string('size', 255)
        .notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.painting);
  },
};