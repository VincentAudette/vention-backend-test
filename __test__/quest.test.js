const request = require('supertest');
const app = require('../server.js');
const db = require('../config/dbConfig.js');
const Material = require('../models/material.js');
const Weapon = require('../models/weapon.js');

beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});

describe('Quest 1 - Material & Weapon Models', () => {
    
    it('should validate Excalibur weapon', async () => {
        const weapon = await Weapon.findByName('Excalibur');
        expect(weapon).not.toBeNull();

        // Validate composed materials for Excalibur
        expect(weapon.material_ids).toContain(1);
        expect(weapon.material_ids).toContain(6);
        expect(weapon.material_ids).toContain(9);
    });

    it('should validate Magic Staff weapon', async () => {
        const weapon = await Weapon.findByName('Magic Staff');
        expect(weapon).not.toBeNull();

        // Validate composed materials for Magic Staff
        expect(weapon.material_ids).toContain(6);
        expect(weapon.material_ids.length).toBe(1);
    });

});

describe('Quest 2: Weapon Model - Total Power Level', () => {
    it('should compute the correct power level for the Axe', async () => {
        const axe = new Weapon({ 
            name: 'Axe',
            material_ids: [9, 12]
        });
        await axe.computeTotalPower();
        expect(axe.power_level).toBe(12040);
    });
});

describe('Quest 3 & 4: Update Material and Related Weapons', () => {
    beforeEach(async () => {
        const axe = new Weapon({ 
            name: 'Axe',
            material_ids: [9, 12]
        });
        await axe.computeTotalPower();
        await axe.save();
    });

    it('should update material power and related weapon power when material is updated', async () => {
        const newPower = 100;
        const materialId = 9;

        const initialMaterial12 = await Material.find(12);

        await request(app)
            .put(`/api/material/${materialId}/power`)
            .send({ base_power: newPower })
            .expect(200);

        const initialMaterial9 = await Material.find(9);
        expect(initialMaterial9.base_power).toBe(newPower);

        const updatedAxe = await Weapon.findByName('Axe');
        
        const expectedPowerLevel = newPower + 5*(130 + 10*220) + initialMaterial12.base_power;

        expect(updatedAxe.power_level).toBe(expectedPowerLevel);
    });
});

describe('Quest 5: Fetch Maximum Buildable Weapon Quantity', () => {
    beforeEach(async () => {
        const axe = new Weapon({ 
            name: 'Axe',
            material_ids: [9, 12]
        });
        await axe.computeTotalPower();
        await axe.save();
    });

    it('should return the maximum buildable quantity for a given weapon', async () => {
        const axe = await Weapon.findByName('Axe');

        const response = await request(app)
            .get(`/api/weapon/${axe.id}/max-buildable`);

        expect(response.status).toBe(200);

        const expectedMaxBuildable = 47;
        expect(response.body.maxBuildable).toBe(expectedMaxBuildable);
    });
});






