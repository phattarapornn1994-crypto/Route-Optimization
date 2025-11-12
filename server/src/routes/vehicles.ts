import express, { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../utils/db-helpers.js';

const router = express.Router();

// Get all vehicles
router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await dbAll('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await dbGet('SELECT * FROM vehicles WHERE id = ?', req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create vehicle
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      license_plate,
      vehicle_type,
      capacity_weight,
      capacity_volume,
      ownership_type,
      cost_per_km,
      status
    } = req.body;

    const result = await dbRun(`
      INSERT INTO vehicles (
        license_plate, vehicle_type, capacity_weight, capacity_volume,
        ownership_type, cost_per_km, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      license_plate, vehicle_type, capacity_weight, capacity_volume,
      ownership_type, cost_per_km, status || 'available'
    ]);

    const vehicle = await dbGet('SELECT * FROM vehicles WHERE id = ?', result.lastInsertRowid);
    res.status(201).json(vehicle);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message?.includes('unique')) {
      res.status(400).json({ error: 'License plate already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  }
});

// Update vehicle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      license_plate,
      vehicle_type,
      capacity_weight,
      capacity_volume,
      ownership_type,
      cost_per_km,
      status
    } = req.body;

    const result = await dbRun(`
      UPDATE vehicles SET
        license_plate = ?, vehicle_type = ?, capacity_weight = ?, capacity_volume = ?,
        ownership_type = ?, cost_per_km = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      license_plate, vehicle_type, capacity_weight, capacity_volume,
      ownership_type, cost_per_km, status,
      req.params.id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicle = await dbGet('SELECT * FROM vehicles WHERE id = ?', req.params.id);
    res.json(vehicle);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message?.includes('unique')) {
      res.status(400).json({ error: 'License plate already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  }
});

// Delete vehicle
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await dbRun('DELETE FROM vehicles WHERE id = ?', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Get available vehicles
router.get('/available/list', async (req: Request, res: Response) => {
  try {
    const vehicles = await dbAll(`
      SELECT * FROM vehicles
      WHERE status = 'available'
      ORDER BY vehicle_type, capacity_weight DESC
    `);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available vehicles' });
  }
});

export default router;

