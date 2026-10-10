import request from 'supertest';
import { app } from '../src/app';
import { getDb } from '../src/db';

describe('Leads API Routes', () => {
  beforeAll(async () => {
    // Ensure database is initialized
    const db = await getDb();
    await db.exec('DELETE FROM notes;');
    await db.exec('DELETE FROM leads;');
  });

  let createdLeadId: number;

  it('POST /api/leads - should create a new lead', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        status: 'new'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('test@example.com');
    createdLeadId = response.body.id;
  });

  it('GET /api/leads - should fetch leads list', async () => {
    const response = await request(app).get('/api/leads');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/leads/:id - should fetch lead details', async () => {
    const response = await request(app).get(`/api/leads/${createdLeadId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdLeadId);
  });

  it('POST /api/leads/:id/notes - should add note to lead', async () => {
    const response = await request(app)
      .post(`/api/leads/${createdLeadId}/notes`)
      .send({ content: 'Followed up via phone call' });

    expect(response.status).toBe(201);
    expect(response.body.content).toBe('Followed up via phone call');
    expect(response.body.leadId).toBe(createdLeadId);
  });

  it('GET /api/leads/:id/notes - should return lead notes', async () => {
    const response = await request(app).get(`/api/leads/${createdLeadId}/notes`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('POST /api/leads - should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: 'Invalid Email User',
        email: 'invalid-email-format',
        phone: '1234567890'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('GET /api/leads/99999 - should return 404 for non-existent lead', async () => {
    const response = await request(app).get('/api/leads/99999');
    expect(response.status).toBe(404);
  });
});
