
const router = require('express').Router();
const WeaponService = require('../services/weaponsService.js');

// Fetch the maximum quantity of a weapon that can be built
router.get('/:id/max-buildable', async (req, res) => {
  try {
    const maxBuildable = await WeaponService().getMaxBuildable(req.params.id);
    if (maxBuildable === null) return res.status(404).json({ error: "Weapon not found" });
    
    res.status(200).json({ maxBuildable });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Retrieve all weapons
router.get('/all', async (req, res) => {
  try {
      const weapons = await WeaponService().getAllWeapons();
      res.status(200).json(weapons);
  } catch (err) {
      res.status(500).json({ err: err.message });
  }
});


// Fetch a specific weapon by its ID
router.get('/:id', async (req, res) => {
    try {
      const weapon = await WeaponService().getWeapon(req.params.id);
      if (!weapon) return res.status(404).json({ error: "Weapon not found" });
      res.status(200).json(weapon);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
 // Create a new weapon record
router.post('/', async (req, res) => {
  try {
    const weapon = await WeaponService().createWeapon(req.body);
    res.status(201).json(weapon);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
  
// Update details of a specific weapon by its ID
router.put('/:id', async (req, res) => {
  try {
    const weapon = await WeaponService().updateWeapon(req.params.id, req.body);
    if (!weapon) return res.status(404).json({ error: "Weapon not found" });
    res.status(200).json(weapon);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete a specific weapon by its ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await WeaponService().deleteWeapon(req.params.id);
    if (!result) return res.status(404).json({ error: "Weapon not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
  


module.exports = router;
