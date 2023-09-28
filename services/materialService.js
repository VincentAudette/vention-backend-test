const { find } = require('../models/material');

const MaterialService = () => {
  /**
   * Fetch a material by its ID.
   * @param {number} id - The ID of the material to be fetched.
   * @returns {Promise<Material>} - The material instance.
   */
  const getMaterial = async (id) => {
    return find(id);
  };

  return {
    getMaterial,
  };
};

module.exports = MaterialService;
