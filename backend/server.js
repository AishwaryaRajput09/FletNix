const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./db');
const authRoutes = require('./routes/auth');
const showRoutes = require('./routes/shows');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://flet-nix-frontend-dev.vercel.app'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shows', showRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FletNix API Server is running.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'FletNix Backend Server is running.' });
});

async function startServer() {
  await connectDB();
}

if (process.env.NODE_ENV !== 'production') {
  startServer().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`FletNix backend server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await disconnectDB();
        console.log('Server stopped.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  });
} else {
  startServer();
}

module.exports = app;
