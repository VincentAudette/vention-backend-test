/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('materials', function (t) {
    t.increments('id').unsigned().primary();
    t.text('name');
    t.integer('base_power');
    t.integer('qty');
    t.timestamp('deleted_at');
  });
  await knex.schema.createTable('compositions', function (t) {
    t.integer('parent_id').index();
    t.integer('material_id').index();
    t.integer('qty');
    t.foreign('parent_id').references('materials.id').onDelete('CASCADE');
    t.foreign('material_id').references('materials.id').onDelete('CASCADE');
  });
  await knex.schema.createTable('weapons', function (t) {
    t.increments('id').unsigned().primary();
    t.text('name').notNullable();
    t.specificType('material_ids', 'INT[]');
    t.integer('power_level').defaultTo(0);
    t.integer('qty').defaultTo(1);
});

};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTable('compositions');
  await knex.schema.dropTable('materials');
  await knex.schema.dropTable('weapons');
};
