const router = require('express').Router();

const MaterialService = require('../services/materialService.js');
const materialWeaponService = require('../services/materialWeaponService');

// Fetch a specific material by its ID
router.get('/:id', async (req, res) => {
  try {
    const material = await MaterialService().getMaterial(req.params.id);
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update the power of a specific material by its ID
// Also updates weapons that use this material
router.put('/:id/power', async (req, res) => {
  try {
      const updatedMaterial = await materialWeaponService.updateMaterialAndRelatedWeapons(req.params.id, req.body);
      res.status(200).json(updatedMaterial);
  } catch (err) {
      res.status(500).json({ err: err.message });
  }
});

module.exports = router;
