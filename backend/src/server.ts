import { app } from './app';
import { getDb } from './db';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await getDb();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
