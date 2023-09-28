const db = require('../config/dbConfig.js');
const table = 'materials';

class Material {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name;
    this.base_power = payload.base_power;
    this.qty = payload.qty;
    this.deleted_at = payload.deleted_at;
  }

  /**
   * Fetch a material by its ID from the database.
   * @param {number} id - The material's ID.
   * @returns {Material|null} - The found material or null.
   */
  static async find(id) {
    const material = await db(table).where('id', id).first();
    if (!material) return null;
    return new Material(material);
  }

  /**
   * Update the properties of this material in the database and the instance.
   * @param {Object} data - Updated properties for the material.
   * @returns {Material} - The updated material instance.
   */
  async update(data) {
    await db(table).where('id', this.id).update(data);

    for (let key in data) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }

    return this;
  }

  /**
   * Compute and return the total power of this material based on its compositions.
   * @returns {number} - The computed total power of the material.
   */
  async computePower() {
    let totalPower = this.base_power;
    const compositions = await db('compositions').where('parent_id', this.id);

    for (const composition of compositions) {
        const childMaterial = await Material.find(composition.material_id);
        if (!childMaterial) continue;
        const childPower = await childMaterial.computePower();
        totalPower += childPower * composition.qty;
    }

    return totalPower;
  }

  /**
   * Compute and return the available quantity of this material considering its compositions.
   * @returns {number} - The computed available quantity of the material.
   */
  async computeAvailableQuantity() {
    let totalQuantity = this.qty;
    const compositions = await db('compositions').where('parent_id', this.id);

    for (const composition of compositions) {
      const childMaterial = await Material.find(composition.material_id);
      if (!childMaterial) continue;
      const childAvailableQty = await childMaterial.computeAvailableQuantity();
      totalQuantity += Math.floor(childAvailableQty / composition.qty);
    }

    return totalQuantity;
  }
}

module.exports = Material;
