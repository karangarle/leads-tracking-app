import { getDb } from './db';

const initialLeads = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@yopmail.com',
    phone: '+1 (555) 019-2834',
    status: 'qualified',
    notes: [
      'Expressed interest in defense AI security solutions.',
      'Scheduled a demo call for next Tuesday at 2 PM.'
    ]
  },
  {
    name: 'Alex Mercer',
    email: 'alex.mercer@yopmail.com',
    phone: '+1 (555) 014-8899',
    status: 'contacted',
    notes: [
      'Initial cold outreach sent via LinkedIn.',
      'Replied asking for product documentation and pricing details.'
    ]
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@yopmail.com',
    phone: '+1 (555) 012-4411',
    status: 'new',
    notes: [
      'Inbound web form submission.'
    ]
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@yopmail.com',
    phone: '+1 (555) 018-7733',
    status: 'lost',
    notes: [
      'Budget constraints; postponed project until next fiscal year.'
    ]
  },
  {
    name: 'David Kim',
    email: 'dkim@yopmail.com',
    phone: '+1 (555) 011-3322',
    status: 'qualified',
    notes: [
      'Enterprise tier prospect. Requested custom SLA addendum.'
    ]
  }
];

async function seed() {
  console.log('Seeding database...');
  const db = await getDb();

  // Clear existing data
  await db.exec('DELETE FROM notes;');
  await db.exec('DELETE FROM leads;');

  for (const lead of initialLeads) {
    const result = await db.run(
      'INSERT INTO leads (name, email, phone, status) VALUES (?, ?, ?, ?)',
      [lead.name, lead.email, lead.phone, lead.status]
    );

    const leadId = result.lastID;
    if (lead.notes && lead.notes.length > 0) {
      for (const noteContent of lead.notes) {
        await db.run('INSERT INTO notes (leadId, content) VALUES (?, ?)', [leadId, noteContent]);
      }
    }
  }

  console.log('Database seeded successfully with sample leads and notes!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
