require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { syncModels, Role } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Mini CRM API is running' });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await syncModels();

    const defaultRoles = ['Admin', 'Sales User'];
    for (const roleName of defaultRoles) {
      await Role.findOrCreate({ where: { role_name: roleName } });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Mini CRM backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
