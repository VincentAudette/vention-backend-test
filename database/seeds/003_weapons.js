/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {

  // Helper function to compute power for a weapon
  async function computePowerForWeapon(materialIds) {
    let totalPower = 0;
    
    for (let materialId of materialIds) {
      const material = await knex('materials').where('id', materialId).first();
      if (material) {
        totalPower += material.base_power;
      }
    }
    
    return totalPower;
  }


  // Delete existing entries
  await knex('weapons').del();

  // Compute power for Excalibur
  const excaliburPower = await computePowerForWeapon([1, 6, 9]);

  // Compute power for Magic Staff
  const magicStaffPower = await computePowerForWeapon([6]);

  // Insert weapons with computed power
  await knex('weapons').insert([
    {
      name: 'Excalibur',
      material_ids: knex.raw('ARRAY[1, 6, 9]::integer[]'),
      power_level: excaliburPower,
      qty: 1
    },
    {
      name: 'Magic Staff',
      material_ids: knex.raw('ARRAY[6]::integer[]'),
      power_level: magicStaffPower,
      qty: 1
    }
  ]);
};

