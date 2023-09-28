const Weapon = require('../models/weapon');
const Material = require('../models/material');

const WeaponService = () => {
  /**
   * Fetch a weapon by its ID.
   * @param {number} id - The ID of the weapon to be fetched.
   * @returns {Promise<Weapon>} - The weapon instance.
   */
  const getWeapon = async (id) => {
    return Weapon.find(id);
  };

  /**
   * Fetch all weapons.
   * @returns {Promise<Array<Weapon>>} - Array of weapon instances.
   */
  const getAllWeapons = async () => {
    return await Weapon.findAll();
  };

  /**
   * Create a new weapon.
   * @param {Object} data - Data for the new weapon.
   * @returns {Promise<Weapon>} - The created weapon instance.
   */
  const createWeapon = async (data) => {
    const weapon = new Weapon(data);
    await weapon.computeTotalPower();
    return await weapon.save();
  };

  /**
   * Update an existing weapon.
   * @param {number} id - The ID of the weapon to be updated.
   * @param {Object} data - Updated properties for the weapon.
   * @returns {Promise<Weapon>} - The updated weapon instance.
   */
  const updateWeapon = async (id, data) => {
    const weapon = await Weapon.find(id);
    if (!weapon) return null;

    for (let key in data) {
      if (weapon.hasOwnProperty(key)) {
        weapon[key] = data[key];
      }
    }
    await weapon.computeTotalPower();
    return await weapon.save();
  };

  /**
   * Delete a weapon by its ID.
   * @param {number} id - The ID of the weapon to be deleted.
   * @returns {Promise<Weapon>} - The deleted weapon instance.
   */
  const deleteWeapon = async (id) => {
    const weapon = await Weapon.find(id);
    if (!weapon) return null;
    return await weapon.delete();
  };

  /**
   * Determine the maximum number of instances of a weapon that can be built based on available materials.
   * @param {number} weaponId - The ID of the weapon.
   * @returns {Promise<number>} - The maximum number of buildable instances.
   */
  const getMaxBuildable = async (weaponId) => {
    const weapon = await getWeapon(weaponId);
    if (!weapon) return null;

    let maxBuildable = Infinity;

    for (let material_id of weapon.material_ids) {
      const material = await Material.find(material_id);
      if (!material) continue;

      const availableQty = await material.computeAvailableQuantity();
      maxBuildable = Math.min(maxBuildable, availableQty);
    }

    return maxBuildable;
  };

  return {
    getWeapon,
    createWeapon,
    updateWeapon,
    deleteWeapon,
    getMaxBuildable,
    getAllWeapons
  };
};

module.exports = WeaponService;
