import cors from 'cors';
import express from 'express';
import { prisma } from './lib/prisma';
import { createMemberRoutes } from './routes/member.routes';
import { createMembershipRoutes } from './routes/membership.routes';
import { createCheckInRoutes } from './routes/checkin.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/members', createMemberRoutes(prisma));
app.use('/api/memberships', createMembershipRoutes(prisma));
app.use('/api/check-ins', createCheckInRoutes(prisma));

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
