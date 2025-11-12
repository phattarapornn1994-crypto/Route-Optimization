import express, { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../utils/db-helpers.js';

const router = express.Router();

// Get all plans
router.get('/', async (req: Request, res: Response) => {
  try {
    const plans = await dbAll(`
      SELECT * FROM transportation_plans
      ORDER BY created_at DESC
    `);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get plan by ID with items
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const plan = await dbGet('SELECT * FROM transportation_plans WHERE id = ?', req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const items = await dbAll(`
      SELECT pi.*, c.code, c.name, c.address, c.latitude, c.longitude
      FROM plan_items pi
      JOIN customers c ON pi.customer_id = c.id
      WHERE pi.plan_id = ?
      ORDER BY pi.id
    `, req.params.id);

    res.json({ ...plan, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Create plan
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      plan_date,
      origin_address,
      origin_latitude,
      origin_longitude,
      items
    } = req.body;

    const result = await dbRun(`
      INSERT INTO transportation_plans (
        name, plan_date, origin_address, origin_latitude, origin_longitude
      ) VALUES (?, ?, ?, ?, ?)
    `, [name, plan_date, origin_address, origin_latitude, origin_longitude]);

    const planId = result.lastInsertRowid;

    // Insert plan items
    if (items && items.length > 0) {
      for (const item of items) {
        await dbRun(`
          INSERT INTO plan_items (plan_id, customer_id, quantity, weight, volume, delivery_type)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          planId,
          item.customer_id,
          item.quantity,
          item.weight,
          item.volume,
          item.delivery_type || 'delivery'
        ]);
      }
    }

    const plan = await dbGet('SELECT * FROM transportation_plans WHERE id = ?', planId);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Update plan
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      name,
      plan_date,
      origin_address,
      origin_latitude,
      origin_longitude,
      status,
      items
    } = req.body;

    const result = await dbRun(`
      UPDATE transportation_plans SET
        name = ?, plan_date = ?, origin_address = ?,
        origin_latitude = ?, origin_longitude = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name, plan_date, origin_address,
      origin_latitude, origin_longitude,
      status,
      req.params.id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Update items if provided
    if (items) {
      // Delete existing items
      await dbRun('DELETE FROM plan_items WHERE plan_id = ?', req.params.id);

      // Insert new items
      if (items.length > 0) {
        for (const item of items) {
          await dbRun(`
            INSERT INTO plan_items (plan_id, customer_id, quantity, weight, volume, delivery_type)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            req.params.id,
            item.customer_id,
            item.quantity,
            item.weight,
            item.volume,
            item.delivery_type || 'delivery'
          ]);
        }
      }
    }

    const plan = await dbGet('SELECT * FROM transportation_plans WHERE id = ?', req.params.id);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete plan
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await dbRun('DELETE FROM transportation_plans WHERE id = ?', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

export default router;

