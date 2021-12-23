const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.uuid('id')
        .primary();

      table.string('name')
        .notNullable();

      table.string('email')
        .notNullable();

      table.string('password_hash')
        .notNullable();

      table.jsonb('roles')
        .notNullable();

      table.unique('email', 'idx_user_email_unique');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.user);
  },
};