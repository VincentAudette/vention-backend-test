const Material = require('../models/material');
const Weapon = require('../models/weapon');

/**
 * Updates the specified material and recalculates the power level 
 * of weapons that use this material if its base power has been changed.
 * 
 * @param {number} materialId - ID of the material to be updated.
 * @param {Object} data - Object containing updated properties for the material.
 * @returns {Material} - The updated material instance.
 * @throws {Error} - Throws an error if the material is not found.
 */
const updateMaterialAndRelatedWeapons = async (materialId, data) => {
    // Find and update the material
    const material = await Material.find(materialId);
    if (!material) throw new Error('Material not found');
    await material.update(data);

    // If the base power of the material is updated, update the power level of weapons that use this material
    if (data.base_power) {
        const weaponsUsingMaterial = await Weapon.findByMaterialId(materialId);
        for (const weaponData of weaponsUsingMaterial) {
            const weapon = new Weapon(weaponData);
            await weapon.computeTotalPower();
            await weapon.save();
        }
    }

    return material;
};

module.exports = {
    updateMaterialAndRelatedWeapons
};
