import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getDb } from './db';

const router = express.Router();

// Email regex helper
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/leads - Search, filter, paginate
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (search) {
      whereClauses.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count query for pagination
    const countRow = await db.get(`SELECT COUNT(*) as total FROM leads ${whereSql}`, params);
    const total = countRow ? countRow.total : 0;

    // Data query
    const leads = await db.all(
      `SELECT * FROM leads ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leads/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const lead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, status = 'new' } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO leads (name, email, phone, status) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), phone.trim(), status]
    );

    const newLead = await db.get('SELECT * FROM leads WHERE id = ?', [result.lastID]);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/leads/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const existingLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const { name, email, phone, status } = req.body;

    if (email !== undefined && !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'lost'];
    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedName = name !== undefined ? name.trim() : existingLead.name;
    const updatedEmail = email !== undefined ? email.trim() : existingLead.email;
    const updatedPhone = phone !== undefined ? phone.trim() : existingLead.phone;
    const updatedStatus = status !== undefined ? status : existingLead.status;

    await db.run(
      'UPDATE leads SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
      [updatedName, updatedEmail, updatedPhone, updatedStatus, req.params.id]
    );

    const updatedLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const existingLead = await db.get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await db.run('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leads/:id/notes
router.get('/:id/notes', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const lead = await db.get('SELECT id FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const notes = await db.all('SELECT * FROM notes WHERE leadId = ? ORDER BY id DESC', [req.params.id]);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/leads/:id/notes
router.post('/:id/notes', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const lead = await db.get('SELECT id FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const result = await db.run('INSERT INTO notes (leadId, content) VALUES (?, ?)', [
      req.params.id,
      content.trim(),
    ]);

    const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
