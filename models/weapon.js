const db = require('../config/dbConfig.js');
const table = 'weapons';

class Weapon {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name;
    this.material_ids = payload.material_ids || [];
    this.power_level = payload.power_level || 0;
    this.qty = payload.qty || 1;
  }

  /**
   * Compute and set the total power of this weapon.
   */
  async computeTotalPower() {
    const Material = require('./material');
    let totalPower = 0;

    for (let material_id of this.material_ids) {
      const material = await Material.find(material_id);
      if (!material) continue;

      const materialPower = await material.computePower();
      totalPower += materialPower;
    }

    this.power_level = totalPower;
  }

  /**
   * Save this weapon to the database (either insert or update).
   * @returns {Weapon} - This weapon instance.
   */
  async save() {
    const weaponData = {
      name: this.name,
      material_ids: this.material_ids,
      power_level: this.power_level,
      qty: this.qty
    };

    if (this.id) {
      // Update existing weapon
      await db(table).where('id', this.id).update(weaponData);
    } else {
      // Insert new weapon
      const [newId] = await db(table).insert(weaponData, 'id');
      this.id = newId;
    }
    return this;
  }

  /**
   * Find a weapon by its ID.
   * @param {number} id - The weapon's ID.
   * @returns {Weapon|null} - The found weapon or null.
   */
  static async find(id) {
    const weapon = await db(table).where('id', id).first();
    if (!weapon) return null;
    return new Weapon(weapon);
  }

  /**
   * Find a weapon by its name.
   * @param {string} name - The weapon's name.
   * @returns {Weapon|null} - The found weapon or null.
   */
  static async findByName(name) {
    const weapon = await db(table).where('name', name).first();
    if (!weapon) return null;
    return new Weapon(weapon);
  }

  /**
   * Fetch all weapons from the database.
   * @returns {Array<Weapon>} - List of weapons.
   */
  static async findAll() {
    const weapons = await db(table);
    return weapons.map(weapon => new Weapon(weapon));
  }

  /**
   * Fetch weapons that contain a particular material ID in their composition.
   * @param {number} materialId - The ID of the material.
   * @returns {Array<Object>} - List of weapons.
   */
  static async findByMaterialId(materialId) {
    return await db(table).whereRaw('material_ids @> ARRAY[?]::int[]', [materialId]);
  }
}

module.exports = Weapon;
