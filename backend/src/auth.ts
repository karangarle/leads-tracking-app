import { Request, Response, NextFunction } from 'express';

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  // If basic auth is disabled via ENV, pass through
  if (process.env.ENABLE_AUTH !== 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Leads App"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const auth = Buffer.from(authHeader.split(' ')[1] || '', 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  const validUser = process.env.AUTH_USER || 'admin';
  const validPass = process.env.AUTH_PASS || 'password';

  if (user === validUser && pass === validPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Leads App"');
  return res.status(401).json({ error: 'Invalid credentials' });
}
